import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';
import { useState } from 'react';

describe('Header component', () => {
  const HeaderWrapper = ({ emojiOnly }: { emojiOnly: boolean }) => {
    const [_isLoggedIn, setIsLoggedIn] = useState(true);
    const [_inputValue, setInputValue] = useState('');
    return (
      <Header
        setIsLoggedIn={setIsLoggedIn}
        setInputValue={setInputValue}
        isSuccess={true}
        emojiOnly={emojiOnly}
      />
    );
  };

  it('should not render emoji picker', () => {
    render(<HeaderWrapper emojiOnly={false} />);
    expect(
      screen.queryByRole('button', { name: 'Emoji Picker' }),
    ).not.toBeInTheDocument();
  });

  it('should render emoji picker', () => {
    render(<HeaderWrapper emojiOnly={true} />);
    expect(
      screen.getByRole('button', { name: 'Emoji Picker' }),
    ).toBeInTheDocument();
  });

  it('should logout user', async () => {
    const user = userEvent.setup();

    render(<HeaderWrapper emojiOnly={false} />);
    localStorage.setItem('isLoggedIn', JSON.stringify(true));

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    await user.click(logoutButton);
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });
});
