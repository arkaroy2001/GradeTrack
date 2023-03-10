import React from 'react'
import httpClient from './httpClient'

const EditableRow = ({maingroups,mainGroups,setMainGroups,index}) => {
    const handleDelete = (name)=>{
        removeMainGroup(name);

        const newMainGroups = [...mainGroups]

        newMainGroups.splice(index,1);

        setMainGroups(newMainGroups);
    }

    const removeMainGroup = async(name)=>{
        await httpClient.post("//localhost:4998/delete-main-group",{
            name
        })
        .then(res=>{
            console.log("Remove main group successful");
        })
        .catch(err=>{
            alert(err);
        })
    }
    return (
        <tr>
            <td>
            <button type="button" 
            onClick={()=>handleDelete(maingroups.main_group_name,index)}>x</button></td>
            <td>
                <input 
                type="text" 
                required="required" 
                placeholder="e.g HW"
                name="main_group_name"
                class="main-group-input"
                defaultValue={maingroups.main_group_name}
                ></input>
            </td>
            <td>
            <input 
                type="text" 
                required="required" 
                name="main_group_grade"
                class="main-group-input"
                defaultValue={maingroups.main_group_grade}
                ></input>
            </td>
            <td>
            <input 
                type="text" 
                required="required" 
                name="main_group_weight"
                class="main-group-input"
                defaultValue={maingroups.main_group_weight}
                ></input>
            </td>
        </tr>
    )
}

export default EditableRow