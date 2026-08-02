import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base-100 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-base-200">
        <Compass className="size-6 text-base-content/40" />
      </div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-xs text-sm text-base-content/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn btn-primary btn-sm mt-2">
        Back to Talkora
      </Link>
    </div>
  );
};

export default NotFoundPage;
