import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuid } from 'uuid';

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
  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ['messages'],
    queryFn: () => {
      return axios.get('http://localhost:3000/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
  });
  const { sendMessage, lastMessage } = useWebSocket(
    'ws://localhost:3000/chat',
    {
      queryParams: {
        token: String(localStorage.getItem('token')),
      },
    },
  );

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    }
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

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    console.log(error);
    return <span>Error!</span>;
  }

  console.log(messageHistory);

  return (
    <div className=''>
      <Button onClick={logout} className='text-lg'>
        Logout
      </Button>
      <form action={handleSendMessage}>
        <Input name='message' />
        <Button>Send Message</Button>
      </form>
      {messageHistory.map((message) => (
        <p key={message.id}>
          {message.user}: {message.content}
        </p>
      ))}
    </div>
  );
};

export default Chat;
