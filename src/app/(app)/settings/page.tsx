'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [username, setUsername] = useState("user");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    const storedAvatar = localStorage.getItem('avatar');
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = () => {
    localStorage.setItem('username', username);
    if(avatar) {
      localStorage.setItem('avatar', avatar);
    }
    // Manually dispatch a storage event to trigger the header update
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Changes saved!",
      description: "Your profile has been updated.",
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {avatar ? <AvatarImage src={avatar} alt="User avatar" /> : <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>}
                </Avatar>
                <Input id="picture" type="file" accept="image/*" className="max-w-xs" onChange={handleFileChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input id="name" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>For your security, we recommend using a strong password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications from us.</CardDescription>
          </Header>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="reminders" className="font-semibold">Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a push notification each day to write in your journal.
                </p>
              </div>
              <Switch id="reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="insights" className="font-semibold">Weekly Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your gratitude entries.
                </p>
              </div>
              <Switch id="insights" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
