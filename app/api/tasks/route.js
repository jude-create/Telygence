import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentDbUser } from "@/app/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_COLORS = {
  todo: "#FF304F",
  inProgress: "#D89E07",
  completed: "#03A12F",
};

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

function formatTask(task) {
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
    imageSrc: "",
    flagColor: STATUS_COLORS[task.status] || "#BABABA",
    status: task.status,
  };
}

function groupTasks(tasks) {
  return {
    todo: tasks.filter((task) => task.status === "todo").map(formatTask),
    inProgress: tasks.filter((task) => task.status === "inProgress").map(formatTask),
    completed: tasks.filter((task) => task.status === "completed").map(formatTask),
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

  return NextResponse.json(groupTasks(tasks));
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

  return NextResponse.json(formatTask(task), { status: 201 });
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

  const task = await prisma.task.findFirst({
    where: { id: body.id, userId: user.id },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(formatTask(task));
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

  return NextResponse.json({ ok: true });
}
