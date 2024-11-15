import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SecurityProvider } from './context/SecurityContext';
import Layout from './layout';

const App = () => {
  return (
    <BrowserRouter>
      <SecurityProvider>
        <Layout />
      </SecurityProvider>
    </BrowserRouter>
  );
};

export default App;
