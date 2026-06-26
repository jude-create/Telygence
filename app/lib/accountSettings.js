"use client";

export const ACCOUNT_SETTINGS_KEY = "telygence-account-settings";

export const DEFAULT_ACCOUNT_SETTINGS = {
  agency: "Telygence",
  area: "Workspace",
  smartSuggestions: true,
  writingStyle: true,
};

export function loadAccountSettings() {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT_SETTINGS;

  try {
    return {
      ...DEFAULT_ACCOUNT_SETTINGS,
      ...JSON.parse(window.localStorage.getItem(ACCOUNT_SETTINGS_KEY) || "{}"),
    };
  } catch {
    return DEFAULT_ACCOUNT_SETTINGS;
  }
}

export function saveAccountSettings(settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNT_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("telygence-settings-change", { detail: settings }));
}
