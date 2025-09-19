
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, User, LogOut } from 'lucide-react';
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
    // In a real app, you'd fetch this from your auth context or an API
    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('avatar');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
    
    const handleStorageChange = () => {
      const newUsername = localStorage.getItem('username');
      const newAvatar = localStorage.getItem('avatar');
      if (newUsername) setUsername(newUsername);
      if (newAvatar) setAvatar(newAvatar);
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

        <nav className="flex flex-1 items-center space-x-2 lg:space-x-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {avatar ? <AvatarImage src={avatar} alt="User avatar" /> : <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username}</p>
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
