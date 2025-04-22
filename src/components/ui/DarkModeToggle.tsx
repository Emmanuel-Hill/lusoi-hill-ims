
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const DARK_KEY = "dark-mode";

function setHtmlDark(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.localStorage.getItem(DARK_KEY) === "true" ||
        (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    setHtmlDark(dark);
    window.localStorage.setItem(DARK_KEY, dark ? "true" : "false");
  }, [dark]);

  return (
    <button
      className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-accent hover:bg-accent/60 transition-colors"
      aria-label="Toggle dark mode"
      onClick={() => setDark((d) => !d)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform scale-110" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      )}
    </button>
  );
}
