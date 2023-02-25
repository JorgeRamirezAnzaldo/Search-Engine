//Import react
import React from 'react';
//Import react-dom
import ReactDOM from 'react-dom';
//Import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
//Import index.css file for styles
import './index.css';
//Import App
import App from './App';

//Render App in root
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
