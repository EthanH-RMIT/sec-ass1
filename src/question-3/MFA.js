import React, { useState } from 'react';
import axios from 'axios';

const MFA = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            setMessage('Please fill in all fields.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/login', { email });
            setMessage(response.data);
            setStep(2);
        } catch (error) {
            setMessage('Error sending email. Please try again.');
        }
    };

    const handleVerify = async () => {
        try {
            const response = await axios.post('http://localhost:3000/verify', { email, code });
            setMessage(response.data.message);
            setStep(3);
        } catch (error) {
            setMessage('Invalid code. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>{step === 1 ? 'Login' : 'Verify Code'}</h2>
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
                    <h2>
                        We have sent a secret code to your email.
                        Please check your email and insert the code in the following input field:
                    </h2>
                    <input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    <button onClick={handleVerify} style={{ width: '100%', padding: '10px' }}>
                        Verify Code
                    </button>
                </div>
            )}
            {step === 3 && (
                <div>
                    {message && <p>{message}</p>}
                </div>
            )}   
        </div>
    );
};

export default MFA;
