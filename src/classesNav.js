import React, { useState,useEffect} from 'react';
import httpClient from './httpClient';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid'

const ClassesNav = ({user_id})=>{

    const [classNames, setClassList] = useState([]);

    const [currClass,setNewClass] = useState('');

    useEffect(()=>{
        (async()=>{
            await httpClient.get("//localhost:4999/get-classes")
            .then(res=>{
                console.log("BITCH",res.data.json_list);
                for(let i=0; i<res.data.json_list.length;i++){
                    setClassList(current=>[
                        ...current,
                        res.data.json_list[i]["class_name"]
                    ]);
                    console.log(res.data.json_list[i]["class_name"]);
                };
                
                console.log("HAHAH", classNames.length)
            })
            .catch(err=>{
                console.log("Not authenticated",err);
            })
             
        })()
    },[]);

    const handleSubmit = (event)=>{
        event.preventDefault();
        addClass();
        setNewClass(''); //remove text from the input form
    }

    const addClass = async () =>{
        await httpClient.post("//localhost:4999/add-class",{
            currClass
        })
        .then(res=>{
            console.log("Add class successful");
            setClassList(current=>[
                ...current,
                currClass
            ]);
        })
        .catch(err=>{
           alert("Duplicate class name not allowed",err) ;
        })
    }

    const handleDelete = (id) =>{
        removeClass(id);
        const newClassNames = [...classNames];

        newClassNames.splice(newClassNames.indexOf(id), 1);
        
        setClassList(newClassNames);
    }

    const removeClass = async (id) =>{
        await httpClient.post("//localhost:4999/remove-class",{
            id
        })
        .then(res=>{
            console.log("Remove class successful");
        })
        .catch(err=>{
           alert("Class doesn't exist",err) ;
        })
    }


    return (
        <form>
            <h3>Classes</h3>
            <ul>
                {classNames.map((classnam) =>
                <li key={v4()}>
                    <Link to={`/${user_id}/`}>{classnam}</Link>
                    <button type="button" onClick={() => handleDelete(classnam)}>-</button>
                </li>
                )}
            </ul>
            <button type="button" onClick={handleSubmit}>+</button>
            <input 
                type="text" 
                name="className" 
                placeholder="class name" 
                required="required"
                value={currClass} onChange={(e)=>setNewClass(e.target.value)}
            />
        </form>
    )
}

export default ClassesNav