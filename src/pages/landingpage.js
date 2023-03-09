import React,{useState,useEffect} from 'react';
import httpClient from "../httpClient";
import ClassesNav from "../classesNav"
import MainView from "../mainView"
import { useParams, Outlet } from "react-router-dom";



const LandingPage = () => {
    const [user,setUser] = useState(null);

    // const {userId,classId} = useParams();

    const logoutUser = async () =>{
        await httpClient.post("//localhost:4998/logout")
        .catch(err=>{
            console.log("You messed up");
        });
        window.location.href="/";
    };

    useEffect(()=>{
        (async()=>{
            await httpClient.get("//localhost:4998/@me")
            .then(res=>{
                setUser(res.data);
            })
            .catch(err=>{
                console.log("Not authenticated");
            })
             
        })()
    },[]);

    return (
        <div id="header">  
            {user != null ? (
                <div id="container">
                    <div id="left">
                        <h5>Logged in</h5>
                        <h5>Email: {user.email} </h5>
                        <button onClick={logoutUser}>Logout</button>
                        <ClassesNav user_id={user.id}/>
                    </div>
                    <div id="right">
                        <Outlet/>
                    </div>
                </div>
            ):(
                <div>
                    <p>You are not logged in</p>
                    <a href="/login">
                        <button>Login</button>
                    </a>
                    <a href="/register">
                        <button>Register</button>
                    </a>
                </div>
            )}
        </div>
    );
};

export default LandingPage;