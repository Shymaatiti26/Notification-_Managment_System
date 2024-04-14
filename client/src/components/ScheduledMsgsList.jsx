import axios from "axios";
import { useAuthContext } from "../hooks/useAuthComtext";
import { useState, useEffect } from "react";
import {
  HStack,
  VStack,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import './ScheduledMsgsList.css'

//get all the user scheduled messages from db
const ScheduledMsgsList = () => {
  const { user } = useAuthContext();

  const [messages, setMessages] = useState([]);
  //const userName = user.username;
  const userData = JSON.parse(localStorage.getItem("user")); //get the user  info of current logged in use
  const userName = userData.username;
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getScheduledMsgs();
  }, [messages]);

  const getScheduledMsgs = async () => {
    /*
        const response = await axios.get('http://localhost:3001/api/v1/getScheduledMsgs ',{user});
        setMessages(response.data);*/

    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/getScheduledMsgs",
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          params: { userName },
        }
      );
      // console.log(response.data);
      setMessages(response.data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="mymessages_box">
      <button onClick={onOpen}>My Scheduled Messages</button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton color={'black'} />
          <ModalBody pb={6}>
            <h3>My Scheduled Messages</h3>
          <br />
      <VStack className="messages" spacing={2} align="stretch" overflowY="auto">
        {messages.map((message) => (
          <Box>
            <Box className="messageBox" p={4} key={message._id}>
            {message.group.map((group) => (
            <strong key={group._id}>Send To Group: {group.groupName}</strong>
        ))}
              <p> Message: {message.message} </p>
              <p className="sendingTime">send message at: {message.timeSent}</p>
            </Box>
            <div className="footer">
              <button className="delete_button">Delete</button>
            </div>
          </Box>
        ))}
      </VStack>
          </ModalBody>


        </ModalContent>
      </Modal>

    </div>
  );
};

export default ScheduledMsgsList;
