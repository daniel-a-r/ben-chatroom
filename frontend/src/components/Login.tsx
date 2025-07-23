import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const login = () => {
    console.log('login button pressed');
  };

  return (
    <form action={login} className='grid h-full content-center gap-3 px-6'>
      <Label htmlFor='password' className='text-lg'>
        Password:
      </Label>
      <Input
        type='password'
        id='password'
        name='password'
        className='text-lg'
      />
      <Button className='text-lg'>Login</Button>
    </form>
  );
};

export default Login;
