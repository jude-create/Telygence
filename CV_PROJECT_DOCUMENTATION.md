# Telygence Project Documentation for CV Writing

## Project Summary

Telygence is an AI-assisted productivity dashboard for managing writing workflows, reusable message templates, and task tracking in a single authenticated workspace. It helps users move from ideas to polished drafts, reusable templates, and follow-up tasks without switching between separate tools.

The project is a full-stack web application built with Next.js App Router, React, Tailwind CSS, Clerk authentication, Prisma, PostgreSQL, Zustand, Tiptap, and AI provider integrations. It includes authenticated user data, CRUD APIs, rich text editing, template management, a task board, image uploads, notifications, and AI-powered writing/task generation.

Live demo: https://telygence-one.vercel.app/

Repository: https://github.com/jude-create/telygence

## One-Line CV Description

Built Telygence, a full-stack AI productivity dashboard that combines draft writing, reusable templates, and task management using Next.js, React, Prisma, PostgreSQL, Clerk, Tailwind CSS, and AI API integrations.

## Problem the Project Solves

Many users manage communication work across separate tools: notes for drafts, spreadsheets or documents for templates, task apps for follow-ups, and AI tools for writing assistance. Telygence brings these workflows into one workspace so users can:

- Write and save drafts.
- Generate or improve writing with AI.
- Create reusable templates with tags and placeholders.
- Track tasks across workflow statuses.
- Manage account preferences and user-specific data.
- Access recent work from a central dashboard.

## Target Users

Telygence is useful for freelancers, creators, marketers, students, support agents, founders, and teams who frequently write messages, manage repeated communication, and track follow-up work.

## Core Features

### Authentication and User Accounts

- Integrated Clerk authentication for sign-in, sign-up, session handling, and protected routes.
- Custom sign-in and sign-up pages.
- Middleware protects dashboard pages and API routes from unauthenticated access.
- User records are synchronized into the PostgreSQL database using Clerk user data.
- Account page allows users to view profile details, update profile fields, and save local feature preferences.

### Dashboard

- Central homepage that shows recent templates, tasks, and drafts.
- Fetches templates, drafts, and tasks in parallel for faster loading.
- Includes quick actions for creating templates and writing drafts.
- Supports optimistic deletion and star toggling for recent drafts.
- Shows loading and error states to improve user feedback.

### Draft Writing

- Draft writing workspace with title, star status, and rich text content.
- Uses a Tiptap-based editor for formatting and structured draft content.
- Supports creating, saving, editing, deleting, and starring drafts.
- Drafts are persisted per user through Prisma and PostgreSQL.
- Includes AI-assisted draft generation from a prompt or draft idea.
- Includes save state messaging such as ready, saving, saved, editing, and error states.

### Template Management

- Users can create, edit, copy, share, delete, and bulk-delete templates.
- Templates can include tags and placeholders for reusable message workflows.
- Tag and placeholder pickers allow users to organize and customize templates.
- Template metadata is hydrated from existing templates to keep available tags/placeholders in sync.
- Supports selection and bulk operations for efficient template management.
- Clipboard copy support makes templates easy to reuse outside the app.

### Task Management

- Task board with status columns: todo, in progress, and completed.
- Supports creating, editing, deleting, and moving tasks across statuses.
- Drag-and-drop task movement using a DnD library.
- Responsive behavior switches toward list-style usage on smaller screens.
- Tasks support title, description, priority, deadline, due time, status, and optional image cover.
- Image uploads are resized client-side and stored in `public/uploads/tasks`.
- Task updates use optimistic UI patterns with rollback on failure.

### AI Assistance

- AI route supports multiple tools:
  - Autocomplete draft continuation.
  - Rewrite text for clarity and flow.
  - Generate reusable templates.
  - Create polished first drafts.
  - Convert rough notes into structured tasks.
- Supports OpenAI Responses API through `OPENAI_API_KEY`.
- Supports Gemini through `GEMINI_API_KEY`.
- Uses configurable provider selection through `AI_PROVIDER`.
- Includes fallback Gemini model handling for reliability.
- Validates AI tool names, handles missing API keys, trims large input, and returns structured JSON for generated tasks.

### Notifications and UI Feedback

- Uses Zustand stores for notification and sidebar state.
- Provides success and error feedback for actions like saving, deleting, creating templates, updating tasks, and profile changes.
- Uses loading, empty, and error states across the app to make workflows clearer.

## Technical Stack

### Frontend

- Next.js App Router
- React
- Tailwind CSS
- Heroicons
- Tiptap rich text editor
- Framer Motion
- Responsive layouts with mobile and desktop states

### Backend

- Next.js API routes
- Prisma ORM
- PostgreSQL
- Clerk server-side auth helpers
- Node.js runtime for API routes that need filesystem or database access

### State and Data Management

