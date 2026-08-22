import { useLogoutMutation } from "@/api/auth-api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  File,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  QrCode,
  School,
  Shield,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import type { ComponentType } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";

const materialLinks = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, match: "exact" as const },
  { to: "/dashboard/courses", label: "Courses", icon: School, match: "/courses" },
  {
    to: "/dashboard/important-lectures",
    label: "Important Lectures",
    icon: Star,
    match: "/important-lectures",
  },
  { to: "/dashboard/credit-codes", label: "Credit Codes", icon: QrCode, match: "/credit-codes" },
  { to: "/dashboard/files", label: "Files", icon: File, match: "/files" },
  {
    to: "/dashboard/questions",
    label: "Questions",
    icon: QuestionMarkCircledIcon,
    match: "/questions",
  },
];

const userLinks = [
  { to: "/dashboard/students", label: "Students", icon: User, match: "/students" },
  { to: "/dashboard/assistants", label: "Assistants", icon: Shield, match: "/assistants" },
];

const DashboardSideBar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const logoutMutation = useLogoutMutation();
  const { pathname } = useLocation();

  const isActive = (to: string, match: string) =>
    match === "exact" ? pathname === to : pathname.startsWith(`/dashboard${match}`);

  return (
    <div className="relative h-full shrink-0">
      {!isSidebarVisible && (
        <div className="fixed left-3 top-3 z-[9999] flex items-center gap-2 rounded-full border border-indigo-200 bg-card/95 p-1 shadow-lg backdrop-blur dark:border-indigo-800">
          <Button
            size="icon"
            className="rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white hover:from-indigo-600 hover:to-fuchsia-600"
            onClick={() => setSidebarVisible(true)}
            aria-label="Show sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      )}
      {isSidebarVisible && (
        <div className="flex h-full">
          <div className="flex h-full w-64 flex-col gap-5 bg-gradient-to-b from-indigo-600 via-violet-600 to-fuchsia-700 p-3 text-white dark:from-indigo-950 dark:via-violet-950 dark:to-slate-950">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Admin
                </p>
                <p className="text-lg font-bold leading-tight">Dashboard</p>
              </div>
              <div className="flex items-center gap-1">
                <ThemeToggle className="border-white/25 bg-white/15" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/15 hover:text-white"
                  onClick={() => setSidebarVisible(false)}
                  aria-label="Hide sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <NavGroup title="Materials" links={materialLinks} isActive={isActive} />
            <NavGroup title="Users" links={userLinks} isActive={isActive} />

            <div className="mt-auto pt-2">
              <Button
                className="w-full bg-white/15 text-white hover:bg-rose-500 hover:text-white"
                variant="ghost"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function NavGroup({
  title,
  links,
  isActive,
}: {
  title: string;
  links: {
    to: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    match: string;
  }[];
  isActive: (to: string, match: string) => boolean;
}) {
  return (
    <div className="space-y-2">
      <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-white/60">
        {title}
      </h2>
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to, link.match);
          return (
            <Link key={link.to} to={link.to}>
              <span
                className={cn(
                  "inline-flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white text-indigo-700 shadow-md dark:bg-white/15 dark:text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardSideBar;
