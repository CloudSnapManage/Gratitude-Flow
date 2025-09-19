import { LoginForm } from '@/components/auth/LoginForm';
import Logo from '@/components/layout/Logo';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <Logo />
      <LoginForm />
    </div>
  );
}
