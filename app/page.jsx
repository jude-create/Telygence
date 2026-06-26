"use client";
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/solid";
import RecentTemplates from "./components/RecentTemplates";   
import Suggestion from "./components/Suggestion";
import { RecentDraft } from "./components/RecentDraft";
import RecentTask from "./components/RecentTask";
import { useState } from "react";
import Template from "./modals/Template";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useDashboardData } from "./hooks/useDashboardData";
import { ErrorState } from "./components/LoadingState";

export default function Home() {
  const [templateModal, setTemplateModal] = useState(false);
  const dashboard = useDashboardData();
  const now = new Date();

  return (
    <>
      <div className="p-3 sm:p-5 lg:p-7 space-y-4">
        {/* Top bar */}
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row justify-between gap-2 px-4 md:px-6 py-4 bg-white rounded-xl border border-[#E7E4F0] shadow-sm">
            <div className="flex items-center gap-2 ">
              <p className="text-base md:text-xl font-medium">Welcome back</p>
              <Image src="/images/hand.png" alt="hand" width={28} height={28} className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <p className="font-normal text-xs md:text-base text-[#737373]">
              {now.toLocaleString([], { hour: "2-digit", minute: "2-digit", weekday: "short", month: "short", day: "numeric" })}
            </p>
          </div>

          <div className="w-full lg:w-[40%] grid grid-cols-[minmax(0,1fr)_minmax(96px,0.55fr)] sm:grid-cols-[1fr_140px] gap-2 sm:gap-3">
            <button
              onClick={() => setTemplateModal((o) => !o)}
              className="flex min-w-0 justify-center items-center gap-1.5 sm:gap-2 rounded-xl bg-custom-radial min-h-12 px-2 sm:px-3
                text-xs sm:text-sm md:text-lg font-bold tracking-wide text-white
                transition-all ease-in-out duration-500 hover:tracking-wider"
            >
              <span className="truncate">Create a template</span>
              <PlusIcon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            </button>

            <Link href="/drafts" className="w-full">
              <button className="flex min-w-0 justify-center items-center gap-1.5 sm:gap-2 tracking-wide sm:tracking-wider border-2 sm:border-4
                border-[#1E95BB] min-h-12 w-full bg-[#C9F1FE80] px-2 sm:px-3 rounded-xl
                text-xs sm:text-sm md:text-lg font-bold text-[#1E95BB]
                transition-all ease-in-out duration-500 hover:text-white hover:bg-[#775ADA]">
                <span>Write</span>
                <PencilSquareIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </Link>
          </div>
        </div>
        <div>
          <ErrorState message={dashboard.error} />
        </div>
        <Suggestion />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)] gap-4 w-full">
          <div className="w-full min-w-0 space-y-4">
            <RecentTemplates
              templates={dashboard.templates}
              isLoading={dashboard.isLoading}
              deletingTemplateId={dashboard.deletingTemplateId}
              onDeleteTemplate={dashboard.deleteTemplate}
            />
            <RecentDraft
              drafts={dashboard.drafts}
              isLoading={dashboard.isLoading}
              deletingDraftId={dashboard.deletingDraftId}
              onDeleteDraft={dashboard.deleteDraft}
              onToggleStar={dashboard.toggleDraftStar}
            />
          </div>
          <div className="w-full min-w-0 space-y-4">
            <RecentTask tasks={dashboard.tasks} isLoading={dashboard.isLoading} />
          </div>
        </div>
      </div>

      <Template
        templateModal={templateModal}
        handleTemplateModal={() => setTemplateModal((o) => !o)}
      />
    </>
  );
}
