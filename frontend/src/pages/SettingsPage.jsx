import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, LogOut, Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const SettingsPage = () => {
  const { logout, isLoggingOut } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  const themes = [
    { id: "talkora", label: "Light", icon: Sun },
    { id: "talkora-dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-base-content/60">Manage your appearance and account.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <section className="rounded-box border border-base-300 bg-base-100 p-6">
          <h3 className="text-sm font-semibold">Appearance</h3>
          <p className="mt-1 text-sm text-base-content/50">Choose how Talkora looks on this device.</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {themes.map(({ id, label, icon: Icon }) => {
              const active = theme === id;
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className={`flex flex-col items-center gap-2 rounded-field border p-4 transition-colors ${
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-base-300 text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-box border border-error/30 bg-base-100 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-error" />
            <div>
              <h3 className="text-sm font-semibold">Account</h3>
              <p className="mt-1 text-sm text-base-content/50">
                Sign out of Talkora on this device.
              </p>
            </div>
          </div>

          <div className="mt-4">
            {confirmingLogout ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">Are you sure you want to log out?</span>
                <button
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="btn btn-error btn-sm gap-1.5"
                >
                  {isLoggingOut ? <Loader2 className="size-3.5 animate-spin" /> : <LogOut className="size-3.5" />}
                  Yes, log out
                </button>
                <button onClick={() => setConfirmingLogout(false)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmingLogout(true)} className="btn btn-outline btn-error btn-sm gap-1.5">
                <LogOut className="size-3.5" />
                Log out
              </button>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
