import { motion } from "framer-motion"
import { useTheme } from "../hooks/useTheme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === "dark"

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-mp-blue/30 bg-mp-card shadow-mp-card backdrop-blur-md text-mp-text transition-colors hover:border-mp-teal/50"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zm0 15a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm8-7h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zM5 12a1 1 0 0 0-1 1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1zm13.657-6.657a1 1 0 0 0-1.414 0l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414zm-12.02 12.02a1 1 0 0 0-1.415 0l-.707.707a1 1 0 0 0 1.415 1.414l.707-.707a1 1 0 0 0 0-1.414zm12.02-.293a1 1 0 0 0-1.414-1.414l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707zM7.05 7.05a1 1 0 0 0 1.414 0l.707-.707A1 1 0 0 0 7.757 4.93l-.707.707a1 1 0 0 0 0 1.414zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      )}
    </motion.button>
  )
}
