"use client"
import { UserIcon, PencilIcon, KeyIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useState } from "react";

const USER_DATA = {
  name: "Joel Mgbikeh",
  email: "mgbikehjoel@gmail.com",
  agency: "Telygence",
  area: "AI",
  profileImage: "/images/profile.png",
};

// ─── Reusable toggle ──────────────────────────────────────────────────────────

function Toggle({ enabled, onToggle }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative w-12 h-6 flex items-center rounded-full shrink-0 transition-colors duration-300
        ${enabled ? "bg-[#28C7FA]" : "bg-gray-300"}`}
    >
      <span
        className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform duration-300
          ${enabled ? "translate-x-7" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({ title, description, enabled, onToggle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#EDEDED] p-4 rounded-xl">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#1C1C1C]">{title}</p>
        <p className="text-xs text-[#737373] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

// ─── Outline pill button ──────────────────────────────────────────────────────

function PillButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border-2 border-[#775ADA] text-[#775ADA] rounded-full
                 py-2 px-4 text-sm font-medium whitespace-nowrap
                 hover:bg-[#775ADA] hover:text-white transition-all duration-200"
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Account({ signInMethod = "google" }) {
  const [features, setFeatures] = useState({
    smartSuggestions: true,
    writingStyle: false,
  });

  const toggleFeature = (key) =>
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));

  const isGoogle = signInMethod === "google";

  return (
    <div className="p-4 sm:p-6 lg:p-7 w-full space-y-4">

      {/* ── Page title ───────────────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-8 py-4 bg-white rounded-xl">
        <p className="text-base sm:text-xl font-medium">My Account</p>
      </div>

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div className="bg-[#F8F8F8] w-full py-5 px-4 sm:px-8 rounded-xl">
        <p className="text-sm text-[#4D4D4D] font-medium mb-4">Profile information</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          {/* Avatar */}
          <div className="shrink-0">
            {USER_DATA.profileImage ? (
              <Image
                src={USER_DATA.profileImage}
                alt="Profile"
                height={80} width={80}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
            ) : (
              <div className="bg-[#D2D2D2] p-2 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <UserIcon className="text-[#999999] w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            )}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-[#1C1C1C]">{USER_DATA.name}</p>
              <span className="text-xs bg-[#D6DCE2] rounded-full px-2.5 py-1 text-[#002651] font-medium">
                Agency
              </span>
            </div>
            <p className="text-sm text-[#737373] mt-0.5">{USER_DATA.email}</p>
          </div>

          {/* Meta: Agency + Area */}
          <div className="flex gap-6 sm:gap-10 shrink-0">
            <div>
              <p className="text-xs text-[#8093A8]">Agency</p>
              <p className="text-sm font-medium text-[#002651] mt-0.5">{USER_DATA.agency}</p>
            </div>
            <div>
              <p className="text-xs text-[#8093A8]">Area</p>
              <p className="text-sm font-medium text-[#002651] mt-0.5">{USER_DATA.area}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {!isGoogle && (
              <PillButton icon={KeyIcon} label="Change password" />
            )}
            <PillButton icon={PencilIcon} label="Edit profile" />
          </div>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <div className="bg-[#F8F8F8] rounded-xl px-4 sm:px-8 py-6 space-y-3">
        <p className="text-sm text-[#4D4D4D] font-medium mb-1">Features</p>

        <FeatureRow
          title="Smart suggestions"
          description="Telygence smart suggestions are based on your recent templates, drafts, and tasks."
          enabled={features.smartSuggestions}
          onToggle={() => toggleFeature("smartSuggestions")}
        />
        <FeatureRow
          title="Writing style"
          description="Activating writing styles helps AI determine the tone of your writing."
          enabled={features.writingStyle}
          onToggle={() => toggleFeature("writingStyle")}
        />

        <div className="border-t-2 border-[#EDEDED] pt-5 mt-2 flex justify-end gap-3">
          <button className="py-2 px-5 border-2 border-[#775ADA] text-[#775ADA] rounded-full text-sm
                             hover:bg-[#775ADA] hover:text-white transition-all duration-200">
            Cancel
          </button>
          <button className="py-2 px-6 bg-[#775ADA] text-white rounded-full text-sm
                             hover:bg-[#5F48C2] transition-colors duration-200 shadow-sm">
            Save
          </button>
        </div>
      </div>

    </div>
  );
}