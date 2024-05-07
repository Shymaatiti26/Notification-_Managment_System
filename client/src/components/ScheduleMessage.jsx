
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import  "./ScheduleMessage.css"
import { CalendarIcon} from '@chakra-ui/icons'
import io from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthComtext";



const ScheduleMessage = () => {
  const [message, setMessage] = useState('');
  const [toGroups, setToGroups] = useState([]);
  const [sendEmail, setSendEmail] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const[users,setUsers]=useState();
  
  const {
    user,
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    setShowChat,socket, setSocket
  } = useAuthContext();
   const mySocket = io("http://localhost:3001");




  

  useEffect(() => {


   
    const fetchUsers = async () => {
      
      
      try {
        
        //get all existing users
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
        const givenOptions = response.data.map(user => ({
          label: user.username,
          value: user._id
        }));
/*
        //get all existing groups
        const response = await axios.get('http://localhost:3001/api/v1/getGroups');
        console.log(response.data)
        const givenOptions = response.data.groups.map(group => ({
          label: group.groupName,
          value: group
        }));

*/
        setOptions(givenOptions)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // // Function to handle recipient selection
  // const handleGroupsChange = (e) => {
  //   const selectedGroups = Array.from(e.target.selectedOptions, (option) => option.value);
  //   setToGroups(selectedGroups);
  // };
  const handleGroupsChange = (e) => {
    const selectedGroups = Array.from(e, (option) => option.value);
    setToGroups(selectedGroups);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  //send msg form to the server (Send button)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      /*
      const response = await axios.post('http://localhost:3001/MessageForm', {
        message,
        toGroups,
        sendEmail,
      });
      */
      
      toGroups.forEach(group => {
       mySocket.emit("joinGroup", group._id);
       mySocket.emit("userRoom", user._id);
      const messageData = {
        groupId: group._id,
        sender: user.username,
        message: message,
        timeSent:
          new Date(Date.now()).getHours() + ":" + new Date().getMinutes(),
        users: group.users,
        groupName: group.groupName,
        group: group,
      };
       mySocket.emit("send-message", messageData);
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  //   const handleGroupsChange = (e) => {
  //   const selectedGroups = Array.from(e.target.selectedOptions, (option) => option.value);
  //   setToGroups(selectedGroups);
  // };


  return (
    <div className='message-form-container' >
      <h2>Schedule a Message</h2>
      <form onSubmit={handleSubmit}>

        <div className='datePicker'>
          <CalendarIcon boxSize={7} />
      <DatePicker 
        className='datePicker'
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Select date and time"
        
      />
      </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
        />

        <div>
        <label>
            Choose groups:
            <Select
            options={options}
            isMulti
            onChange={handleGroupsChange}
            />
          </label>
        </div>


        <button className='SendButton' type="submit">Send</button>
      </form>
    </div>
  );
};

export default ScheduleMessage;
