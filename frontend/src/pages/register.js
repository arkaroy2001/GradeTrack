import React,{useState} from 'react';
import httpClient from "../httpClient";
import background from '../landing-back.png'
import {websiteUrl} from '../index.js'

const Register =()=>{
    const [email,setEmail] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = event => {
        event.preventDefault();
    
        registerUser();
      };

    const registerUser = async ()=>{
        await httpClient.post(websiteUrl + "/register",{
            email,
            username,
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
    return (
       <div class="page" style={{ backgroundImage: `url(${background})`, 
                backgroundRepeat:'no-repeat', backgroundSize:'cover',
                backgroundPosition:'center',width:'100vw', height:'100vh'}}>
            <div class="form"style={{transform: 'scale(1.2)', float:'right', marginRight:'100px'}}>
                <h1>GradeTrack</h1>
                <h1 style={{color:'white'}}>Register</h1>
                <form id="signup-form">
                    <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button type="submit" onClick={handleSubmit}>Register</button>
                    <a href="/">
                                <p>Login</p>
                    </a>
                </form>
            </div>
        </div>
    )
}

export default Register