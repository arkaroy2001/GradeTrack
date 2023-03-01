import React, { useState,useEffect, Fragment } from 'react'
import { useParams } from "react-router-dom";
import httpClient from './httpClient';
import { v4 } from 'uuid';
import EditableRow from './EditableRow.js'


{/* view for the grades for the class */}
const MainView = () =>{
    
        const textInput1 = React.useRef();
        const clearInput1 = () => (
            textInput1.current.value = ""
        );

        const textInput2 = React.useRef();
        const clearInput2 = () => (
            textInput2.current.value = ""
        );

        const textInput3 = React.useRef();
        const clearInput3 = () => (
            textInput3.current.value = ""
        );
    
    
    const { user_id,class_id } = useParams();
    const [mainGroups, setMainGroups] = useState([])
    const param = {
        class_id: class_id,
      };

    const [mainGroupData, setNewMainGroup] = useState({
        main_group_name: '',
        main_group_grade:'',
        main_group_weight: ''
    })

    const handleAddMainGroup = (event)=>{
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newMainGroupData = {...mainGroupData};
        newMainGroupData[fieldName] = fieldValue;

        setNewMainGroup(newMainGroupData);
    }

    const handleSubmit = (event)=>{
        event.preventDefault();
        addNewMainGroup();
        setNewMainGroup({
            main_group_name: '',
            main_group_grade:'',
            main_group_weight: ''
        })
        clearInput1();
        clearInput2();
        clearInput3();
    }

    const addNewMainGroup=async()=>{
        await httpClient.post("//localhost:4998/add-main-group",{
            "main_group_name": mainGroupData.main_group_name,
            "main_group_grade": mainGroupData.main_group_grade,
            "main_group_weight": mainGroupData.main_group_weight,
            "main_class_id": class_id
        })
        .then(res=>{
            //console.log("Add group successfull");
            setMainGroups(current=>[
                ...current,
                {"class_id": res.data.class_id,
                "class_name": res.data.class_name,
                "group_type": res.data.group_type,
                "main_group_grade": res.data.main_group_grade,
                "main_group_id": res.data.main_group_id,
                "main_group_name": res.data.main_group_name,
                "main_group_weight": res.data.main_group_weight,
                "timestamp": res.data.timestamp,
                "user_id": res.data.user_id}
            ]);
            //console.log(mainGroups)
            setNewMainGroup({
                main_group_name: '',
                main_group_grade:'',
                main_group_weight: ''
            })
        })
        .catch(err=>{
            alert("Duplicate group name not allowed",err);
        })
        
    }
    useEffect(()=>{
            (async()=>{
                await httpClient.post("//localhost:4998/get-main-group",param)
                .then(res=>{
                    console.log(res.data);
                    setMainGroups([]); //wipes curr group data clean depending on which class user picks
                    setMainGroups(res.data.json_list);
                })
                .catch(err=>{
                    console.log("Whoops")
                })
                 
            })()
    },[class_id]);

    return(
        <div>
            <h1>Final Grade: </h1>
            <h1>{user_id}</h1>
            <h1>{class_id}</h1>
            <div className="main-group-container">
                <form id="main-group-form">
                    <table class="main-group">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Group name</th>
                                <th>Grade (%)</th>
                                <th>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainGroups.map((maingroups)=>
                                <Fragment>
                                    <EditableRow key={v4()} 
                                    maingroups={maingroups}
                                    mainGroups={mainGroups}
                                    setMainGroups={setMainGroups}
                                    />
                                </Fragment>
                                )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><button type="submit" 
                                onClick={handleSubmit}>Add</button></td>
                                <td><input type="text" name="main_group_name"
                                required="required" ref={textInput1}
                                class="main-group-input"
                                placeholder="e.g Homework"
                                onChange={handleAddMainGroup}/></td>

                                <td><input type="text" name="main_group_grade"
                                required="required" ref={textInput2}
                                class="main-group-input"
                                onChange={handleAddMainGroup}/></td>

                                <td><input type="text" name="main_group_weight"
                                required="required" ref={textInput3}
                                class="main-group-input"
                                onChange={handleAddMainGroup}/></td>
                            </tr>
                        </tfoot>
                    </table>
                    
                </form>
            </div>
        </div>
    )
}

export default MainView