
// import React, { useState,useEffect } from 'react';
// import axios from 'axios';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import  "./ScheduleMessage.css"



// const ScheduleMessage = () => {
//   const [message, setMessage] = useState('');
//   const [recipients, setRecipients] = useState([]);
//   const [sendEmail, setSendEmail] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/users');
//         setUsers(response.data);
//         const givenOptions = response.data.map(user => ({
//           label: user.username,
//           value: user._id
//         }));
//         setOptions(givenOptions)
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // // Function to handle recipient selection
//   // const handleRecipientChange = (e) => {
//   //   const selectedRecipients = Array.from(e.target.selectedOptions, (option) => option.value);
//   //   setRecipients(selectedRecipients);
//   // };
//   const handleRecipientChange = (e) => {
//     const selectedRecipients = Array.from(e, (option) => option.value);
//     setRecipients(selectedRecipients);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3001/MessageForm', {
//         message,
//         recipients,
//         sendEmail,
//       });
//       console.log(response.data);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };


//   //   const handleRecipientChange = (e) => {
//   //   const selectedRecipients = Array.from(e.target.selectedOptions, (option) => option.value);
//   //   setRecipients(selectedRecipients);
//   // };


//   return (
//     <div className='message-form-container' >
//       <h2>Schedule a Message</h2>
//       <form onSubmit={handleSubmit}>

//         <div className='datePicker'>
//       <DatePicker 
//         className='datePicker'
//         selected={selectedDate}
//         onChange={handleDateChange}
//         showTimeSelect
//         timeFormat="HH:mm"
//         timeIntervals={15}
//         dateFormat="MMMM d, yyyy h:mm aa"
//         placeholderText="Select date and time"
        
//       />
//       </div>

//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Write your message..."
//         />

//         <div>
//         <label>
//             Recipients:
//             <Select
//             options={options}
//             isMulti
//             onChange={handleRecipientChange}
//             />
//           </label>
//         </div>

//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={sendEmail}
//               onChange={() => setSendEmail(!sendEmail)}
//             />
//             Send via Email
//           </label>
//         </div>

//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };

// export default ScheduleMessage;
