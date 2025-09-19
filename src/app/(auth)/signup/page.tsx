import { SignupForm } from '@/components/auth/SignupForm';
import Logo from '@/components/layout/Logo';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <Logo />
      <SignupForm />
    </div>
  );
}
