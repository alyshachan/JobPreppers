import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.css';
import { BrowserRouter } from 'react-router-dom';


// console.log('Attempting to render React app');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
     <BrowserRouter>
    <App />
    </BrowserRouter>
  // /* </React.StrictMode> */
);