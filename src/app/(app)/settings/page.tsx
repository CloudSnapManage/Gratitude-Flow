'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Image as ImageIcon, Download, Upload, Database } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

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

  const handleExport = () => {
    const entries = localStorage.getItem('gratitude-entries');
    if (!entries) {
      toast({
        title: 'No Data to Export',
        description: 'You have not written any journal entries yet.',
        variant: 'destructive',
      });
      return;
    }

    const blob = new Blob([entries], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gratitudeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Data Exported',
      description: 'Your journal entries have been saved to your computer.',
    });
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };
  
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/json') {
        setFileToImport(file);
        setIsImportConfirmOpen(true);
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please select a valid JSON file.',
          variant: 'destructive',
        });
      }
    }
  };

  const confirmImport = () => {
    if (!fileToImport) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content); // Validate JSON
        localStorage.setItem('gratitude-entries', content);
        toast({
          title: 'Import Successful',
          description: 'Your journal has been restored. The page will now reload.',
        });
        setTimeout(() => {
          // Force a reload to reflect changes across the app
          window.location.href = '/home';
        }, 1500);
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'The selected file is not a valid journal backup.',
          variant: 'destructive',
        });
      } finally {
        setIsImportConfirmOpen(false);
        setFileToImport(null);
        if(importFileRef.current) {
          importFileRef.current.value = '';
        }
      }
    };
    reader.readAsText(fileToImport);
  };

  return (
    <>
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

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export your journal or import it from a backup file.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
             <input
              type="file"
              ref={importFileRef}
              onChange={handleFileSelected}
              className="hidden"
              accept=".json"
            />
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2" />
              Export Data
            </Button>
             <Button variant="outline" onClick={handleImportClick}>
              <Upload className="mr-2" />
              Import Data
            </Button>
          </CardContent>
        </Card>


        <div className="flex justify-end">
          <Button onClick={handleSave} className="transition-transform duration-200 active:scale-95">Save Changes</Button>
        </div>
      </div>
    </div>
    
    {/* Import Confirmation Dialog */}
    <AlertDialog open={isImportConfirmOpen} onOpenChange={setIsImportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to import?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite all current journal entries with the data from the backup file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              if (importFileRef.current) {
                importFileRef.current.value = '';
              }
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