- React hooks for page-specific data and actions.
- Zustand for app-level notification/sidebar stores.
- Optimistic UI updates for smoother user interactions.
- Prisma models for users, drafts, templates, and tasks.

### AI and External Services

- OpenAI Responses API support.
- Google Gemini API support.
- Clerk authentication.
- Vercel deployment.

## Database Models

### User

Stores the app user and links the user to Clerk authentication.

Important fields:

- `id`
- `clerkId`
- `email`
- `name`
- `createdAt`

Relations:

- One user has many drafts.
- One user has many templates.
- One user has many tasks.

### Draft

Stores saved writing drafts.

Important fields:

- `title`
- `content`
- `isStarred`
- `userId`
- `createdAt`
- `updatedAt`

### Template

Stores reusable message templates.

Important fields:

- `message`
- `tags`
- `placeholders`
- `userId`
- `createdAt`
- `updatedAt`

### Task

Stores user tasks.

Important fields:

- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `userId`
- `createdAt`
- `updatedAt`

## Architecture Overview

Telygence uses the Next.js App Router structure:

- `app/page.jsx`: dashboard page.
- `app/drafts/page.jsx`: draft writing page.
- `app/templates/page.jsx`: template management page.
- `app/tasks/page.jsx`: task board page.
- `app/account/page.jsx`: account settings page.
- `app/api/*`: backend API routes for AI, drafts, tasks, templates, and auth.
- `app/hooks/*`: reusable client-side data and interaction logic.
- `app/components/*`: reusable UI components.
- `app/modals/*`: modal dialogs for templates, tasks, sharing, deletion, placeholders, and writing styles.
- `app/lib/*`: Prisma client, account settings, and current user helpers.
- `app/store/*`: Zustand stores.
- `prisma/schema.prisma`: database schema.

The app follows a practical full-stack pattern:

1. Clerk authenticates the user.
2. Middleware protects routes and API endpoints.
3. `getCurrentDbUser` maps the Clerk user to a database user.
4. Client hooks call API routes with `fetch`.
5. API routes validate input, check the current user, and read/write database records with Prisma.
6. The UI updates state, shows loading/errors, and uses optimistic updates where appropriate.

## Important Implementation Details

### Authenticated Per-User Data

API routes call `getCurrentDbUser()` before reading or writing data. This ensures that templates, drafts, and tasks belong to the signed-in user. Updates and deletes also filter by both record ID and user ID, which prevents users from modifying other users' records.

### Prisma Client Setup

The Prisma client uses the PostgreSQL adapter and stores the generated client in `app/generated/prisma`. In development, the Prisma client is cached on `globalThis` to avoid creating too many connections during hot reloads.

### AI Provider Abstraction

The AI route can call either OpenAI or Gemini depending on environment variables. It keeps the app flexible by allowing provider selection without changing frontend code. Each AI action uses a prompt from a central `TOOL_PROMPTS` object.

### Optimistic UI

Several flows update the UI before the server response completes:

- Dashboard template deletion.
- Dashboard draft deletion.
- Draft star toggling.
- Task movement across board columns.
- Task deletion.

If a request fails, the previous state is restored and an error is shown.

### Task Image Handling

Task images are resized in the browser, sent as data URLs, validated on the API route, and saved to `public/uploads/tasks`. The server limits supported formats and file size before writing images.

### Responsive Product UI

The app uses responsive Tailwind layouts across dashboard, drafts, templates, tasks, and account pages. The task board adjusts behavior for smaller screens, and modals use mobile-friendly bottom-sheet layouts.

## Main API Routes

### `/api/templates`

Methods:

- `GET`: fetch current user's templates.
- `POST`: create a template.
- `PATCH`: edit a template message, tags, or placeholders.
- `DELETE`: delete one template or all templates for the user.

### `/api/drafts`

Methods:

- `GET`: fetch current user's drafts.
- `POST`: create a draft.
- `PATCH`: update draft title, content, or star status.
- `DELETE`: delete a draft.

### `/api/tasks`

Methods:

- `GET`: fetch current user's tasks grouped by status.
- `POST`: create a task.
- `PATCH`: update a task.
- `DELETE`: delete a task and remove its uploaded image.

### `/api/ai`

Methods:

- `POST`: run an AI action such as autocomplete, rewrite, template generation, draft generation, or task extraction.

## Main Skills Demonstrated

- Full-stack web application development.
- Next.js App Router architecture.
- React component design.
- Client-side state management with hooks and Zustand.
- REST-style API route development.
- Authentication and route protection with Clerk.
- Database modeling with Prisma and PostgreSQL.
- AI API integration with provider fallback.
- Rich text editing with Tiptap.
- Drag-and-drop task workflows.
- File upload/image handling.
- Responsive UI implementation with Tailwind CSS.
- Optimistic UI updates and error rollback.
- Deployment readiness for Vercel.

