import MessageForm from '@/components/MessageForm';
import type { Message } from '@/components/types/components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { SendMessage } from 'react-use-websocket';

interface MessageFormWrapperProps {
  disableInput: boolean;
  isSuccess: boolean;
  emojiOnly: boolean;
}

describe('Message Form component', () => {
  const MessageFormWrapper = ({
    disableInput,
    isSuccess,
    emojiOnly,
  }: MessageFormWrapperProps) => {
    const [_messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const sendMessage: SendMessage = () => {};
    return (
      <MessageForm
        setMessageHistory={setMessageHistory}
        setInputValue={setInputValue}
        inputValue={inputValue}
        emojiOnly={emojiOnly}
        disableInput={disableInput}
        isSuccess={isSuccess}
        sendMessage={sendMessage}
      />
    );
  };

  it('should be disabled if data has not loaded', () => {
    render(
      <MessageFormWrapper
        disableInput={false}
        isSuccess={false}
        emojiOnly={false}
      />,
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be enabled once data has loaded', () => {
    render(
      <MessageFormWrapper
        disableInput={false}
        isSuccess={true}
        emojiOnly={false}
      />,
    );
    expect(screen.getByRole('textbox')).toBeEnabled();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('should accept regular characters', async () => {
    render(
      <MessageFormWrapper
        disableInput={false}
        isSuccess={true}
        emojiOnly={false}
      />,
    );

    await userEvent.type(screen.getByRole('textbox'), 'Hello world 123!@#');
    expect(screen.getByRole('textbox')).toHaveValue('Hello world 123!@#');
  });

  it('should not accept regular characters', async () => {
    render(
      <MessageFormWrapper
        disableInput={false}
        isSuccess={true}
        emojiOnly={true}
      />,
    );

    await userEvent.type(screen.getByRole('textbox'), 'Hello world 123!');
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
