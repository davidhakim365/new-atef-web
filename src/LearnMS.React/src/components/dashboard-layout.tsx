import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsFetching } from "@tanstack/react-query";
import { DownloadCloud } from "lucide-react";
import { Outlet } from "react-router-dom";
import DashboardSideBar from "./dashboard-side-bar";

export const DashboardLayout = () => {
  const isFetching = useIsFetching();

  return (
    <div className="dashboard-shell relative h-screen overflow-hidden bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 p-2 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
      <div className="flex h-full w-full items-stretch overflow-hidden rounded-2xl border border-emerald-200/70 bg-card/80 shadow-xl shadow-emerald-500/10 backdrop-blur-md dark:border-emerald-900/60 dark:shadow-black/40">
        <DashboardSideBar />
        <ScrollArea className="h-full w-full bg-background/80 text-foreground">
          <Outlet />
        </ScrollArea>
      </div>
      {isFetching > 0 && (
        <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center rounded-full border border-emerald-200 bg-card px-4 py-1.5 text-sm text-foreground shadow-lg dark:border-emerald-800">
          <DownloadCloud className="mr-2 h-4 w-4 animate-bounce text-emerald-500" />
          Fetching
        </div>
      )}
    </div>
  );
};
