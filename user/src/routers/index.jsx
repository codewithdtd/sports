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
import Membership from '../views/Membership';
import Booking from '../views/Booking';
import Event from '../views/Event';
import Contact from '../views/Contact';
import BookingDetail from '../views/BookingDetail';
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
        // children: [
        //   {
        //     path: ':loai_san',
        //     element: <BookingDetail />
        //   },
        // ]
      },
      {
        path: 'booking/:loai_san',
        element: <BookingDetail />
      },
      {
        path: 'event',
        element: <Event />
      },
      {
        path: 'membership',
        element: <Membership />
      },
      {
        path: 'contact',
        element: <Contact />
      }
    ],
  },
]);

