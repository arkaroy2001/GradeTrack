import React, { useState,useEffect} from 'react';
import httpClient from './httpClient';
import { Link, useNavigate } from 'react-router-dom';
import { v4 } from 'uuid'

const ClassesNav = ({user_id})=>{
    let navigate = useNavigate();
    const [classNames, setClassList] = useState([]);

    const [currClass,setNewClass] = useState('');

    useEffect(()=>{
        (async()=>{
            await httpClient.get("https://gradetrack.fly.dev/get-classes")
            .then(res=>{
                //console.log("BITCH",res.data.json_list);
                for(let i=0; i<res.data.json_list.length;i++){
                    setClassList(current=>[
                        ...current,
                        res.data.json_list[i]
                    ]);
                    //console.log(res.data.json_list[i]["class_name"]);
                };
                //console.log("HAHAH", classNames.length)
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
        await httpClient.post("https://gradetrack.fly.dev/add-class",{
            currClass
        })
        .then(res=>{
            console.log("Add class successful");
            setClassList(current=>[
                ...current,
                {'class_name':res.data.class_name,
                 'user_id':res.data.user_id,
                 'class_id':res.data.class_id}
            ]);
            console.log(classNames)
        })
        .catch(err=>{
           alert("Duplicate class name not allowed",err) ;
        })
    }

    const removeGroupsForClass = async(id) =>{
        console.log(id);
        await httpClient.post("https://gradetrack.fly.dev/delete-all-main-groups",{
            "class_name":id
        })
        .then(res=>{
            console.log("Remove all groups successfull");
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const handleDelete = (id,index) =>{
        removeClass(id,index);
        removeGroupsForClass(id);
        const newClassNames = [...classNames];

        newClassNames.splice(index, 1);
        
        setClassList(newClassNames);
        //return <Navigate to="/" />
    }

    const removeClass = async (id,index) =>{
        await httpClient.post("https://gradetrack.fly.dev/remove-class",{
            id
        })
        .then(res=>{
            console.log("Remove class successful");
            //window.location.href="/" + user_id + "/" +classNames[index-1].class_id;
            if(classNames.length-1== 0){navigate("/");}
            else if(index==0){
                navigate("/" + user_id + "/" +classNames[index+1].class_id);
            }else{
                navigate("/" + user_id + "/" +classNames[index-1].class_id);
            }
        })
        .catch(err=>{
           alert("Class doesn't exist",err) ;
        })
    }


    return (
        <form>
            <h3>Classes</h3>
            <ul>
                {classNames.map((item,index) =>
                <li key={v4()}>
                    <Link to ={`/${item.user_id}/${item.class_id}`} state={item.class_name}>{item.class_name}</Link>
                    <button type="button" onClick={() => handleDelete(item.class_name,index)}>-</button>
                </li>
                )}
            </ul>
            <button type="button" onClick={handleSubmit}>+</button>
            <input 
                type="text" 
                name="className" 
                placeholder="class name" 
                required="required"
                id="add-class-to-list"
                value={currClass} onChange={(e)=>setNewClass(e.target.value)}
            />
        </form>
    )
}

export default ClassesNav