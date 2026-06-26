import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentDbUser } from "@/app/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDraftPreview(content) {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function formatDraft(draft) {
  return {
    id: draft.id,
    title: draft.title,
    content: draft.content,
    description: getDraftPreview(draft.content),
    time: new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(draft.updatedAt),
    isStarred: draft.isStarred,
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
  const drafts = await prisma.draft.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(drafts.map(formatDraft));
}

export async function POST(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const title = body.title?.trim() || "Untitled draft";
  const content = body.content || "";

  const draft = await prisma.draft.create({
    data: {
      title,
      content,
      isStarred: Boolean(body.isStarred),
      userId: user.id,
    },
  });

  return NextResponse.json(formatDraft(draft), { status: 201 });
}

export async function PATCH(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();

  if (!body.id) {
    return NextResponse.json({ error: "Draft id is required" }, { status: 400 });
  }

  await prisma.draft.updateMany({
    where: { id: body.id, userId: user.id },
    data: {
      ...(typeof body.title === "string" ? { title: body.title.trim() || "Untitled draft" } : {}),
      ...(typeof body.content === "string" ? { content: body.content } : {}),
      ...(typeof body.isStarred === "boolean" ? { isStarred: body.isStarred } : {}),
    },
  });

  const draft = await prisma.draft.findFirst({
    where: { id: body.id, userId: user.id },
  });

  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  return NextResponse.json(formatDraft(draft));
}

export async function DELETE(request) {
  const user = await getRouteUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Draft id is required" }, { status: 400 });
  }

  await prisma.draft.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
