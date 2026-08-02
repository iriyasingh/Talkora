import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const AuthLayout = ({ title, subtitle, children, footer, illustrationTitle, illustrationText }) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-field bg-primary text-primary-content">
              <MessageCircle className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Talkora</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-base-content/60">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-sm">{footer}</div>}
        </motion.div>
      </div>

      {/* Illustration side */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary-content/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 size-96 rounded-full bg-accent/20 blur-3xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-md px-10 text-center text-primary-content"
        >
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary-content/10 backdrop-blur">
            <MessageCircle className="size-8" />
          </div>
          <h2 className="text-2xl font-bold">{illustrationTitle}</h2>
          <p className="mt-3 text-primary-content/80">{illustrationText}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
