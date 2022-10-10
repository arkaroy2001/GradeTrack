import React from 'react'
import { useParams } from "react-router-dom";

const MainView = () =>{
    const { userId,classId } = useParams();
    return(
        <div>
        <h1>{userId}</h1>
        <h1>{classId}</h1>
        </div>
    )
}

export default MainView