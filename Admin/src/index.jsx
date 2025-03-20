/* eslint-disable no-unused-vars */
import React from 'react'
import {createRoot} from 'react-dom/client';
import "./index.css";
import App from './App';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

const Main = () => {
  return (
    <div>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
    </div>
  );
}

let body = document.querySelector('body');
let root = createRoot(body);
root.render(<Main />);