import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import Header from '@/components/Header';
import MessageHistory from '@/components/MessageHistory';
import MessageForm from '@/components/MessageForm';
import { httpUrl, wsUrl } from '@/lib/urls';
import type { Message, PageProps } from '@/components/types/components';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Chat = ({ setIsLoggedIn }: PageProps) => {
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

  const emojiOnly: boolean = JSON.parse(localStorage.getItem('emojiOnly')!);
  const disableInput: boolean = JSON.parse(
    localStorage.getItem('disableInput')!,
  );

  return (
    <div className='grid h-full grid-rows-[min-content_1fr_min-content] gap-4'>
      <Header
        setIsLoggedIn={setIsLoggedIn}
        setInputValue={setInputValue}
        isSuccess={isSuccess}
        emojiOnly={emojiOnly}
      />
      <MessageHistory
        isPending={isPending}
        isError={isError}
        isSuccess={isSuccess}
        data={data}
        error={error}
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
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default Chat;
