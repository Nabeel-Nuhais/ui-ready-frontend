import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Header() {
  return (
    <header className="h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger aria-label="Toggle sidebar" />
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start" sideOffset={6} className="z-50">
          Toggle sidebar (Ctrl/Cmd + B)
        </TooltipContent>
      </Tooltip>
      <div />
    </header>
  );
}
