import Link from "next/link";
import { Feather } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/home" className="flex items-center space-x-2">
      <Feather className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl font-headline text-foreground">
        GratitudeFlow
      </span>
    </Link>
  );
}
