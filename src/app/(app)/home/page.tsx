'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getDailyPrompt } from "@/lib/prompts";
import { CheckCircle, ChevronDown, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

type Entry = {
  id: number;
  date: string;
  prompt: string;
  content: string;
};

const pastEntries: Entry[] = [
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
    console.log("Saving entry:", entryText);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setIsSaved(false), 2000);
    }, 1000);
  };

  return (
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
              <Button onClick={handleSave} disabled={isSaving || isSaved} className="w-full md:w-auto transition-all duration-300 transform active:scale-95">
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
                    <CardHeader className="flex flex-row items-start justify-between cursor-pointer p-4">
                       <div className="flex items-center gap-4">
                        <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-sm">
                          {entry.date}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">{entry.prompt}</CardTitle>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                         <Button variant="ghost" size="sm" className="w-9 p-0 shrink-0">
                          <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </CardHeader>
                     <CollapsibleContent className="px-4 pb-4">
                        <div className="relative" data-state="closed">
                          <div className="max-h-24 overflow-hidden timeline-fade group-data-[state=closed]:block hidden">
                            <p className="text-foreground/80">{entry.content}</p>
                          </div>
                          <div className="group-data-[state=open]:block hidden">
                             <p className="text-foreground/90">{entry.content}</p>
                          </div>
                        </div>
                         <div className="text-foreground/90 data-[state=open]:hidden">
                            <p className="text-foreground/80 line-clamp-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-card after:to-transparent">
                                {entry.content}
                            </p>
                        </div>
                      </CollapsibleContent>
                  </Card>
                   {index < pastEntries.length - 1 && <Separator className="my-4 md:hidden" />}
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
}
