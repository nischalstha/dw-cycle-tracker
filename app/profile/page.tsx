import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, LogOut, Save, Settings, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="dw-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-dw-text">Profile</h1>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-dw-cream/30 rounded-full p-1 mb-6 w-full md:w-auto">
          <TabsTrigger
            value="account"
            className="rounded-full data-[state=active]:bg-dw-blush data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-full data-[state=active]:bg-dw-blush data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-0 space-y-6">
          <Card className="dw-card">
            <div className="flex items-center mb-6">
              <div className="bg-dw-blush/10 rounded-full p-6 mr-4">
                <User className="h-12 w-12 text-dw-blush" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-dw-text">Jane Doe</h2>
                <p className="text-dw-text/60">Member since January 2024</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-dw-text/60 mb-1 block">
                  Full Name
                </Label>
                <Input id="name" defaultValue="Jane Doe" className="dw-input" />
              </div>

              <div>
                <Label htmlFor="email" className="text-dw-text/60 mb-1 block">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue="jane@example.com"
                  className="dw-input"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="dw-button-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="dw-card bg-red-50 border border-red-100">
            <h3 className="text-lg font-medium text-red-700 mb-3">
              Account Actions
            </h3>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Delete Account
              </Button>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-0 space-y-6">
          <Card className="dw-card">
            <h2 className="text-lg font-medium text-dw-text mb-4">
              Cycle Settings
            </h2>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="cycle-length"
                  className="text-dw-text/60 mb-1 block"
                >
                  Average Cycle Length (days)
                </Label>
                <Input
                  id="cycle-length"
                  type="number"
                  defaultValue="28"
                  className="dw-input"
                />
              </div>

              <div>
                <Label
                  htmlFor="period-length"
                  className="text-dw-text/60 mb-1 block"
                >
                  Average Period Length (days)
                </Label>
                <Input
                  id="period-length"
                  type="number"
                  defaultValue="5"
                  className="dw-input"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="show-fertile"
                    className="text-dw-text font-medium"
                  >
                    Show Fertile Window
                  </Label>
                  <p className="text-dw-text/60 text-sm">
                    Display your fertile days on the calendar
                  </p>
                </div>
                <Switch id="show-fertile" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="show-ovulation"
                    className="text-dw-text font-medium"
                  >
                    Show Ovulation
                  </Label>
                  <p className="text-dw-text/60 text-sm">
                    Display your estimated ovulation day
                  </p>
                </div>
                <Switch id="show-ovulation" defaultChecked />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="dw-button-primary flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>

          <Card className="dw-card">
            <h2 className="text-lg font-medium text-dw-text mb-4">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="period-reminder"
                    className="text-dw-text font-medium"
                  >
                    Period Reminders
                  </Label>
                  <p className="text-dw-text/60 text-sm">
                    Get notified before your period starts
                  </p>
                </div>
                <Switch id="period-reminder" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="fertile-reminder"
                    className="text-dw-text font-medium"
                  >
                    Fertile Window Reminders
                  </Label>
                  <p className="text-dw-text/60 text-sm">
                    Get notified when your fertile window begins
                  </p>
                </div>
                <Switch id="fertile-reminder" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="tracking-reminder"
                    className="text-dw-text font-medium"
                  >
                    Daily Tracking Reminders
                  </Label>
                  <p className="text-dw-text/60 text-sm">
                    Get reminded to log your symptoms daily
                  </p>
                </div>
                <Switch id="tracking-reminder" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
