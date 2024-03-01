import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthComtext';
import axios from 'axios';

const UserGroupsList =()=>{
const {user} = useAuthContext();
const [groups, setGroups] = useState([{groupName:"jnm",lastMessage:"hbjhn"}, {groupName:"jnm",lastMessage:"hbjhn"}, {groupName:"jnm",lastMessage:"hbjhn"}]);  

/*
useEffect(()=>{
setGroups()
},[groups])
*/
const getUserGroups = async () =>{

    try{
        //const response = await axios.post('http://localhost:3001/api/v1/UserGroupList',user.data._id)
        //setGroups(response.data.users)
        const response = await axios.post('http://localhost:3001/api/v1/UserGroupList',)
        console.log(response.data.groups)
        setGroups(response.data.groups)


    }catch(error){
        throw error;
    }
}



return(
    <div>
         <h2>Groups List</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.groupName}>
            <strong>{group.groupName}</strong>
            <p>Last Message: </p>
          </li>
        ))}
      </ul>
      <button onClick={getUserGroups}/>


    </div>

);

};

export default  UserGroupsList; 