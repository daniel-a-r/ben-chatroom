import axios from 'axios';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoginProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const login = async (formData: FormData) => {
    console.log('formData: ', formData);
    const body = { password: formData.get('password') };
    try {
      const response = await axios.post('http://localhost:3000/login', body);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.name);
      setIsLoggedIn(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        setErrorMessage(error.response?.data.message);
      } else {
        console.error(error);
        setErrorMessage('Something went wrong!');
      }
    }
  };

  return (
    <form
      action={login}
      className='grid content-center gap-3 px-6 md:grid-cols-[min-content_auto]'
    >
      <Label htmlFor='password' className='text-lg'>
        Password:
      </Label>
      <Input
        type='password'
        id='password'
        name='password'
        className='text-lg'
        required
      />
      <div className='md:col-start-2'>
        <Button className='w-full text-lg md:max-w-min' type='submit'>
          Login
        </Button>
        {errorMessage && (
          <p className='absolute pt-2 text-lg text-red-500'>{errorMessage}</p>
        )}
      </div>
    </form>
  );
};

export default Login;
