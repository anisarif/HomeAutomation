import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SecurityProvider } from './context/SecurityContext';
import Layout from './layout';

const App = () => {
  return (
    <SecurityProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </SecurityProvider>
  );
};

export default App;
