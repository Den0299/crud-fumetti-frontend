import React from "react";
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
import { Book, BarChart3, Search, Plus, Home } from "lucide-react";

interface NavigationMenuProps {
  onNavigate?: (section: string) => void;
  currentSection?: string;
}

const AppNavigationMenu: React.FC<NavigationMenuProps> = ({
  onNavigate = () => {},
  currentSection = "home",
}) => {
  const handleNavigation = (section: string) => {
    onNavigate(section);
    // Scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
                  currentSection === "home" && "bg-accent",
                )}
                onClick={() => handleNavigation("home")}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Book className="mr-2 h-4 w-4" />
                Comic Books
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <div className="grid gap-1">
                    <button
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent text-left"
                      onClick={() => handleNavigation("search-filter")}
                    >
                      <Search className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">
                          Search & Filter
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Find specific comic books
                        </div>
                      </div>
                    </button>
                    <button
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent text-left"
                      onClick={() => handleNavigation("comic-listing")}
                    >
                      <Book className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">Comic Listing</div>
                        <div className="text-xs text-muted-foreground">
                          Browse all comic books
                        </div>
                      </div>
                    </button>
                    <button
                      className="flex items-center gap-2 p-2 rounded hover:bg-accent text-left"
                      onClick={() => handleNavigation("add-comic")}
                    >
                      <Plus className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">Add New Comic</div>
                        <div className="text-xs text-muted-foreground">
                          Add a new comic book
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "cursor-pointer",
                  currentSection === "statistics" && "bg-accent",
                )}
                onClick={() => handleNavigation("statistics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Statistics
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default AppNavigationMenu;
