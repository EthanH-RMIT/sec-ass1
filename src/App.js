import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Recaptcha from './question-1/Recaptcha';
import Recaptcha3 from './question-1/Recaptcha3';
import MFA from './question-3/MFA';
import Google2FA from './question-4/Google2FA';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('Google2FA');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Recaptcha':
        return <Recaptcha />;
      case 'Recaptcha3':
        return <Recaptcha3 />;
      case 'MFA':
        return <MFA />;
      case 'Google2FA':
      default:
        return <Google2FA />;
    }
  };

  return (
    <div className="App">
        <h1>Select a Component to View</h1>
        <select value={selectedComponent} onChange={(e) => setSelectedComponent(e.target.value)}>
          <option value="Recaptcha">reCAPTCHA v2</option>
          <option value="Recaptcha3">reCAPTCHA v3</option>
          <option value="MFA">MFA</option>
          <option value="Google2FA">Google 2FA</option>
        </select>
      <main>
        {renderComponent()}
      </main>
    </div>
  );
}

export default App;
