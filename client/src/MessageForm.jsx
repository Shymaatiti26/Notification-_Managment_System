// MessageForm.js
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';


const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [sendEmail, setSendEmail] = useState(false);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        setUsers(response.data);
        const givenOptions = response.data.map(user => ({
          label: user.username,
          value: user._id
        }));
        setOptions(givenOptions)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // // Function to handle recipient selection
  // const handleRecipientChange = (e) => {
  //   const selectedRecipients = Array.from(e.target.selectedOptions, (option) => option.value);
  //   setRecipients(selectedRecipients);
  // };
  const handleRecipientChange = (e) => {
    const selectedRecipients = Array.from(e, (option) => option.value);
    setRecipients(selectedRecipients);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/MessageForm', {
        message,
        recipients,
        sendEmail,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  //   const handleRecipientChange = (e) => {
  //   const selectedRecipients = Array.from(e.target.selectedOptions, (option) => option.value);
  //   setRecipients(selectedRecipients);
  // };


  return (
    <div>
      <h2>Compose Message</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
        />
        <div>
        <label>
            Recipients:
            <Select
      options={options}
      isMulti
      onChange={handleRecipientChange}
    />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={() => setSendEmail(!sendEmail)}
            />
            Send via Email
          </label>
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageForm;
