export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-[#F5F4FA] text-black grid lg:grid-cols-[1fr_480px]">
      <section className="hidden lg:flex flex-col justify-between bg-[#1E1636] text-white px-12 py-10">
        <div>
          <p className="text-sm text-[#DDD6F6] font-semibold tracking-wide">Telygence AI</p>
          <h1 className="mt-16 max-w-xl text-4xl font-bold leading-tight">
            Write, organize, and follow up with more clarity.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-[#C4B8F5]">
            Your drafts, templates, and tasks stay synced to your secure workspace.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs text-[#DDD6F6]">
          <div className="rounded-lg bg-white/10 p-4">AI-ready drafts</div>
          <div className="rounded-lg bg-white/10 p-4">Reusable templates</div>
          <div className="rounded-lg bg-white/10 p-4">Task tracking</div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <p className="lg:hidden text-sm text-[#775ADA] font-semibold tracking-wide">Telygence AI</p>
            <h2 className="mt-2 text-2xl font-bold text-[#1C1C1C]">{title}</h2>
            <p className="mt-2 text-sm text-[#737373]">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
