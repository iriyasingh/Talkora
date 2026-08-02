import { Moon, Sun, MessageCircle } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

const Navbar = ({ title }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "talkora-dark";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-base-300 bg-base-100/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex size-7 items-center justify-center rounded-field bg-primary text-primary-content">
          <MessageCircle className="size-4" />
        </div>
        <span className="font-semibold">Talkora</span>
      </div>

      <h1 className="hidden text-base font-semibold lg:block">{title}</h1>

      <button
        onClick={toggleTheme}
        className="btn btn-ghost btn-circle btn-sm"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
      </button>
    </header>
  );
};

export default Navbar;
