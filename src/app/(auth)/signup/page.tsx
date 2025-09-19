import { SignupForm } from '@/components/auth/SignupForm';
import Logo from '@/components/layout/Logo';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <Logo />
       <p className="text-muted-foreground italic">&quot;Start your day with gratitude.&quot;</p>
      <SignupForm />
    </div>
  );
}
