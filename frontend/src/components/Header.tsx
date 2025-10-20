import EmojiPicker from '@/components/EmojiPicker';
import { Button } from '@/components/ui/button';
import type { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  isSuccess: boolean;
  emojiOnly: boolean;
}

const Header = ({
  setIsLoggedIn,
  setInputValue,
  isSuccess,
  emojiOnly,
}: HeaderProps) => {
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className='flex'>
      {emojiOnly && (
        <EmojiPicker setInputValue={setInputValue} isSuccess={isSuccess} />
      )}
      <Button onClick={logout} className='ml-auto text-lg' variant='secondary'>
        Logout
      </Button>
    </div>
  );
};

export default Header;
