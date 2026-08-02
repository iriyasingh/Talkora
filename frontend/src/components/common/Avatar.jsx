const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

const sizeMap = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-24 text-2xl",
};

const Avatar = ({ src, name, size = "md", online, className = "" }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name || "avatar"}
          className={`${sizeClass} rounded-full object-cover ring-1 ring-base-300`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full bg-primary/15 font-semibold text-primary ring-1 ring-base-300`}
        >
          {getInitials(name) || "?"}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-base-100 ${
            online ? "bg-success" : "bg-base-content/20"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
