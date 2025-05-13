import { Link, useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
};

const NavItem = ({ icon, label, href, active }: NavItemProps) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-2 py-2 text-sm font-medium rounded-md",
          active
            ? "bg-discord-secondary text-discord-primary"
            : "text-discord-light hover:bg-discord-secondary hover:text-white"
        )}
      >
        <i className={`${icon} text-xl mr-3 ${active ? 'text-discord-primary' : ''}`}></i>
        <span className="hidden md:block">{label}</span>
      </a>
    </Link>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  
  return (
    <div className="w-16 md:w-64 bg-discord-darker flex-shrink-0">
      <div className="py-4 flex flex-col h-full">
        <div className="flex items-center justify-center md:justify-start px-4 h-14">
          <div className="h-9 w-9 md:h-10 md:w-10 bg-discord-primary rounded-full flex items-center justify-center">
            <i className="ri-robot-2-fill text-xl text-white"></i>
          </div>
          <h1 className="hidden md:block ml-3 font-bold text-lg">AutoDisconnect Bot</h1>
        </div>
        
        <div className="mt-6 flex-1">
          <nav className="px-2 space-y-1">
            <NavItem 
              icon="ri-dashboard-line" 
              label="Dashboard" 
              href="/" 
              active={location === '/'} 
            />
            <NavItem 
              icon="ri-settings-4-line" 
              label="Settings" 
              href="/settings" 
              active={location === '/settings'} 
            />
            <NavItem 
              icon="ri-history-line" 
              label="Logs" 
              href="/logs" 
              active={location === '/logs'} 
            />
            <NavItem 
              icon="ri-terminal-box-line" 
              label="Commands" 
              href="/commands" 
              active={location === '/commands'} 
            />
          </nav>
        </div>
        
        <Separator className="my-4 bg-gray-700" />
        
        <div className="px-4 py-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="h-8 w-8 rounded-full bg-discord-success flex items-center justify-center">
              <span className="text-xs font-medium">ON</span>
            </div>
            <div className="hidden md:block ml-3">
              <p className="text-sm font-medium">Bot Status</p>
              <p className="text-xs text-discord-light">Online and Running</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
