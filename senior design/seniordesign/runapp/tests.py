import React from 'react';
import { render, screen, fireEvent  } from '@testing-library/react';
import App from './App';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

interface SignInProps {
  onSubmit: (email: string, password: string) => void;
}

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

describe('SignUp component', () => {
  it('renders email and password input fields', () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('submits the form with email and password', () => {
    const handleSignUp = jest.fn();
    render(<SignUp onSubmit={handleSignUp} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByText(/sign up/i));

    expect(handleSignUp).toHaveBeenCalledWith('test@example.com', 'testpassword', 'testpassword');
  });
});

describe('SignIn component', () => {
  it('renders email and password input fields', () => {
    render(<SignIn />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits the form with email and password', () => {
    const handleSubmit = jest.fn();
    render(<SignIn onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByText(/sign in/i));

    expect(handleSubmit).toHaveBeenCalledWith('test@example.com', 'testpassword');
  });
});