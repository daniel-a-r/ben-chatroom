import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { Send } from 'lucide-react';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import { isDesktop } from 'react-device-detect';
import emojiRegex from 'emoji-regex-xs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { httpUrl, wsUrl } from '@/lib/urls';

interface ChatProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

interface Message {
  id: string;
  content: string;
  user: string;
}

const Chat = ({ setIsLoggedIn }: ChatProps) => {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['messages'],
    queryFn: () => {
      return axios.get(`${httpUrl}/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
  });
  const { sendMessage, lastMessage } = useWebSocket(`${wsUrl}/chat`, {
    queryParams: {
      token: String(localStorage.getItem('token')),
    },
  });
  const messageRef = useRef<HTMLDivElement>(null);
  const emojiOnly = localStorage.getItem('emojiOnly') === 'true';
  const displayEmojiPicker = emojiOnly && isDesktop;

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const handleSendMessage = (formData: FormData) => {
    const message = String(formData.get('message'));

    if (message !== '') {
      const newMessage: Message = {
        id: uuid(),
        user: 'me',
        content: message,
      };
      sendMessage(message);
      setMessageHistory((messageHistory) => [...messageHistory, newMessage]);
      if (emojiOnly) {
        setInputValue('');
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = emojiRegex();
    setInputValue((e.target.value.match(regex) || []).join(''));
    // setInputValue(e.target.value);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      console.log(messageData);
      setMessageHistory((messageHistory) => [...messageHistory, messageData]);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isSuccess) {
      setMessageHistory(data.data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (messageRef.current !== null) {
      messageRef.current.scroll({
        behavior: 'smooth',
        top: messageRef.current.scrollHeight,
      });
    }
  }, [messageHistory]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    console.log(error);
    return <span>Error!</span>;
  }

  return (
    <div className='grid h-full grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='flex'>
        {displayEmojiPicker && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='text-lg' variant='secondary'>
                Emoji Picker
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          onClick={logout}
          className='ml-auto text-lg'
          variant='secondary'
        >
          Logout
        </Button>
      </div>
      <div
        className='flex h-full flex-col gap-3 overflow-y-auto'
        ref={messageRef}
      >
        {messageHistory.map((message) => (
          // {message.user === 'user' && message.user}
          <Card
            key={message.id}
            className={
              message.user === 'me'
                ? 'max-w-7/10 self-end px-3 py-2'
                : 'max-w-7/10 self-start px-3 py-2'
            }
          >
            {message.content}
          </Card>
        ))}
      </div>
      <form
        action={handleSendMessage}
        className='grid grid-cols-[1fr_max-content] gap-3'
      >
        {emojiOnly ? (
          <Input
            name='message'
            onChange={handleInputChange}
            placeholder='Emojis only'
            value={inputValue}
            className='!text-xl'
          />
        ) : (
          <Input name='message' placeholder='Type message' />
        )}
        <Button size='icon'>
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
