import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline } from '@material-ui/core';
import { firebaseConfig } from "./cloud";
import { FirebaseAppProvider } from 'reactfire';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <FirebaseAppProvider suspense firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
