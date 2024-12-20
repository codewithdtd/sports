import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from '../views/ErrorPage';
import App from '../App';
import Login from '../views/Login';
import SignUp from '../views/SignUp';
import Home from '../views/Home';
import About from '../views/About';
import Booking from '../views/Booking';
import Contact from '../views/Contact';
import BookingDetail from '../views/BookingDetail';
import Info from '../views/Info';
import History from '../views/History';
import ChangePass from '../views/ChangePass';
import Review from '../views/Review';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // Sử dụng App làm layout chính
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'booking',
        element: <Booking />,
      },
      {
        path: 'booking/:loai_san',
        element: <BookingDetail />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'info',
        element: <Info />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'changePass',
        element: <ChangePass />
      },
      {
        path: 'review',
        element: <Review />
      }
    ],
  },
]);

