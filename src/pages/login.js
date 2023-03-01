import React,{useState} from 'react';
import httpClient from "../httpClient";

const Login =()=>{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const logInUser = async ()=>{
        await httpClient.post("//localhost:4998/login",{
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
    return (
        <div>
            <h1>Login to your account</h1>
            <form>
                <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="text" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button type="button" onClick={logInUser}>Login</button>
            </form>
        </div>
    )
}

export default Login