import axios from 'axios';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const login = async (formData: FormData) => {
    console.log('formData: ', formData);
    const body = { password: formData.get('password') };
    try {
      const repsonse = await axios.post('http://localhost:3000/login', body);
      console.log(repsonse.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data.message);
        // console.log(error.response);
      } else {
        console.error('something went wrong');
        console.error(error);
      }
    }
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
