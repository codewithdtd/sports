import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from "react-router-dom";
import { router } from './routers'
import { Provider } from 'react-redux'
import 'remixicon/fonts/remixicon.css'
import './index.css'
import './assets/style.css'
import { store, persistor } from './stores/store.js';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
