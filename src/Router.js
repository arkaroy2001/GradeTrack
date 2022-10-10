import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import LandingPage from './pages/landingpage';
import NotFound from './pages/NotFound';
import Login from './pages/login';
import Register from './pages/register';
import MainView from './mainView';



const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element ={<LandingPage/>}/>
                <Route path="/login" element ={<Login/>}/>
                <Route path="/register" element ={<Register/>}/>
                <Route path="/:user_id/:class_id" element={<MainView/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;