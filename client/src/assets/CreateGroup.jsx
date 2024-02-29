
import React, { useState } from 'react';
import axios from 'axios'

const CreateGroup = () =>{
    const [groupName, setGroupName] = useState('')
    

    const handleSubmit = async () =>{
        const response=await axios.post('http://localhost:3001/api/v1/createGroup',{groupName});

    };


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



        <button type="submit">Create</button>
      </form>

        </div>
    );
};

export default CreateGroup;