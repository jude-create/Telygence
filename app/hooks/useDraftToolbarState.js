"use client";

import { useEffect, useRef, useState } from "react";

export function useDraftToolbarState() {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [font, setFont] = useState("Sora");
  const [size, setSize] = useState(15);
  const statusDropdownRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) setShowStatusDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return {
    font,
    size,
    setFont,
    setSize,
    showStatusDropdown,
    setShowStatusDropdown,
    statusDropdownRef,
    toolbarState: {
      onFontClick: () => {},
      onSizeClick: () => {},
      onFontSelect: (nextFont) => {
        setFont(nextFont);
      },
      onSizeSelect: (nextSize) => {
        setSize(nextSize);
      },
    },
  };
}
