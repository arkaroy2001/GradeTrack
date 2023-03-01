import React,{useState} from 'react';
import httpClient from "../httpClient";

const Register =()=>{
    const [email,setEmail] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const registerUser = async ()=>{
        await httpClient.post("//localhost:4998/register",{
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
        <div>
            <h1>Create an account</h1>
            <form>
                <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <input type="text" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button type="button" onClick={registerUser}>Login</button>
            </form>
        </div>
    )
}

export default Register