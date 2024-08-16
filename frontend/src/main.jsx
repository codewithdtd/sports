import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from "react-router-dom";
import { router } from './routers'
import store from './stores/store.js'
import { Provider } from 'react-redux'
import 'remixicon/fonts/remixicon.css'
import './index.css'
import './assets/style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <App />
    </Provider>
  </React.StrictMode>,
)
