import { Home, TrendingUp, BarChart3, Library, User, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

const menuItems = [
  { title: "Home", icon: Home, url: "/", testId: "nav-home" },
  { title: "Discover", icon: TrendingUp, url: "/discover", testId: "nav-discover" },
  { title: "Charts", icon: BarChart3, url: "/charts", testId: "nav-charts" },
  { title: "Library", icon: Library, url: "/library", testId: "nav-library" },
  { title: "Account", icon: User, url: "/account", testId: "nav-account" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <motion.div 
          className="px-6 py-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-heading font-bold text-gradient-brand" data-testid="text-sidebar-logo">
            Aladin.AI
          </h1>
        </motion.div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <a href={item.url} data-testid={item.testId} className="group">
                        <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" data-testid="nav-settings" className="group">
                  <Settings className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
