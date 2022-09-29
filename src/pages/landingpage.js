import React,{useState,useEffect} from 'react';
import httpClient from "../httpClient";


const LandingPage = () => {
    const [user,setUser] = useState(null);

    const logoutUser = async () =>{
        await httpClient.post("//localhost:4999/logout")
        .catch(err=>{
            console.log("You fucked up");
        });
        window.location.href="/";
    };

    useEffect(()=>{
        (async()=>{
            await httpClient.get("//localhost:4999/@me")
            .then(res=>{
                setUser(res.data);
            })
            .catch(err=>{
                console.log("Not authenticated");
            })
             
        })()
    },[]);

    return (
        <div>
            <h1>Welcome</h1>
            {user != null ? (
                <div>
                    <h2>Logged in</h2>
                    <h3>Email: {user.email} </h3>
                    <h3>ID: {user.id} </h3>
                    <button onClick={logoutUser}>Logout</button>
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