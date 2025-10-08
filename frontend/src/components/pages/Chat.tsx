import { useState, type Dispatch, type SetStateAction } from 'react';
import useWebSocket from 'react-use-websocket';
import { Button } from '@/components/ui/button';
import EmojiPicker from '@/components/EmojiPicker';
import MessageHistory from '@/components/MessageHistory';
import MessageForm from '@/components/MessageForm';
import { wsUrl } from '@/lib/urls';
import type { Message } from '@/components/types/components';

interface ChatProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Chat = ({ setIsLoggedIn }: ChatProps) => {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const { sendMessage, lastMessage } = useWebSocket(`${wsUrl}/chat`, {
    queryParams: {
      token: String(localStorage.getItem('token')),
    },
  });

  const emojiOnly: boolean = JSON.parse(localStorage.getItem('emojiOnly')!);
  const disableInput: boolean = JSON.parse(
    localStorage.getItem('disableInput')!,
  );

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className='grid h-full grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='flex'>
        {emojiOnly && <EmojiPicker setInputValue={setInputValue} />}
        <Button
          onClick={logout}
          className='ml-auto text-lg'
          variant='secondary'
        >
          Logout
        </Button>
      </div>
      <MessageHistory
        disableInput={disableInput}
        messageHistory={messageHistory}
        lastMessage={lastMessage}
        setMessageHistory={setMessageHistory}
      />
      <MessageForm
        disableInput={disableInput}
        emojiOnly={emojiOnly}
        inputValue={inputValue}
        sendMessage={sendMessage}
        setInputValue={setInputValue}
        setMessageHistory={setMessageHistory}
      />
    </div>
  );
};

export default Chat;
