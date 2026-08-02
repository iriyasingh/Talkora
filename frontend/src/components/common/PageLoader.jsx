import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-100">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
};

export default PageLoader;
