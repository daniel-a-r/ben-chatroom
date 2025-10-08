import emojiRegex from 'emoji-regex-xs';
import { v4 as uuid } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import type { Message } from '@/components/types/components';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type { SendMessage } from 'react-use-websocket';

interface MessageFormProps {
  setMessageHistory: Dispatch<SetStateAction<Message[]>>;
  setInputValue: Dispatch<SetStateAction<string>>;
  inputValue: string;
  emojiOnly: boolean;
  disableInput: boolean;
  sendMessage: SendMessage;
}

const MessageForm = ({
  setMessageHistory,
  setInputValue,
  inputValue,
  emojiOnly,
  disableInput,
  sendMessage,
}: MessageFormProps) => {
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

  return (
    <form
      action={handleSendMessage}
      className='grid grid-cols-[1fr_max-content] gap-3'
    >
      {emojiOnly ? (
        <Textarea
          name='message'
          onChange={handleInputChange}
          placeholder='A picture is worth a thousand words...'
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
  );
};

export default MessageForm;
