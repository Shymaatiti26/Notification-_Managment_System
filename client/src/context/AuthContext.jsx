import { createContext, useEffect, useReducer ,useState} from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [notification, setNotification] = useState([]); //user notification
  const [selectedGroup, setSelectedGroup] = useState(); //the selected chat in the groups list
  const [groups, setGroups] = useState([]); //the chats in the group list
  const[error,setError]=useState('');//any error that can  occur on the user page
  const [showErr,setShowErr] = useState();
  const[showChat,setShowChat] = useState(false);
  const [socket, setSocket] = useState();
  const [IsGroupAdmin, setIsGroupAdmin] = useState();
  const [groupSenders,setGroupSenders]=useState();
  const [muteGroup,setMuteGroup]=useState();

    //start changes
    const[selectedUser, setSelectedUser]=useState();//the selected chat in users list
    const[users,setUsers]=useState([]);//the chats in users list
    const[IsAdmin,setAdmin]=useState();
    const[userSenders,setUsersSenders]=useState();
    const[muteUser,setMuteUser]=useState();
    const[showUserChat,setShowUserChat] = useState(false);
    const [userSocket, setUserSocket] = useState();
    const [userNotification, setUserNotification] = useState([]); //user notification
    const [notificationsRecived, SetnotificationsRecived] = useState("");
    //end changes
  


  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, notification,
      setNotification,selectedGroup, setSelectedGroup, groups, setGroups,showErr,setShowErr,error,setError,showChat,
      setShowChat,socket, setSocket, IsGroupAdmin, setIsGroupAdmin,groupSenders,setGroupSenders,muteGroup,setMuteGroup,
      selectedUser,userSocket, setUserSocket,setSelectedUser,users,setUsers,IsAdmin,setAdmin,userSenders
      ,setUsersSenders,muteUser,setMuteUser,showUserChat,setShowUserChat ,userNotification, setUserNotification,notificationsRecived, SetnotificationsRecived}}>
     
      {children}
    </AuthContext.Provider>
  );
};
