import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Discover from "@/pages/discover";
import Charts from "@/pages/charts";
import Library from "@/pages/library";
import Account from "@/pages/account";
import Plans from "@/pages/plans";
import Search from "@/pages/search";
import Settings from "@/pages/settings";
import CryptoTablePage from "@/pages/crypto_table";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/charts" component={Charts} />
      <Route path="/library" component={Library} />
      <Route path="/account" component={Account} />
      <Route path="/plans" component={Plans} />
      <Route path="/search" component={Search} />
      <Route path="/settings" component={Settings} />
      <Route path="/crypto_table" component={CryptoTablePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-2 border-b border-border">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
              </header>
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
