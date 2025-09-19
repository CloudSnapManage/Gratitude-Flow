import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getDailyPrompt } from "@/lib/prompts";
import { ChevronDown, Edit3 } from "lucide-react";

type Entry = {
  id: number;
  date: string;
  prompt: string;
  content: string;
};

const pastEntries: Entry[] = [
  {
    id: 1,
    date: new Date(Date.now() - 86400000).toLocaleDateString(),
    prompt: "What is something beautiful you saw today?",
    content: "I saw a stunning sunset with vibrant shades of orange and pink. It reminded me to appreciate the small moments of beauty in nature.",
  },
  {
    id: 2,
    date: new Date(Date.now() - 2 * 86400000).toLocaleDateString(),
    prompt: "Who is someone who has helped you recently?",
    content: "My colleague helped me with a difficult project at work. I'm grateful for their support and teamwork, which made a huge difference.",
  },
  {
    id: 3,
    date: new Date(Date.now() - 3 * 86400000).toLocaleDateString(),
    prompt: "What skill are you grateful to have?",
    content: "I'm grateful for my ability to cook. It allows me to create nourishing meals for myself and my family, and it's a relaxing and creative outlet for me.",
  },
];

export default function HomePage() {
  const dailyPrompt = getDailyPrompt();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        
        {/* Main Content: Entry Creation */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-primary" />
                Today's Gratitude
              </CardTitle>
              <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Today's Prompt:</h3>
                  <p className="text-muted-foreground italic text-lg">&quot;{dailyPrompt}&quot;</p>
                </div>
                <Textarea
                  placeholder="Write about what you're grateful for..."
                  className="min-h-[200px] text-base"
                />
                <Button className="w-full md:w-auto">Save Entry</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Timeline */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-headline mb-4">Your Timeline</h2>
          <ScrollArea className="h-[60vh] rounded-md">
            <div className="space-y-4 pr-4">
              {pastEntries.map((entry) => (
                <Collapsible key={entry.id} defaultOpen={false} className="w-full">
                  <Card className="shadow-md transition-shadow hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
                      <div>
                        <CardTitle className="text-lg font-semibold">{entry.date}</CardTitle>
                        <CardDescription className="truncate max-w-xs">{entry.prompt}</CardDescription>
                      </div>
                      <CollapsibleTrigger asChild>
                         <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent>
                        <p className="text-foreground/90">{entry.content}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
}
