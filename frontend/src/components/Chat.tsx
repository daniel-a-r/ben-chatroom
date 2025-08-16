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
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { httpUrl, wsUrl } from '@/lib/urls';

interface ChatProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

interface Message {
  id: string;
  content: string;
  user: string;
  displayName?: boolean;
  displayOnlineStatus?: boolean;
}

const Chat = ({ setIsLoggedIn }: ChatProps) => {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<boolean | null>(null);
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
  const emojiOnly: boolean = JSON.parse(localStorage.getItem('emojiOnly')!);
  const disableInput: boolean = JSON.parse(
    localStorage.getItem('disableInput')!,
  );
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

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const regex = emojiRegex();
    setInputValue((e.target.value.match(regex) || []).join(''));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.online !== undefined) {
        console.log(messageData);
        setMessageHistory((messageHistory) => {
          const onlineMessage: Message = {
            id: uuid(),
            displayOnlineStatus: true,
            displayName: false,
            user: messageData.user,
            content: `${messageData.user} is online!`,
          };
          return [...messageHistory, onlineMessage];
        });
      } else {
        setMessageHistory((messageHistory) => {
          const prevMessage = messageHistory.at(-1);
          if (prevMessage?.user === messageData.user) {
            return [...messageHistory, { ...messageData, displayName: false }];
          }
          return [...messageHistory, { ...messageData, displayName: true }];
        });
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isSuccess) {
      if (!disableInput) {
        setMessageHistory(data.data);
      } else {
        const cleanedMessageHistory = data.data.map(
          (message: Message, i: number, arr: Array<Message>) => {
            if (i > 0 && message.user === arr[i - 1].user) {
              return { ...message, displayName: false };
            } else {
              return { ...message, displayName: true };
            }
          },
        );
        setMessageHistory(cleanedMessageHistory);
      }
    }
  }, [isSuccess, data, disableInput]);

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
          <div
            key={message.id}
            className={
              message.user === 'me'
                ? 'max-w-7/10 self-end'
                : 'max-w-7/10 self-start'
            }
          >
            {disableInput && message.displayName && (
              <p className='pb-1'>{message.user}</p>
            )}
            {message.displayOnlineStatus ? (
              <p>{message.content}</p>
            ) : (
              <Card className='px-3 py-2 wrap-break-word'>
                {message.content}
              </Card>
            )}
          </div>
        ))}
      </div>
      <form
        action={handleSendMessage}
        className='grid grid-cols-[1fr_max-content] gap-3'
      >
        {emojiOnly ? (
          <Textarea
            name='message'
            onChange={handleInputChange}
            placeholder='Emojis only'
            value={inputValue}
            className='resize-none !text-xl'
            rows={2}
          />
        ) : (
          <Textarea
            name='message'
            placeholder='Type message'
            className='resize-none'
            rows={2}
            disabled={disableInput}
          />
        )}
        <Button size='icon' className='self-end' disabled={disableInput}>
          <Send />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
