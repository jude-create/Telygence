import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/app/lib/prisma";
import { getCurrentDbUser } from "@/app/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_COLORS = {
  todo: "#FF304F",
  inProgress: "#D89E07",
  completed: "#03A12F",
};
const TASK_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "tasks");
const TASK_UPLOAD_URL = "/uploads/tasks";
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const MAX_IMAGE_BYTES = 1_500_000;

function parseImageDataUrl(imageSrc) {
  if (typeof imageSrc !== "string" || !imageSrc.startsWith("data:image/")) return null;

  const match = imageSrc.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/);
  if (!match) return "invalid";

  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  const buffer = Buffer.from(match[2], "base64");

  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) return "invalid";

  return { extension, buffer };
}

async function removeTaskImages(taskId) {
  await Promise.all(
    IMAGE_EXTENSIONS.map((extension) =>
      fs.unlink(path.join(TASK_UPLOAD_DIR, `${taskId}.${extension}`)).catch(() => null),
    ),
  );
}

async function saveTaskImage(taskId, imageSrc) {
  if (typeof imageSrc !== "string") return;
  if (imageSrc.startsWith(TASK_UPLOAD_URL)) return;

  if (!imageSrc) {
    await removeTaskImages(taskId);
    return;
  }

  const parsed = parseImageDataUrl(imageSrc);
  if (!parsed || parsed === "invalid") return;

  await fs.mkdir(TASK_UPLOAD_DIR, { recursive: true });
  await removeTaskImages(taskId);
  await fs.writeFile(path.join(TASK_UPLOAD_DIR, `${taskId}.${parsed.extension}`), parsed.buffer);
}

async function getTaskImageSrc(taskId) {
  for (const extension of IMAGE_EXTENSIONS) {
    const filePath = path.join(TASK_UPLOAD_DIR, `${taskId}.${extension}`);
    try {
      await fs.access(filePath);
      return `${TASK_UPLOAD_URL}/${taskId}.${extension}`;
    } catch {
      // Try the next supported extension.
    }
  }

  return "";
}

function parseDueDate(deadline, time) {
  if (!deadline) return null;

  const dateTime = new Date(`${deadline}T${time || "00:00"}`);
  if (Number.isNaN(dateTime.getTime())) return "invalid";

  return dateTime;
}

function normalizeStatus(status) {
  if (["todo", "inProgress", "completed"].includes(status)) return status;
  if (status === "To do") return "todo";
  if (status === "In progress") return "inProgress";
  if (status === "Completed") return "completed";
  return "todo";
}

async function formatTask(task) {
  const updatedAt = new Date(task.updatedAt);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    dueDate: dueDate
      ? new Intl.DateTimeFormat("en", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(dueDate)
      : "No deadline",
    deadline: dueDate ? dueDate.toISOString().slice(0, 10) : "",
    time: new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(dueDate || updatedAt),
    dueTime: dueDate ? dueDate.toTimeString().slice(0, 5) : "",
    imageSrc: await getTaskImageSrc(task.id),
    flagColor: STATUS_COLORS[task.status] || "#BABABA",
    status: task.status,
  };
}

async function groupTasks(tasks) {
  const formattedTasks = await Promise.all(tasks.map(formatTask));

  return {
    todo: formattedTasks.filter((task) => task.status === "todo"),
    inProgress: formattedTasks.filter((task) => task.status === "inProgress"),
    completed: formattedTasks.filter((task) => task.status === "completed"),
  };
}

async function getRouteUser() {
  const user = await getCurrentDbUser();
  if (!user) return null;
  return user;
}

export async function GET() {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(await groupTasks(tasks));
}

export async function POST(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const title = body.title?.trim();
  const dueDate = parseDueDate(body.deadline, body.dueTime);

  if (!title) {
    return NextResponse.json({ error: "Task title is required" }, { status: 400 });
  }

  if (dueDate === "invalid") {
    return NextResponse.json({ error: "Enter a valid deadline and time" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: body.description?.trim() || null,
      priority: body.priority || "Medium",
      status: normalizeStatus(body.status),
      dueDate,
      userId: user.id,
    },
  });

  await saveTaskImage(task.id, body.imageSrc);

  return NextResponse.json(await formatTask(task), { status: 201 });
}

export async function PATCH(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const dueDate = parseDueDate(body.deadline, body.dueTime);

  if (!body.id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  if (dueDate === "invalid") {
    return NextResponse.json({ error: "Enter a valid deadline and time" }, { status: 400 });
  }

  await prisma.task.updateMany({
    where: { id: body.id, userId: user.id },
    data: {
      ...(typeof body.title === "string" ? { title: body.title.trim() } : {}),
      ...(typeof body.description === "string" ? { description: body.description.trim() } : {}),
      ...(typeof body.priority === "string" ? { priority: body.priority } : {}),
      ...(typeof body.status === "string" ? { status: normalizeStatus(body.status) } : {}),
      ...(Object.prototype.hasOwnProperty.call(body, "deadline") ? { dueDate } : {}),
    },
  });

  if (Object.prototype.hasOwnProperty.call(body, "imageSrc")) {
    await saveTaskImage(body.id, body.imageSrc);
  }

  const task = await prisma.task.findFirst({
    where: { id: body.id, userId: user.id },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(await formatTask(task));
}

export async function DELETE(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  await prisma.task.deleteMany({
    where: { id, userId: user.id },
  });

  await removeTaskImages(id);

  return NextResponse.json({ ok: true });
}
