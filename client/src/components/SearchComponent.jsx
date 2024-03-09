
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import  "./UserGroupsList.css"


const SearchComponent = () => {
  const [recipients, setRecipients] = useState([]);
  const [options, setOptions] = useState([]);
  const [groups,setGroups]=useState([]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/getAllGroups');
        setGroups(response.data);
        const givenOptions = response.data.map(group => ({
          label: group.groupName,
          value: group._id
        }));
        setOptions(givenOptions)
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleRecipientChange = (e) => {
    const selectedRecipients = Array.from(e, (option) => option.value);
    setRecipients(selectedRecipients);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
  };

  return (
    <div className='message-form-container' >
      <h2>Search a group</h2>
      <form onSubmit={handleSubmit}>

        <div>
        <label>
            Groups:
            <Select
            options={options}
            //isMulti
            onChange={handleRecipientChange}
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
