import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const onLogout = () => {
    try {
      localStorage.removeItem("auth");
    } catch {}
    navigate("/login", { replace: true });
  };

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

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Open user menu">
            <Avatar className="h-8 w-8">
              <AvatarFallback>BM</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="z-50">
            <DropdownMenuItem onSelect={onLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
