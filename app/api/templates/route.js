import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentDbUser } from "@/app/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatTemplate(template) {
  return {
    id: template.id,
    message: template.message,
    tags: template.tags || [],
    placeholders: template.placeholders || [],
  };
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
}

async function getRouteUser() {
  const user = await getCurrentDbUser();
  if (!user) return null;
  return user;
}

export async function GET() {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const templates = await prisma.template.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(templates.map(formatTemplate));
}

export async function POST(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const message = body.message?.trim();
  const tags = normalizeStringList(body.tags);
  const placeholders = normalizeStringList(body.placeholders);

  if (!message) {
    return NextResponse.json({ error: "Template message is required" }, { status: 400 });
  }

  const template = await prisma.template.create({
    data: {
      message,
      tags,
      placeholders,
      userId: user.id,
    },
  });

  return NextResponse.json(formatTemplate(template), { status: 201 });
}

export async function PATCH(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  if (!body.id || typeof body.message !== "string") {
    return NextResponse.json({ error: "Template id and message are required" }, { status: 400 });
  }

  await prisma.template.updateMany({
    where: { id: body.id, userId: user.id },
    data: {
      message: body.message.trim(),
      ...(Array.isArray(body.tags) ? { tags: normalizeStringList(body.tags) } : {}),
      ...(Array.isArray(body.placeholders) ? { placeholders: normalizeStringList(body.placeholders) } : {}),
    },
  });

  const template = await prisma.template.findFirst({
    where: { id: body.id, userId: user.id },
  });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(formatTemplate(template));
}

export async function DELETE(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const deleteAll = searchParams.get("all") === "true";

  if (deleteAll) {
    await prisma.template.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ ok: true });
  }

  if (!id) {
    return NextResponse.json({ error: "Template id is required" }, { status: 400 });
  }

  await prisma.template.deleteMany({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ ok: true });
}
