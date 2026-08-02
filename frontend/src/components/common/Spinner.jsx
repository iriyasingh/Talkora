import { Loader2 } from "lucide-react";

const Spinner = ({ className = "" }) => (
  <div className={`flex items-center justify-center py-16 ${className}`}>
    <Loader2 className="size-6 animate-spin text-primary" />
  </div>
);

export default Spinner;
