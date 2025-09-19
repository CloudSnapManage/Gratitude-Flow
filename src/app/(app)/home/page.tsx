'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { prompts as predefinedPrompts, getDailyPrompt } from "@/lib/prompts";
import { CheckCircle, ChevronDown, Edit3, MoreVertical, Trash2, Clock, Feather } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Entry = {
  id: number;
  date: string;
  time: string;
  prompt: string;
  content: string;
};

export default function HomePage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');

  const [entryText, setEntryText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const [pastEntries, setPastEntries] = useState<Entry[]>([]);
  const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);
  const [entryToEdit, setEntryToEdit] = useState<Entry | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Load entries from local storage on initial render
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('gratitude-entries');
      if (storedEntries) {
        setPastEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error("Failed to parse entries from localStorage", error);
    }
    const dailyPrompt = getDailyPrompt();
    setCurrentPrompt(dailyPrompt);
  }, []);

  // Save entries to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('gratitude-entries', JSON.stringify(pastEntries));
  }, [pastEntries]);

  // Update word count
  useEffect(() => {
    const words = entryText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [entryText]);
  
  const handlePromptChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomPrompt(true);
      setCustomPromptText('');
      setCurrentPrompt('');
    } else {
      setIsCustomPrompt(false);
      setCurrentPrompt(value);
    }
  };

  const handleCustomPromptBlur = () => {
      if (customPromptText.trim()) {
          setCurrentPrompt(customPromptText.trim());
      }
  }

  const handleSave = () => {
    setIsSaving(true);
    setIsSaved(false);
    
    const newEntry: Entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        prompt: currentPrompt,
        content: entryText,
    };

    setPastEntries([newEntry, ...pastEntries]);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setEntryText('');
      const dailyPrompt = getDailyPrompt();
      setCurrentPrompt(dailyPrompt);
      setIsCustomPrompt(false);
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
                 <div className="pt-4 space-y-2">
                    <Label htmlFor="prompt-select" className="text-sm font-medium text-muted-foreground">Your Prompt</Label>
                    <Select onValueChange={handlePromptChange} value={isCustomPrompt ? 'custom' : currentPrompt}>
                        <SelectTrigger id="prompt-select" className="text-base italic text-foreground/80 h-auto min-h-10 whitespace-normal text-left">
                            <SelectValue placeholder="Select a prompt or write your own..." />
                        </SelectTrigger>
                        <SelectContent>
                            {predefinedPrompts.map((p, i) => (
                                <SelectItem key={i} value={p}>{p}</SelectItem>
                            ))}
                            <SelectItem value="custom">Custom question...</SelectItem>
                        </SelectContent>
                    </Select>
                    {isCustomPrompt && (
                        <Input 
                            type="text" 
                            placeholder="Write your own gratitude prompt..."
                            value={customPromptText}
                            onChange={(e) => setCustomPromptText(e.target.value)}
                            onBlur={handleCustomPromptBlur}
                            className="mt-2 text-base"
                        />
                    )}
                </div>
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
                <Button onClick={handleSave} disabled={isSaving || isSaved || entryText.trim().length === 0 || currentPrompt.trim().length === 0} className="w-full md:w-auto">
                  {isSaving ? 'Saving...' : isSaved ? <><CheckCircle className="mr-2" /> Saved!</> : 'Save Entry'}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-headline mb-4">Your Timeline</h2>
            <ScrollArea className="h-[60vh] rounded-md">
              <div className="space-y-4 pr-4">
                {pastEntries.length > 0 ? (
                  pastEntries.map((entry) => (
                    <Collapsible key={entry.id} defaultOpen={false} className="w-full">
                      <Card className="shadow-md transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-start justify-between p-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-sm text-center p-1 shrink-0">
                              {entry.date}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold">{entry.prompt}</CardTitle>
                               <div className="flex items-center text-xs text-muted-foreground pt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{entry.time}</span>
                              </div>
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
                        <CollapsibleContent className="px-4 pb-4 space-y-2">
                           <Separator />
                           <p className="text-foreground/90 pt-2 whitespace-pre-wrap">{entry.content}</p>
                         </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-16 flex flex-col items-center justify-center">
                    <Feather className="w-12 h-12 text-primary/40 mb-4" />
                    <p className="font-semibold text-lg">Your timeline is empty.</p>
                    <p className="text-sm">Start by writing your first gratitude entry!</p>
                  </div>
                )}
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
