import React,{useState,useEffect} from 'react';
import httpClient from "../httpClient";
import ClassesNav from "../classesNav"
import {Outlet } from "react-router-dom";
import {websiteUrl} from '../index.js'
import background from '../landing-back.png'



const LandingPage = () => {
    const [user,setUser] = useState();
    // let x = 0;
    // const REMOTE_URL = process.env.REACT_APP_REMOTE_URL
    // const LOCAL_URL = process.env.REACT_APP_LOCAL_URL
    // let url;


    // const {userId,classId} = useParams();

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const logInUser = async ()=>{
        await httpClient.post(websiteUrl + "/login",{
            email,
            password
        })
        .then(res=>{
            console.log("Logged in");
            window.location.href="/"
        })
        .catch(err=>{
            alert("Invalid credentials")
        })
    }

    const logoutUser = async () =>{
        await httpClient.post(websiteUrl + "/logout")
        .catch(err=>{
            console.log("You messed up");
        });
        window.location.href="/";
    };

    useEffect(()=>{
        (async()=>{
            await httpClient.get(websiteUrl + "/@me")
            .then(res=>{
                setUser(res.data);
            })
            .catch(err=>{
                console.log("Not authenticated",err);
                setUser('x');
            })
             
        })()
    },[]);

    if (user === undefined) {
        return <>Still loading...</>;
      }

    return (
        <div id="header">  
            {user != 'x' ? (
                <div id="container">
                    <div id="left">
                        <h5>{user.email} </h5>
                        <button onClick={logoutUser}>Logout</button>
                        <ClassesNav user_id={user.id}/>
                    </div>
                    <div id="right">
                        <Outlet/>
                    </div>
                </div>
            ):(
                <div style={{ backgroundImage: `url(${background})`, 
                backgroundRepeat:'no-repeat', backgroundSize:'cover',
                backgroundPosition:'center',width:'100vw', height:'100vh'}}>
                {/* <div> */}
                    <div class="page">
                        <div class="form" style={{transform: 'scale(1.3)'}}>
                            <form id="login-form">
                                <h1>GradeTrack</h1>
                                <h1 style={{color:'white'}}>Sign In</h1>
                                <input type="text" placeholder="E-mail" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                                <input id="signin-password" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                <button type="button" onClick={logInUser}>Login</button>
                            </form>
                            <a href="/register">
                                <p>Register</p>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;