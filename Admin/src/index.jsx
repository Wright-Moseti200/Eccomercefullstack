/* eslint-disable no-unused-vars */
import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import App from './App';

const Main = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);