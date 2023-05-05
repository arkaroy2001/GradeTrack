import React,{useState} from 'react';
import httpClient from "../httpClient";

const Register =()=>{
    const [email,setEmail] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const registerUser = async ()=>{
        await httpClient.post("https://gradetrack.fly.dev/register",{
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
        <div class="page">
            <div class="form">
                <h1>Register</h1>
                <form id="signup-form">
                    <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <input type="text" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button type="button" onClick={registerUser}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Register