## Strong CV Bullet Options

Use 3 to 5 of these depending on CV space:

- Built Telygence, a full-stack AI productivity dashboard for managing drafts, reusable templates, and tasks using Next.js, React, Prisma, PostgreSQL, Clerk, and Tailwind CSS.
- Implemented authenticated per-user CRUD workflows for drafts, templates, and tasks with protected Next.js API routes and Prisma-backed PostgreSQL models.
- Integrated AI-assisted writing features for draft generation, text rewriting, template creation, autocomplete, and structured task extraction using OpenAI/Gemini provider support.
- Developed a responsive task management board with drag-and-drop status updates, priorities, deadlines, image covers, optimistic UI updates, and rollback handling.
- Built a template management system with tags, placeholders, clipboard copying, editing, sharing UI, selection, and bulk deletion workflows.
- Created a rich draft editor experience using Tiptap, including saved drafts, starred drafts, editing flows, and AI-generated draft suggestions.
- Designed reusable React hooks and Zustand stores to manage dashboard data, templates, drafts, tasks, notifications, and sidebar state.
- Added robust user feedback with loading states, empty states, success notifications, validation, and error handling across key workflows.
- Configured Clerk authentication and middleware to protect private pages and API endpoints while synchronizing Clerk users with database user records.
- Prepared the app for Vercel deployment with documented environment variables, Prisma generation, and production build scripts.

## Short CV Project Entry

Telygence - AI Productivity Dashboard  
Next.js, React, Tailwind CSS, Prisma, PostgreSQL, Clerk, Zustand, Tiptap, OpenAI/Gemini

Built a full-stack productivity workspace that helps users write drafts, create reusable message templates, and manage tasks. Implemented Clerk authentication, per-user Prisma/PostgreSQL data models, protected API routes, rich text editing, drag-and-drop task workflows, template tags/placeholders, notifications, and AI-powered draft/template/task generation.

## Longer CV Project Entry

Telygence - AI-Assisted Productivity Dashboard  
Next.js, React, Tailwind CSS, Prisma, PostgreSQL, Clerk, Zustand, Tiptap, OpenAI/Gemini

- Developed a full-stack productivity dashboard that combines draft writing, reusable templates, and task tracking in one authenticated workspace.
- Built protected API routes and Prisma/PostgreSQL models for user-specific drafts, templates, and tasks, with Clerk authentication and user synchronization.
- Integrated AI-powered workflows for autocomplete, rewriting, template generation, first-draft generation, and converting rough notes into structured tasks.
- Implemented a responsive task board with drag-and-drop movement, priority/deadline tracking, image cover uploads, optimistic updates, and rollback on failed requests.
- Created reusable React hooks and Zustand stores for dashboard loading, template workflows, draft editing, task management, notifications, and shared UI state.

## Interview Talking Points

### Why I Built It

I built Telygence to solve the problem of managing writing, reusable communication, and follow-up tasks across too many separate tools. The goal was to create one workspace where users can generate writing with AI, save it as drafts, turn repeated messages into templates, and track the tasks that come from that work.

### Most Technical Part

The most technical part was connecting the frontend workflows to authenticated full-stack data. Every draft, task, and template is tied to the current Clerk user, and the API routes validate the user before performing database operations. I also implemented optimistic UI updates so the app feels fast while still rolling back changes when a request fails.

### AI Integration

The AI route supports multiple tools through a shared API endpoint. The frontend sends a `tool` value such as `draft`, `rewrite`, `template`, `autocomplete`, or `task`, and the backend chooses the correct prompt. It can call either OpenAI or Gemini depending on environment variables, which makes the AI layer configurable.

### What I Learned

This project strengthened my skills in building full-stack Next.js applications, modeling relational data with Prisma, protecting user data with authentication middleware, integrating AI APIs, managing complex React state, and designing product workflows that feel responsive and practical.

## Possible Improvements to Mention

If asked what could be improved next, good answers include:

- Add automated tests for API routes and critical UI flows.
- Add shared team workspaces and collaboration.
- Add search and filtering across drafts, templates, and tasks.
- Add analytics for template usage and task completion.
- Move uploaded task images to cloud storage such as S3 or Cloudinary for production scalability.
- Add background jobs for scheduled reminders and follow-ups.

## Suggested GitHub README Summary

Telygence is a full-stack AI productivity dashboard that helps users write drafts, create reusable templates, and manage tasks in one authenticated workspace. It uses Next.js App Router, React, Tailwind CSS, Clerk, Prisma, PostgreSQL, Zustand, Tiptap, and OpenAI/Gemini integrations. Core features include protected per-user data, AI writing tools, rich draft editing, template tags/placeholders, drag-and-drop task management, image uploads, notifications, and responsive UI.

