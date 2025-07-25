import { type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';

interface ChatProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Chat = ({ setIsLoggedIn }: ChatProps) => {
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Button onClick={logout} className='text-lg'>
      Logout
    </Button>
  );
};

export default Chat;
