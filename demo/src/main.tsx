import React from 'react';
import { createRoot } from 'react-dom/client';
import '@forgedevstack/bear/styles.css';
import { BearProvider } from '@forgedevstack/bear';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BearProvider defaultMode="dark">
      <App />
    </BearProvider>
  </React.StrictMode>
);
