import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from '@/components/pages/Login';
import { useState } from 'react';

describe('Login component', () => {
  const LoginWrapper = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  };

  it('should render label', () => {
    render(<LoginWrapper />);
    expect(screen.getByLabelText('password')).toBeInTheDocument();
  });

  it('should render password input', () => {
    render(<LoginWrapper />);
    expect(
      screen.getByRole('textbox', { name: 'password' }),
    ).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<LoginWrapper />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
