import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/app/lib/currentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const GEMINI_FALLBACK_MODELS = [
  GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
].filter((model, index, models) => model && models.indexOf(model) === index);
const MAX_INPUT_CHARS = 8000;

const TOOL_PROMPTS = {
  autocomplete:
    "Continue the user's draft naturally. Write only the next useful passage, not the whole document. Keep it concise unless the context clearly needs more.",
  rewrite:
    "Rewrite the user's text to improve clarity, flow, and usefulness. Preserve the meaning. Return only the rewritten text.",
  template:
    "Create a reusable message template. Keep placeholders in double curly braces when useful. Return only the finished template text.",
  draft:
    "Create a polished first draft from the user's draft idea. Return only the draft content, ready to edit or send.",
  task:
    "Turn the user's rough note into a task. Return compact JSON only with keys title, description, priority, status, deadline, and dueTime. Priority must be Low, Medium, or High. Status must be todo, inProgress, or completed. Deadline must be YYYY-MM-DD. DueTime must be HH:MM. Leave deadline and dueTime empty if unknown.",
};

function trimInput(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, MAX_INPUT_CHARS);
}

function extractOutput(data) {
  if (typeof data.output_text === "string") return data.output_text.trim();

  const content = data.output
    ?.flatMap((item) => item.content || [])
    ?.map((part) => part.text || "")
    ?.join("");

  return String(content || "").trim();
}

function parseTask(text) {
  try {
    const parsed = JSON.parse(text.replace(/^```json|```$/g, "").trim());
    return {
      title: String(parsed.title || "").trim(),
      description: String(parsed.description || "").trim(),
      priority: ["Low", "Medium", "High"].includes(parsed.priority) ? parsed.priority : "Medium",
      status: ["todo", "inProgress", "completed"].includes(parsed.status) ? parsed.status : "todo",
      deadline: String(parsed.deadline || "").trim(),
      dueTime: String(parsed.dueTime || "").trim(),
    };
  } catch {
    return {
      title: text.split(/[.\n]/)[0]?.trim() || "New AI task",
      description: text,
      priority: "Medium",
      status: "todo",
      deadline: "",
      dueTime: "",
    };
  }
}

async function generateWithOpenAI({ instructions, input }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions,
      input,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Unable to generate AI response");
  }

  return extractOutput(data);
}

function extractGeminiOutput(data) {
  return String(
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      ?.join("") || "",
  ).trim();
}

async function callGeminiModel({ model, instructions, input }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: instructions }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: input }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || "Unable to generate Gemini response");
    error.status = response.status;
    throw error;
  }

  return extractGeminiOutput(data);
}

async function generateWithGemini({ instructions, input }) {
  let lastError = null;

  for (const model of GEMINI_FALLBACK_MODELS) {
    try {
      return await callGeminiModel({ model, instructions, input });
    } catch (error) {
      lastError = error;
      if (![429, 500, 503].includes(error.status)) break;
    }
  }

  throw lastError || new Error("Unable to generate Gemini response");
}

export async function POST(request) {
  const user = await getCurrentDbUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const tool = body.tool;
  const prompt = TOOL_PROMPTS[tool];
  const provider = process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "openai");

  if (!prompt) {
    return NextResponse.json({ error: "Unknown AI tool" }, { status: 400 });
  }

  if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  if (provider === "openai" && !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
  }

  const input = trimInput(body.input);
  const context = trimInput(body.context);

  if (!input && !context) {
    return NextResponse.json({ error: "Add some text first" }, { status: 400 });
  }

  const instructions = [
    "You are an assistant inside Telygence, a productivity app for drafts, templates, and tasks.",
    "Be practical, direct, and ready to paste into the user's workspace.",
    `Today is ${new Date().toISOString().slice(0, 10)}.`,
    prompt,
  ].join("\n");
  const modelInput = [
    context ? `Context:\n${context}` : "",
    input ? `User text:\n${input}` : "",
  ].filter(Boolean).join("\n\n");

  let text = "";
  try {
    text = provider === "gemini"
      ? await generateWithGemini({ instructions, input: modelInput })
      : await generateWithOpenAI({ instructions, input: modelInput });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (tool === "task") {
    return NextResponse.json({ task: parseTask(text) });
  }

  return NextResponse.json({ text });
}
