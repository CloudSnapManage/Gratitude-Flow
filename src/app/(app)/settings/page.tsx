'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Image as ImageIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('avatar');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        setAvatar(newAvatar);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('username', username);
    if (avatar) {
      localStorage.setItem('avatar', avatar);
    } else {
      localStorage.removeItem('avatar');
    }

    window.dispatchEvent(new Event('storage'));

    toast({
      title: 'Settings Saved',
      description: 'Your profile has been updated successfully.',
    });
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and profile settings.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>This is how your profile will appear to others.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Avatar Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profile Picture</h3>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-2 ring-primary/20 transition-all group-hover:ring-primary/50">
                    <AvatarImage src={avatar || undefined} alt="User avatar" />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <ImageIcon className="text-white" />
                   </div>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                   <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Upload a new profile picture.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Username Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Display Name</h3>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="transition-transform duration-200 active:scale-95">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
