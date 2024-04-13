import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthComtext";
import "./CreateGroup.css";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
  const { user ,showErr,setShowErr} = useAuthContext();
  const [groupExistErr, setGroupExistErr] = useState(false);


  useEffect(() => {
    // This will be executed when groupId changes
    if (groupId !== "") {
      //alert(groupId + ' Group is created!');
      //joinRoom();
      //socket.emit('joinGroup',groupId);
    }
  }, [groupId]);

  const Submit = async () => {
    const username = user.username;
    const response = await axios.post(
      "http://localhost:3001/api/v1/createGroup",
      { groupName ,user}
    );
    if(!response.data.exist){
    setGroupId(JSON.stringify(response.data.groupId));
    //localStorage.setItem("group", response.data.groupId);
    localStorage.setItem(
      "group",
      JSON.stringify({ groupId: groupId, groupName: groupName })
    );
    setGroupExistErr(false);
    setShowErr(false);
  }else{
    //alert("This name already exist")
    setGroupExistErr(true);
    setShowErr(true);
  }
  };



  return (
    <div>
      <form >
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

        <button className="create-button" onClick={Submit}>
          Create
        </button>
        {groupExistErr && (<p>group name is  existed!</p>)}
       
      </form>
    </div>
  );
};

export default CreateGroup;
