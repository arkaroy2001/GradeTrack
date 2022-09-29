import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import LandingPage from './pages/landingpage';
import NotFound from './pages/NotFound';
import Login from './pages/login';
import Register from './pages/register';



const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element ={<LandingPage/>}/>
                <Route path="/login" element ={<Login/>}/>
                <Route path="/register" element ={<Register/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;