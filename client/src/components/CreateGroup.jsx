
import React, { useState, useEffect} from 'react';
import axios from 'axios'
import io from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthComtext';
import './CreateGroup.css'

const CreateGroup = () =>{
    const [groupName, setGroupName] = useState('')
    const[groupId,setGroupId]=useState('')
    const socket = io('http://localhost:3001');
    const {user} = useAuthContext()
  
    


    useEffect(() => {
      // This will be executed when groupId changes
      if (groupId !== '') {
        //alert(groupId + ' Group is created!');
        //joinRoom();
        //socket.emit('joinGroup',groupId);
      }
    }, [groupId]);

    const handleSubmit = async () =>{
        const response=await axios.post('http://localhost:3001/api/v1/createGroup',{groupName});
        //if(response){
          //console.log("ggg")
          
          setGroupId(JSON.stringify(response.data.groupId))
          //setGroupId(response.data)
          localStorage.setItem('group', response.data.groupId)
          localStorage.setItem('group', {groupName})
          /*
          alert(groupId + " Group is created!")
          //console.log(groupId)
          joinRoom()
          */


        //}

    };
    
    /*
    const joinRoom = () =>{
      socket.emit('joinGroup',groupId);
      console.log("joined room :"+ groupId)
      //alert(groupId)
    };*/
    


    return(
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Create New Group</h3>
                
        

        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)} 
            required 
          />
        </label>
        <br />



        <button className='create-button' type="submit">Create</button>
      </form>

        </div>
    );
};

export default CreateGroup;