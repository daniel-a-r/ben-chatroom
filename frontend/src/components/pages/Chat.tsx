import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/button';
import EmojiPicker from '@/components/EmojiPicker';
import MessageHistory from '@/components/MessageHistory';
import MessageForm from '@/components/MessageForm';
import { httpUrl, wsUrl } from '@/lib/urls';
import type { Message } from '@/components/types/components';

interface ChatProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
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
  const emojiOnly: boolean = JSON.parse(localStorage.getItem('emojiOnly')!);
  const disableInput: boolean = JSON.parse(
    localStorage.getItem('disableInput')!,
  );
  const displayEmojiPicker = emojiOnly;

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
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
        {displayEmojiPicker && <EmojiPicker setInputValue={setInputValue} />}
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
        messageRef={messageRef}
        messageHistory={messageHistory}
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
