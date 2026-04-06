import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { Input, Button, Alert } from '../../components';
import { validators } from '../../utils';
import styles from './Register.module.css';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    mobileNo?: string;
  }>({});
  const [apiError, setApiError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    const emailError = validators.email(email);
    const passwordError = validators.password(password);
    const confirmError = password !== confirmPassword ? 'Passwords do not match' : undefined;
    const mobileError = validators.mobileNo(mobileNo);

    setErrors({ email: emailError, password: passwordError, confirmPassword: confirmError, mobileNo: mobileError });

    if (emailError || passwordError || confirmError || mobileError) return;

    try {
      await register({ email, password, mobileNo: mobileNo || undefined });
      navigate('/products');
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Get started with your account</p>

        {apiError && <Alert type="error" message={apiError} />}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Create a password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
          />
          <Input
            label="Mobile Number (Optional)"
            type="tel"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            error={errors.mobileNo}
            placeholder="Enter your mobile number"
          />
          <Button type="submit" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
