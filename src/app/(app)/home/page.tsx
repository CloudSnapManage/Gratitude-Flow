'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getDailyPrompt } from "@/lib/prompts";
import { CheckCircle, ChevronDown, Edit3, MoreVertical, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Entry = {
  id: number;
  date: string;
  prompt: string;
  content: string;
};

const initialEntries: Entry[] = [
  {
    id: 1,
    date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    prompt: "What is something beautiful you saw today?",
    content: "I saw a stunning sunset with vibrant shades of orange and pink. It reminded me to appreciate the small moments of beauty in nature. The way the colors blended together was absolutely breathtaking, and it made me feel a sense of peace and wonder.",
  },
  {
    id: 2,
    date: new Date(Date.now() - 2 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    prompt: "Who is someone who has helped you recently?",
    content: "My colleague helped me with a difficult project at work. I'm grateful for their support and teamwork, which made a huge difference. They stayed late to help me finish, and their positive attitude was infectious.",
  },
  {
    id: 3,
    date: new Date(Date.now() - 3 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    prompt: "What skill are you grateful to have?",
    content: "I'm grateful for my ability to cook. It allows me to create nourishing meals for myself and my family, and it's a relaxing and creative outlet for me. There's something so satisfying about making a delicious meal from scratch.",
  },
];

export default function HomePage() {
  const [dailyPrompt, setDailyPrompt] = useState('');
  const [entryText, setEntryText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const [pastEntries, setPastEntries] = useState<Entry[]>(initialEntries);
  const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<Entry | null>(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    setDailyPrompt(getDailyPrompt());
  }, []);

  useEffect(() => {
    const words = entryText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [entryText]);

  const handleSave = () => {
    setIsSaving(true);
    setIsSaved(false);
    
    // Create a new entry
    const newEntry: Entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        prompt: dailyPrompt,
        content: entryText,
    };

    // Add new entry to the top of the list
    setPastEntries([newEntry, ...pastEntries]);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setEntryText(''); // Clear textarea after saving
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);
  };
  
  const handleDelete = (entry: Entry) => {
    setEntryToDelete(entry);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      setPastEntries(pastEntries.filter(e => e.id !== entryToDelete.id));
      setEntryToDelete(null);
    }
  };

  const handleEdit = (entry: Entry) => {
    setEntryToEdit(entry);
    setEditedContent(entry.content);
  };

  const confirmEdit = () => {
    if (entryToEdit) {
      setPastEntries(pastEntries.map(e => e.id === entryToEdit.id ? { ...e, content: editedContent } : e));
      setEntryToEdit(null);
      setEditedContent('');
    }
  };


  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          
          <div className="lg:col-span-3">
            <Card className="shadow-lg bg-primary/5">
              <CardHeader>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <CardTitle className="font-headline text-2xl flex items-center gap-2 pt-2">
                  <Edit3 className="w-6 h-6 text-primary" />
                  Today's Gratitude
                </CardTitle>
                <CardDescription className="text-lg italic text-foreground/80 pt-2">&quot;{dailyPrompt}&quot;</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write about what you're grateful for..."
                  className="min-h-[200px] text-base resize-y bg-card"
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="text-sm text-muted-foreground self-start md:self-center">
                  <span>{wordCount} words</span>
                  {lastSaved && <span className="ml-2">| Saved at {lastSaved}</span>}
                </div>
                <Button onClick={handleSave} disabled={isSaving || isSaved || entryText.trim().length === 0} className="w-full md:w-auto transition-all duration-300 transform active:scale-95">
                  {isSaving ? 'Saving...' : isSaved ? <><CheckCircle className="mr-2" /> Saved!</> : 'Save Entry'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-headline mb-4">Your Timeline</h2>
            <ScrollArea className="h-[60vh] rounded-md">
              <div className="space-y-4 pr-4">
                {pastEntries.map((entry, index) => (
                  <Collapsible key={entry.id} defaultOpen={false} className="w-full">
                    <Card className="shadow-md transition-shadow hover:shadow-lg">
                      <CardHeader className="flex flex-row items-start justify-between p-4">
                         <div className="flex items-center gap-4 flex-1">
                          <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-sm text-center p-1 shrink-0">
                            {entry.date}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold">{entry.prompt}</CardTitle>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-9 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(entry)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <CollapsibleTrigger asChild>
                           <Button variant="ghost" size="sm" className="w-9 p-0 shrink-0">
                            <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                            <span className="sr-only">Toggle</span>
                          </Button>
                        </CollapsibleTrigger>
                        </div>
                      </CardHeader>
                       <CollapsibleContent className="px-4 pb-4">
                          <p className="text-foreground/90">{entry.content}</p>
                        </CollapsibleContent>
                        <div className="px-4 pb-4 data-[state=open]:hidden">
                          <p className="text-foreground/80 line-clamp-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-4 after:bg-gradient-to-t after:from-card after:to-transparent">
                              {entry.content}
                          </p>
                        </div>
                    </Card>
                     {index < pastEntries.length - 1 && <Separator className="my-4 md:hidden" />}
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!entryToEdit} onOpenChange={() => setEntryToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{entryToEdit?.prompt}</p>
            </div>
             <div className="space-y-2">
                <Label htmlFor="edit-content">Your Reflection</Label>
                <Textarea
                id="edit-content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px]"
                />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                Cancel
                </Button>
            </DialogClose>
            <Button onClick={confirmEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
