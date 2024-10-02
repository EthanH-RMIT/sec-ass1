import React, { useState } from 'react';
import axios from 'axios';

const Google2FA = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGenerateQR = async () => {
        try {
            const response = await axios.post('http://localhost:3000/generate-qr');
            setQrCodeUrl(response.data.qrCodeUrl);
        } catch (error) {
            setMessage('Error generating QR code');
        }
    };

    const handleVerifyTotp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verify-totp', { totpCode });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Invalid code');
        }
    };

    const handleLogin = (e) => {
      e.preventDefault();
      if (email === '' || password === '') {
        setMessage('Please fill in all fields.');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setMessage('Please enter a valid email address.');
        return;
      }
      setMessage("Authenticate using Google Authenticator by scanning the QR code and entering the 6 digit number")
      setStep(2)
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            {step === 1 && (
                <div>
                  <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                  />
                  <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                  />
                  <button onClick={handleLogin} style={{ width: '100%', padding: '10px' }}>
                      Send Verification Code
                  </button>
              </div>
            )}
            {step === 2 && (
                <div>
                   <h2>Two-Factor Authentication</h2>
                    <button onClick={handleGenerateQR} style={{ width: '100%', padding: '10px' }}>
                        Generate QR Code
                    </button>
                    {qrCodeUrl && (
                        <div>
                            <p>Scan this QR code with Google Authenticator:</p>
                            <img src={qrCodeUrl} alt="QR Code for 2FA" />
                            <input
                                type="text"
                                placeholder="Enter the 6-digit code"
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                            />
                            <button onClick={handleVerifyTotp} style={{ width: '100%', padding: '10px' }}>
                                Verify Code
                            </button>
                        </div>
                    )}
                </div>
            )}
        {message && <p>{message}</p>}
        </div>
    );
};

export default Google2FA;
