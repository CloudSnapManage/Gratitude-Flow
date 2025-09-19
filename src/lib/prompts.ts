const prompts = [
  "What is a simple pleasure you are grateful for today?",
  "Who is someone who has helped you recently, and how did they make you feel?",
  "What is something beautiful you saw today?",
  "What skill are you grateful to have?",
  "What is a piece of technology you're grateful for?",
  "What is something about your home that you're grateful for?",
  "Recall a challenge you overcame. What are you grateful for about that experience?",
  "What is a food or drink you are grateful for today?",
  "What is a part of your daily routine you are grateful for?",
  "Who is a public figure or artist whose work you're grateful for?",
];

export function getDailyPrompt(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return prompts[dayOfYear % prompts.length];
}
