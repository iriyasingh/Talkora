import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/navigation";

const MobileNav = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-base-300 bg-base-100/95 backdrop-blur lg:hidden">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/home"}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
              isActive ? "text-primary" : "text-base-content/50"
            }`
          }
        >
          <Icon className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
