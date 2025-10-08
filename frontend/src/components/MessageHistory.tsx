import { Card } from '@/components/ui/card';
import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { httpUrl } from '@/lib/urls';
import { v4 as uuid } from 'uuid';
import type { Message } from '@/components/types/components';
import { LoaderCircle, CircleX } from 'lucide-react';

interface MessageHistoryProps {
  disableInput: boolean;
  messageHistory: Message[];
  lastMessage: MessageEvent | null;
  setMessageHistory: Dispatch<SetStateAction<Message[]>>;
}

const MessageHistory = ({
  disableInput,
  messageHistory,
  lastMessage,
  setMessageHistory,
}: MessageHistoryProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.online !== undefined) {
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
  }, [lastMessage, setMessageHistory]);

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
  }, [isSuccess, data, disableInput, setMessageHistory]);

  useEffect(() => {
    if (messageRef.current !== null) {
      messageRef.current.scroll({
        behavior: 'smooth',
        top: messageRef.current.scrollHeight,
      });
    }
  }, [messageHistory]);

  const twClassName = 'flex flex-col justify-center items-center';
  const queryTextCN = 'text-base font-medium';
  const strokeWidth = 2;
  const iconSize = 26;

  if (isPending) {
    return (
      <div className={twClassName}>
        <p className={queryTextCN}>Loading</p>
        <LoaderCircle
          className='animate-spin'
          strokeWidth={strokeWidth}
          size={iconSize}
        />
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className={twClassName}>
        <p className={queryTextCN}>Error</p>
        <CircleX strokeWidth={strokeWidth} size={iconSize} />
      </div>
    );
  }

  return (
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
            <Card className='px-3 py-2 wrap-break-word'>{message.content}</Card>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageHistory;
