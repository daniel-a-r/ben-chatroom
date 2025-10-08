import { Card } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import type { Message } from '@/components/types/components';

interface MessageHistoryProps {
  disableInput: boolean;
  messageHistory: Message[];
}

const MessageHistory = ({
  disableInput,
  messageHistory,
}: MessageHistoryProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current !== null) {
      messageRef.current.scroll({
        behavior: 'smooth',
        top: messageRef.current.scrollHeight,
      });
    }
  }, [messageHistory]);

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
