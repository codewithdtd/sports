import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from '../views/ErrorPage';
import Login from '../views/Login';
import SignUp from '../views/SignUp';
import App from '../App';
import Report from '../views/Report';
import Facility from '../views/Facility';
import Booking from '../views/Booking';
import Invoice from '../views/Invoice';
import Equipment from '../views/Equipment';
import Review from '../views/Review';
import Customer from '../views/Customer';
import Staff from '../views/Staff';
import Membership from '../views/Membership';
import Event from '../views/Event';
import Info from '../views/Info';
import ChangePass from '../views/ChangePass';
import FacilityManagement from '../views/FacilityManagement';
import SportType from '../views/SportType';
import UserMembership from '../views/UserMembership';
import Contact from '../views/Contact';
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // Sử dụng App làm layout chính
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Report />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "facility",
        element: <Facility />,
      },
      {
        path: "sportType",
        element: <SportType />,
      },
      {
        path: "booking",
        element: <Booking />,
      },
      {
        path: "invoice",
        element: <Invoice />,
      },
      {
        path: "equipment",
        element: <Equipment />,
      },
      {
        path: "review",
        element: <Review />,
      },
      {
        path: "customer",
        element: <Customer />,
      },
      {
        path: "membership",
        element: <Membership />,
      },
      {
        path: "userMembership",
        element: <UserMembership />,
      },
      {
        path: "event",
        element: <Event />,
      },
      {
        path: "staff",
        element: <Staff />,
      },
      {
        path: "info",
        element: <Info />,
      },
      {
        path: "changePass",
        element: <ChangePass />,
      },
      {
        path: "facilityManagement",
        element: <FacilityManagement />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

