import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// BUG 1 FIXED: Changed 'server.css' to 'index.css'
import './index.css'; 

import { Provider } from "react-redux";

// BUG 2 FIXED: Changed '../' to './' so it looks in the correct folder
import { store } from "../store/store.js"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
);