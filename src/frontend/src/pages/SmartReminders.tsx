import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useReminderSettings,
  useUpdateReminderSettings,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  Bell,
  BellRing,
  Calendar,
  Clock,
  Loader2,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ReminderSettings } from "../backend.d";

const DEFAULT_SETTINGS: ReminderSettings = {
  dailyEnabled: true,
  dailyTime: "09:00",
  weeklyEnabled: true,
  weeklyDay: "Monday",
  monthlyEnabled: true,
  monthlyDay: BigInt(1),
};

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MONTH_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export function SmartReminders() {
  const { data: savedSettings } = useReminderSettings();
  const updateSettings = useUpdateReminderSettings();
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_SETTINGS);
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const update = <K extends keyof ReminderSettings>(
    field: K,
    value: ReminderSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast.success("Reminder settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const requestPermission = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === "granted") {
        toast.success("Notifications enabled!");
        new Notification("Placement Prep Pro", {
          body: "You'll now receive reminders to keep up your practice! 🚀",
          icon: "/favicon.ico",
        });
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <PageHeader
        icon={Bell}
        title="Smart Reminders"
        subtitle="Stay consistent with scheduled reminders"
        action={
          <Button
            onClick={saveSettings}
            disabled={updateSettings.isPending}
            className="gradient-brand text-white border-0 shadow-brand gap-2"
          >
            {updateSettings.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Settings
          </Button>
        }
      />

      {/* Notification permission banner */}
      {notifPermission !== "granted" && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Enable browser notifications
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allow notifications to receive reminders as browser alerts
                </p>
              </div>
              {notifPermission !== "denied" && (
                <Button
                  size="sm"
                  onClick={requestPermission}
                  className="gradient-brand text-white border-0 shadow-brand shrink-0"
                >
                  <BellRing className="w-3 h-3 mr-1.5" />
                  Enable
                </Button>
              )}
              {notifPermission === "denied" && (
                <span className="text-xs text-destructive shrink-0">
                  Blocked in browser
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Reminder */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Daily Coding Reminder
            </CardTitle>
            <Switch
              checked={settings.dailyEnabled}
              onCheckedChange={(v) => update("dailyEnabled", v)}
            />
          </div>
        </CardHeader>
        <CardContent
          className={`transition-all duration-200 ${settings.dailyEnabled ? "" : "opacity-50 pointer-events-none"}`}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Get reminded every day to solve your daily coding problem and
              maintain your streak.
            </p>
            <div className="space-y-2">
              <Label htmlFor="dailyTime">Reminder Time</Label>
              <Input
                id="dailyTime"
                type="time"
                value={settings.dailyTime}
                onChange={(e) => update("dailyTime", e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Reminder */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Weekly Goal Reminder
            </CardTitle>
            <Switch
              checked={settings.weeklyEnabled}
              onCheckedChange={(v) => update("weeklyEnabled", v)}
            />
          </div>
        </CardHeader>
        <CardContent
          className={`transition-all duration-200 ${settings.weeklyEnabled ? "" : "opacity-50 pointer-events-none"}`}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A weekly check-in to review your roadmap progress and set goals
              for the week.
            </p>
            <div className="space-y-2">
              <Label>Day of the Week</Label>
              <Select
                value={settings.weeklyDay}
                onValueChange={(v) => update("weeklyDay", v)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEK_DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Reminder */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              Monthly Milestone Reminder
            </CardTitle>
            <Switch
              checked={settings.monthlyEnabled}
              onCheckedChange={(v) => update("monthlyEnabled", v)}
            />
          </div>
        </CardHeader>
        <CardContent
          className={`transition-all duration-200 ${settings.monthlyEnabled ? "" : "opacity-50 pointer-events-none"}`}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Monthly reminder to complete your current roadmap month and update
              your skills.
            </p>
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Select
                value={Number(settings.monthlyDay).toString()}
                onValueChange={(v) => update("monthlyDay", BigInt(v))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_DAYS.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                      {day === 1
                        ? "st"
                        : day === 2
                          ? "nd"
                          : day === 3
                            ? "rd"
                            : "th"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Reminders will show as browser notifications if permission is granted.
          Make sure to keep this tab open or use a browser that supports
          background notifications.
        </p>
      </div>
    </div>
  );
}
