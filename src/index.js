import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App/App';
import './styles.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
const canvas = ReactDOM.createRoot(document.getElementById('canvas'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

canvas.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


