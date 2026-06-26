"use client";

import { ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { loadAccountSettings } from "../lib/accountSettings";

const Suggestion = () => {
  const suggestionSets = [
    [
      {
        title: "Investor proposal follow-up",
        context: "Based on your proposal templates",
        prompt: "Write a concise follow-up email after sending an investor proposal. Keep the tone professional, confident, and easy to reply to.",
      },
      {
        title: "Partnership outreach email",
        context: "Suggested from recent templates",
        prompt: "Write a friendly partnership outreach email introducing the company, explaining the fit, and asking for a short call.",
      },
      {
        title: "Company summary draft",
        context: "Useful for investor and client replies",
        prompt: "Write a clear company summary that explains what we do, who we help, and why it matters.",
      },
    ],
    [
      {
        title: "Cold email follow-up",
        context: "Useful for job hunt and sales templates",
        prompt: "Write a short cold email follow-up that politely reminds the recipient, adds one useful detail, and asks for a response.",
      },
      {
        title: "Client onboarding note",
        context: "Suggested from template categories",
        prompt: "Write a welcoming client onboarding message with next steps, expectations, and a friendly closing.",
      },
      {
        title: "Task status update",
        context: "Useful for active work",
        prompt: "Write a crisp task status update covering progress, blockers, and the next action.",
      },
    ],
  ];
  const [setIndex, setSetIndex] = useState(0);
  const [settings, setSettings] = useState(loadAccountSettings);
  const suggestions = suggestionSets[setIndex];

  useEffect(() => {
    const syncSettings = (event) => {
      setSettings(event.detail || loadAccountSettings());
    };

    window.addEventListener("telygence-settings-change", syncSettings);
    window.addEventListener("storage", syncSettings);
    return () => {
      window.removeEventListener("telygence-settings-change", syncSettings);
      window.removeEventListener("storage", syncSettings);
    };
  }, []);

  const buildDraftHref = (suggestion) => {
    const params = new URLSearchParams({
      title: suggestion.title,
      prompt: suggestion.prompt,
    });
    return `/drafts?${params.toString()}`;
  };

  const refreshSuggestions = () => {
    setSetIndex((current) => (current + 1) % suggestionSets.length);
  };

  const suggestionsWithHrefs = suggestions.map((suggestion) => ({
    ...suggestion,
    href: buildDraftHref(suggestion),
  }));

  if (!settings.smartSuggestions) {
    return (
      <section className="w-full rounded-xl border border-[#E7E4F0] bg-white p-5 text-sm text-[#737373] shadow-sm">
        Smart suggestions are turned off in Account.
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl border border-[#E7E4F0] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 md:p-5">
        <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEEBFB] text-[#5943A3] sm:h-10 sm:w-10 sm:rounded-xl">
            <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-[#001C3D] sm:text-base">
                <span className="sm:hidden">Next drafts</span>
                <span className="hidden sm:inline">Suggested next drafts</span>
              </h2>
              <span className="hidden items-center gap-1 rounded-full bg-[#C9F1FE80] px-2.5 py-1 text-xs font-medium text-[#1E95BB] sm:inline-flex">
                <SparklesIcon className="h-3.5 w-3.5" />
                AI-assisted
              </span>
            </div>
            <p className="mt-1 hidden text-sm text-[#737373] sm:block">
              Shortcuts to draft ideas Telygence can prepare from your templates, drafts, and tasks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshSuggestions}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D9D2F5] text-[#5943A3] hover:bg-[#F5F2FF] sm:h-10 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-medium"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Refresh</span>
        </button>
      </div>

      {suggestionsWithHrefs.length > 0 ? (
        <div className="flex snap-x gap-3 overflow-x-auto border-t border-[#EDEDED] px-3 py-3 sm:p-4 md:grid md:grid-cols-3 md:overflow-visible md:p-5">
          {suggestionsWithHrefs.map((suggestion, index) => (
            <Link
              key={index}
              href={suggestion.href}
              className="group flex min-h-[86px] min-w-[78%] snap-start items-start gap-3 rounded-lg border border-[#E7E4F0] bg-[#FAFAFD] p-3 transition-colors hover:border-[#775ADA] hover:bg-[#F5F2FF] sm:min-w-[18rem] md:min-h-[92px] md:min-w-0"
            >
              <DocumentTextIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#775ADA]" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#1E1636]">{suggestion.title}</span>
                <span className="mt-1 block text-xs leading-5 text-[#737373]">{suggestion.context}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-t border-[#EDEDED] p-5 text-sm text-[#737373]">
          Create a few drafts or tasks and Telygence will suggest useful next messages here.
        </div>
      )}
    </section>
  );
};

export default Suggestion;
