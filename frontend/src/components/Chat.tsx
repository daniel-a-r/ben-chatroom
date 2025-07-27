import {
  useEffect,
  useState,
  useId,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useWebSocket from 'react-use-websocket';

interface ChatProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const Chat = ({ setIsLoggedIn }: ChatProps) => {
  const { sendMessage, lastMessage } = useWebSocket('ws://localhost:3000/chat');
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  const handleSendMessage = (formData: FormData) => {
    const message = String(formData.get('message'));
    sendMessage(message);
  };

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage.data));
    }
  }, [lastMessage]);

  return (
    <>
      <Button onClick={logout} className='text-lg'>
        Logout
      </Button>
      <form action={handleSendMessage}>
        <Input name='message' />
        <Button>Send Message</Button>
      </form>
      {messageHistory.map((message) => (
        <p>{message}</p>
      ))}
    </>
  );
};

export default Chat;
