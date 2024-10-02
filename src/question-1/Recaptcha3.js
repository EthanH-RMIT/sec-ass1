import React, { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const CreateAccountForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const validateForm = async () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (executeRecaptcha) {
      const recaptchaToken = await executeRecaptcha('create_account');
      setToken(recaptchaToken);
      if (!recaptchaToken) newErrors.recaptcha = 'Please complete the reCAPTCHA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validateForm()) {
      // Perform your account creation logic here
      console.log('Form submitted with:', { username, password, token });
      // Reset form after submission
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setToken(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      <button type="submit">Create Account</button>
    </form>
  );
};

const Recaptcha3 = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA3_SITE_KEY}>
      <CreateAccountForm />
    </GoogleReCaptchaProvider>
  );
};

export default Recaptcha3;
