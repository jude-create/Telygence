"use client";

import { UserIcon, PencilIcon, KeyIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { LoadingState } from "../components/LoadingState";
import { useNotificationStore } from "../store/NotificationStore";
import { DEFAULT_ACCOUNT_SETTINGS, loadAccountSettings, saveAccountSettings } from "../lib/accountSettings";

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative flex h-6 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
        enabled ? "bg-[#28C7FA]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function FeatureRow({ title, description, enabled, onToggle }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl bg-[#EDEDED] p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#1C1C1C]">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#737373]">{description}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function PillButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-[#775ADA] px-4 py-2 text-sm font-medium text-[#775ADA] transition-all duration-200 hover:bg-[#775ADA] hover:text-white"
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {label}
    </button>
  );
}

function EditProfileModal({ isOpen, form, error, isSaving, onChange, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#EDEDED] px-5 py-4">
          <p className="text-base font-semibold text-[#1C1C1C]">Edit profile</p>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-5">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["agency", "Agency"],
            ["area", "Area"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#1C1C1C]">{label}</span>
              <input
                value={form[key]}
                onChange={(event) => onChange(key, event.target.value)}
                className="min-h-11 w-full rounded-lg border border-[#D8D4E6] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
              />
            </label>
          ))}
          {error && <p className="text-sm text-[#E50606]">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#EDEDED] px-5 py-4">
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg bg-[#DDD6F6] px-5 py-2 text-sm text-[#1E1636] disabled:opacity-60">
            Cancel
          </button>
          <button type="button" onClick={onSave} disabled={isSaving} className="rounded-lg bg-[#775ADA] px-6 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Account({ signInMethod = "google" }) {
  const { user, isLoaded } = useUser();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [settings, setSettings] = useState(DEFAULT_ACCOUNT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_ACCOUNT_SETTINGS);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", agency: "", area: "" });
  const [editError, setEditError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const loaded = loadAccountSettings();
    setSettings(loaded);
    setSavedSettings(loaded);
  }, []);

  const displayName = user?.fullName || user?.firstName || "Your account";
  const email = user?.primaryEmailAddress?.emailAddress || "No email available";
  const profileImage = user?.imageUrl;
  const initials = useMemo(
    () => displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    [displayName],
  );
  const isGoogle = signInMethod === "google";
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const openEditProfile = () => {
    setEditError("");
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      agency: settings.agency,
      area: settings.area,
    });
    setIsEditOpen(true);
  };

  const saveProfile = async () => {
    try {
      setIsSavingProfile(true);
      setEditError("");
      if (user) {
        await user.update({
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim(),
        });
      }
      const nextSettings = {
        ...settings,
        agency: editForm.agency.trim() || DEFAULT_ACCOUNT_SETTINGS.agency,
        area: editForm.area.trim() || DEFAULT_ACCOUNT_SETTINGS.area,
      };
      setSettings(nextSettings);
      setSavedSettings(nextSettings);
      saveAccountSettings(nextSettings);
      addNotification({ message: "Profile updated" });
      setIsEditOpen(false);
    } catch (error) {
      setEditError(error.message || "Unable to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleFeature = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveFeatureSettings = () => {
    setSavedSettings(settings);
    saveAccountSettings(settings);
    addNotification({ message: "Account features saved" });
  };

  const cancelFeatureSettings = () => {
    setSettings(savedSettings);
  };

  return (
    <div className="w-full space-y-4 p-3 sm:p-5 lg:p-7">
      <div className="w-full rounded-xl border border-[#E7E4F0] bg-white px-4 py-4 shadow-sm sm:px-6">
        <p className="text-base font-medium sm:text-xl">My Account</p>
      </div>

      <div className="w-full rounded-xl border border-[#E7E4F0] bg-white px-4 py-5 shadow-sm sm:px-6">
        <p className="mb-4 text-sm font-medium text-[#4D4D4D]">Profile information</p>

        {!isLoaded ? (
          <LoadingState label="Loading account..." />
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="shrink-0">
              {profileImage ? (
                <Image src={profileImage} alt="Profile" height={80} width={80} className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D2D2D2] p-2 sm:h-20 sm:w-20">
                  {initials ? <span className="text-lg font-semibold text-[#737373]">{initials}</span> : <UserIcon className="h-10 w-10 text-[#999999] sm:h-12 sm:w-12" />}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#1C1C1C]">{displayName}</p>
                <span className="rounded-full bg-[#D6DCE2] px-2.5 py-1 text-xs font-medium text-[#002651]">Agency</span>
              </div>
              <p className="mt-0.5 text-sm text-[#737373]">{email}</p>
            </div>

            <div className="flex shrink-0 gap-6 sm:gap-10">
              <div>
                <p className="text-xs text-[#8093A8]">Agency</p>
                <p className="mt-0.5 text-sm font-medium text-[#002651]">{settings.agency}</p>
              </div>
              <div>
                <p className="text-xs text-[#8093A8]">Area</p>
                <p className="mt-0.5 text-sm font-medium text-[#002651]">{settings.area}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {!isGoogle && <PillButton icon={KeyIcon} label="Change password" />}
              <PillButton icon={PencilIcon} label="Edit profile" onClick={openEditProfile} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-[#E7E4F0] bg-white px-4 py-6 shadow-sm sm:px-6">
        <p className="mb-1 text-sm font-medium text-[#4D4D4D]">Features</p>

        <FeatureRow
          title="Smart suggestions"
          description="Show suggested next drafts on the dashboard."
          enabled={settings.smartSuggestions}
          onToggle={() => toggleFeature("smartSuggestions")}
        />
        <FeatureRow
          title="Writing style"
          description="Show AI writing-style controls when creating templates."
          enabled={settings.writingStyle}
          onToggle={() => toggleFeature("writingStyle")}
        />

        <div className="mt-2 flex justify-end gap-3 border-t-2 border-[#EDEDED] pt-5">
          <button type="button" onClick={cancelFeatureSettings} disabled={!hasChanges} className="rounded-full border-2 border-[#775ADA] px-5 py-2 text-sm text-[#775ADA] transition-all duration-200 hover:bg-[#775ADA] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={saveFeatureSettings} disabled={!hasChanges} className="rounded-full bg-[#775ADA] px-6 py-2 text-sm text-white shadow-sm transition-colors duration-200 hover:bg-[#5F48C2] disabled:cursor-not-allowed disabled:opacity-50">
            Save
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        form={editForm}
        error={editError}
        isSaving={isSavingProfile}
        onChange={(key, value) => setEditForm((prev) => ({ ...prev, [key]: value }))}
        onClose={() => setIsEditOpen(false)}
        onSave={saveProfile}
      />
    </div>
  );
}
