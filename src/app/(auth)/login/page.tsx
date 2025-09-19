import { LoginForm } from '@/components/auth/LoginForm';
import Logo from '@/components/layout/Logo';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <Logo />
      <p className="text-muted-foreground italic">&quot;Start your day with gratitude.&quot;</p>
      <LoginForm />
    </div>
  );
}
