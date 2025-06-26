import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Book, BarChart3, Search, Plus, Home, Database } from "lucide-react";

interface NavigationMenuProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

const AppNavigationMenu: React.FC<NavigationMenuProps> = ({
  onNavigate = () => {},
  currentSection = "home",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (section: string) => {
    onNavigate(section);
    // Scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRouteNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-full">
          <NavigationMenuList className="flex-wrap">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "cursor-pointer",
                  location.pathname === "/" && "bg-accent",
                )}
                onClick={() => handleRouteNavigation("/")}
              >
                <Home className="mr-2 h-4 w-4" />
                Basic Manager
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "cursor-pointer",
                  location.pathname === "/advanced" && "bg-accent",
                )}
                onClick={() => handleRouteNavigation("/advanced")}
              >
                <Book className="mr-2 h-4 w-4" />
                Comic Books
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "cursor-pointer",
                  location.pathname === "/entities" && "bg-accent",
                )}
                onClick={() => handleRouteNavigation("/entities")}
              >
                <Database className="mr-2 h-4 w-4" />
                All Entities
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default AppNavigationMenu;
