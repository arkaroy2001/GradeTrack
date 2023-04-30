import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import LandingPage from './pages/landingpage';
import ErrorPage from './pages/error-page';
import Register from './pages/register';
import MainView from './mainView';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement:<ErrorPage/>,
    children:[
      {
        path:":user_id/:class_id", 
        element:<MainView/>,
        errorElement:<ErrorPage/>
      }
    ]
  },
  {
    path:"/register",
    element: <Register/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);