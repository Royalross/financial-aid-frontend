import { render, screen } from '@testing-library/react';
import { LoginForm } from '../components/forms/login-form';

describe('LoginForm', () => {
  it('renders email/username field', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
  });
});
