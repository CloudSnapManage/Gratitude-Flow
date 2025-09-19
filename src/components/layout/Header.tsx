
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, User, LogOut, Feather } from 'lucide-react';
import { useState, useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from './Logo';

export default function Header() {
  const pathname = usePathname();
  const [username, setUsername] = useState('user');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('avatar');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
    
    const handleStorageChange = () => {
      const newUsername = localStorage.getItem('username') || 'user';
      const newAvatar = localStorage.getItem('avatar');
      setUsername(newUsername);
      setAvatar(newAvatar);
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
        window.removeEventListener('storage', handleStorageChange)
    }
  }, []);


  const navLinks = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
         <div className="md:hidden">
            <Feather className="h-6 w-6 text-primary" />
        </div>

        <nav className="flex flex-1 items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary relative',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
                 {pathname === link.href && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"></span>}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-primary/50">
                   <AvatarImage src={avatar || undefined} alt="User avatar" />
                  <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username}</p>
                  <p className="text-xs leading-none text-muted-foreground">Reflecting daily ✨</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
