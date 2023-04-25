import React, { useState,useEffect} from 'react'
import { useParams,useLocation } from "react-router-dom";
import httpClient from './httpClient';
import { v4 } from 'uuid';
import ErrorPage from './pages/error-page';
import cloneDeep from 'lodash/cloneDeep';
//import debounce from 'lodash.debounce';



/* view for the grades for the class */
const MainView = () =>{
    //class name
    let {state} = useLocation();
    //passed down from landingpage.js
    const { user_id,class_id } = useParams();
    const [user, setUser] = useState(null);


    //handles the state of the list of main groups for a class
    const [mainGroups, setMainGroups] = useState([])

    //handles the state of the new main group the user adds
    const [mainGroupData, setNewMainGroup] = useState({
        main_group_name: '',
        main_group_grade:'',
        main_group_weight: ''
    })

    const [finalGrade, setFinalGrade] = useState('')

    useEffect(()=>{
        (async()=>{
            await httpClient.get("//localhost:4998/correct-user")
            .then(res=>{
                //console.log(res.data);
                setUser(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
        })()
    },[]);

    //update final grade for class when main Groups change
    useEffect(()=>{ 
            (async()=>{
                await httpClient.post("//localhost:4998/get-final-grade",{
                    "user_id":user_id,
                    "class_id":class_id
                })
                .then(res=>{
                    if(!res.data.json_list[0].grade){
                        setFinalGrade("0");
                    }
                    else{
                        setFinalGrade('');
                        //console.log("HERE");
                        //console.log(res.data.json_list[0]["grade"]);
                        setFinalGrade(res.data.json_list[0]["grade"].toString());
                    }  
                })
                .catch(err=>{
                    //console.log("IDK",err);
                    setFinalGrade('x');
                })
                
            })()
    },[mainGroups]);

    /* used to clear the input of the text of the 
    add main group input form*/
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


    //gets called when user starts typing in one of the main group input forms 
    const handleAddMainGroup = (event)=>{
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newMainGroupData = {...mainGroupData};
        newMainGroupData[fieldName] = fieldValue;

        setNewMainGroup(newMainGroupData);
    }

    //handles submitting the new main group information
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

    //handles the api call for adding a main group
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

    //gets called when user deletes main group 
    const handleDelete = (name,index)=>{
        console.log("PALOOZA " + index);

        const newMainGroups = cloneDeep(mainGroups);

        newMainGroups.splice(index,1);

        setMainGroups(newMainGroups);
        removeMainGroup(name);
    }

    //handles api call for removing a main group
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

    const param = {
        class_id: class_id,
      };

    //if we change the class in the class navigation, then this
    //methods runs again for the correct class and fetches the 
    //main groups for that class
    useEffect(()=>{
            (async()=>{
                await httpClient.post("//localhost:4998/get-main-group",param)
                .then(res=>{
                    //console.log(res.data);
                    setMainGroups([]); //wipes curr group data clean depending on which class user picks
                    setMainGroups(res.data.json_list);
                })
                .catch(err=>{
                    console.log("Whoops")
                })
                 
            })()
    },[class_id]);

    //called when user clicks away from input form GROUP NAME in main group
    const handleNameChange = (event,index) => {
        // 👇 Get input value from "event"
        let original_name = event.target.getAttribute('value'); //original value
        let new_name = event.target.value; //new value

        if (original_name != new_name){
            let newMainGroups = [...mainGroups];
            let item = {...newMainGroups[index]}
            item.main_group_name = new_name;
            newMainGroups[index] = item;
            setMainGroups(newMainGroups);
            updateMainGroupName(original_name,new_name)//send api call
        } 
      };

    //api call for updating main group name
    const updateMainGroupName = async (og_name, new_name) =>{
        await httpClient.put("//localhost:4998/update-main-group-name",{
            class_id,
            og_name,
            new_name
        })
        .then(res=>{
            console.log("update group name success");
        })
        .catch(err=>{
            console.log(err);
        })
    }

    //called when user clicks away from input form GRADE in main group
    const handleGradeChange = (event,index) => {
        let og_grade = event.target.getAttribute('value')//original value
        let new_grade = event.target.value; //new value

        if (og_grade != new_grade){
            let newMainGroups = [...mainGroups];
            let item = {...newMainGroups[index]};
            item.main_group_grade = new_grade;
            newMainGroups[index] = item;
            setMainGroups(newMainGroups);
            let name = event.target.parentNode.parentNode.childNodes[1].firstChild.getAttribute('value');
            updateMainGroupGrade(og_grade, new_grade, name );//send api call
        }
    };
    //api call for updating main group grade
      const updateMainGroupGrade = async (og_grade, new_grade,name) =>{
        console.log(class_id,og_grade,new_grade);
        await httpClient.put("//localhost:4998/update-main-group-grade",{
            class_id,
            og_grade,
            new_grade,
            name
        })
        .then(res=>{
            console.log("update group grade success");
        })
        .catch(err=>{
            console.log(err);
        })
    }

    //called when user clicks away from input form WEIGHT in main group
    const handleWeightChange = (event,index) => {
    
        let og_weight = event.target.getAttribute('value')//original value
        let new_weight = event.target.value; //new value

        if (og_weight != new_weight){
            let newMainGroups = [...mainGroups];
            let item = {...newMainGroups[index]};
            item.main_group_weight = new_weight;
            newMainGroups[index] = item;
            setMainGroups(newMainGroups);
            let name = event.target.parentNode.parentNode.childNodes[1].firstChild.getAttribute('value');
            updateMainGroupWeight(og_weight,new_weight,name);//send api call
        }

    };
    //api call for updating main group weight
    const updateMainGroupWeight = async (og_weight, new_weight,name) =>{
        console.log(class_id,og_weight,new_weight,name);
        await httpClient.put("//localhost:4998/update-main-group-weight",{
            class_id,
            og_weight,
            new_weight,
            name
        })
        .then(res=>{
            console.log("update group name success");
        })
        .catch(err=>{
            console.log(err);
        })
    }


    if (!user) {
        return <>Still loading...</>;
    }

    // if (mainGroups.length ==0) {
    //     return <>Still loading...</>;
    // }

    return(
        <div>
            {(user.uid==user_id) && (finalGrade != 'x') ? (
                <div>
                    <h1>{state}</h1>
                    <h1>Final Grade: {finalGrade}</h1>
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
                                    {mainGroups.map((maingroups,index)=>
                                        <tr key={v4()}>
                                            <td id={"BOOBS " + index}>
                                                <button type="button" 
                                                onClick={()=>handleDelete(maingroups.main_group_name,index)}>x</button>
                                                <input type="radio" name="radAnswer"/>
                                            </td>
                                            <td>
                                                <input 
                                                type="text" 
                                                required="required" 
                                                placeholder="e.g HW"
                                                name="main_group_name"
                                                class="main-group-input"
                                                defaultValue={maingroups.main_group_name}
                                                onBlur={(event) => handleNameChange(event,index)}
                                                ></input>
                                            </td>
                                            <td>
                                            <input 
                                                type="text" 
                                                required="required" 
                                                name="main_group_grade"
                                                class="main-group-input"
                                                defaultValue={maingroups.main_group_grade}
                                                onBlur={(event) => handleGradeChange(event,index)}
                                                ></input>
                                            </td>
                                            <td>
                                            <input 
                                                type="text" 
                                                required="required" 
                                                name="main_group_weight"
                                                class="main-group-input"
                                                //onChange={handleChange}
                                                defaultValue={maingroups.main_group_weight}
                                                onBlur={(event) => handleWeightChange(event,index)}
                                                ></input>
                                            </td>
                                        </tr>
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
            ):(
                <ErrorPage/>
            )}

        </div>
    )
}

export default MainView