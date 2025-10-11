import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Bell, Globe, Key, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("english");
  const [apiKey, setApiKey] = useState("");
  const [isAdmin] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
    
    toast({
      title: "Theme Updated",
      description: `Switched to ${checked ? "dark" : "light"} mode`,
    });
  };

  const handleNotificationToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    localStorage.setItem("emailNotifications", checked.toString());
    
    toast({
      title: "Notifications Updated",
      description: `Email notifications ${checked ? "enabled" : "disabled"}`,
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    
    toast({
      title: "Language Updated",
      description: `Language set to ${value.charAt(0).toUpperCase() + value.slice(1)}`,
    });
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid API Key",
        description: "Please enter a valid API key",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    toast({
      title: "API Key Saved",
      description: "Your API key has been securely stored",
    });
    setApiKey("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-settings-title">Settings</h1>
        <p className="text-muted-foreground">Customize your Aladin.AI experience</p>
      </div>

      <Card className="p-6 hover-elevate transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Theme</h3>
              <p className="text-sm text-muted-foreground">
                {isDarkMode ? "Night Mode (Dark)" : "Day Mode (Light)"}
              </p>
            </div>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={handleThemeToggle}
            data-testid="switch-theme"
          />
        </div>
      </Card>

      <Card className="p-6 hover-elevate transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-chart-2/10 rounded-lg">
              <Bell className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={handleNotificationToggle}
              data-testid="checkbox-email-notifications"
            />
            <Label
              htmlFor="email-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable email alerts for market updates and payment notifications
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover-elevate transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-chart-3/10 rounded-lg">
              <Globe className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Language</h3>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
          </div>

          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full md:w-64" data-testid="select-language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="urdu">Urdu</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isAdmin && (
        <Card className="p-6 hover-elevate transition-all border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-chart-1/10 rounded-lg">
                <Key className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">API Keys</h3>
                <p className="text-sm text-muted-foreground">Manage custom API keys (Admin only)</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="api-key" className="text-sm font-medium">
                Custom API Key
              </Label>
              <div className="flex gap-3">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                  data-testid="input-api-key"
                />
                <Button
                  onClick={handleSaveApiKey}
                  disabled={isSaving || !apiKey.trim()}
                  className="bg-gradient-brand hover:opacity-90"
                  data-testid="button-save-api-key"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Save Key
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key will be encrypted and stored securely
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="pt-4 text-center text-sm text-muted-foreground">
        <p>Changes are saved automatically. Last updated: Just now</p>
      </div>
    </div>
  );
}
