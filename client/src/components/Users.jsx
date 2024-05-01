import React, { useState, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import "./Users.css";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useAuthContext } from "../hooks/useAuthComtext";

//import CreateGroup from "../components/CreateGroup";
//import { useAuthContext } from "../hooks/useAuthComtext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const userData = JSON.parse(localStorage.getItem("user"));
  //const adminId = userData._id;
  const adminUsername = userData.username;
  const [userExistErr, setUserExistErr] = useState(false);
  const {
    user
  } = useAuthContext();
  const adminId = user._id;

  useEffect(() => {
    /*
    // Load followed users from localStorage on component mount
    const storedFollowedUsers = JSON.parse(
      localStorage.getItem("followedUsers")
    );
    if (storedFollowedUsers) {
      setFollowedUsers(storedFollowedUsers);
    }*/

    //getFollowedUsers();

    // Fetch users from the server
    axios
      .get("http://localhost:3001/api/v1/getAllUsers")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

      getFollowedUsers();
  }, []);

  useEffect(() => {


    getFollowedUsers();
  }, [user]);

  

  const getFollowedUsers = async () => {
   
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/followedUsersList2",
        {adminId}
      );
      console.log("followed groups" + response.data);
      setFollowedUsers(response.data);
      //console.log(response.data)
    } catch (error) {
      throw error;
    }
  };

  //createUserArray(adminId);
  const handleFollow = (userId) => {
    //createUserArray(adminId);
    if (followedUsers.includes(userId)) {
      axios
        .put("http://localhost:3001/api/v1/RemoveUserFromUser1", {
          adminId,
          userId,
        })
        .then(() => {
          // Update the state
          setFollowedUsers(followedUsers.filter((id) => id !== userId));
          // Update localStorage
          localStorage.setItem(
            "followedUsers",
            JSON.stringify(followedUsers.filter((id) => id !== userId))
          );
        })
        .catch((error) => {
          console.error("Error removing user from user1:", error);
        });
    } else {
      // If the group is not followed, follow it
      axios
        .post("http://localhost:3001/api/v1/followUser", { adminId, userId })
        .then(() => {
          // Update the state
          setFollowedUsers([...followedUsers, userId]);
          // Update localStorage
          localStorage.setItem(
            "followedUsers",
            JSON.stringify([...followedUsers, userId])
          );
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Users",
        accessor: "username",
      },
      {
        Header: "Follow/Unfollow",
        accessor: "_id",
        Cell: ({ row }) => (
          <button
            className={
              followedUsers.includes(row.original._id)
                ? "unfollow-button"
                : "follow-button"
            }
            onClick={() => handleFollow(row.original._id)}
          >
            {followedUsers.includes(row.original._id) ? "Unfollow" : "Follow"}
          </button>
        ),
      },
    ],
    [followedUsers]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
  } = useTable(
    {
      columns,
      data: users,
      initialState: { pageIndex: 0, pageSize: 10 }, // Initial page index and page size
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="searchInputDiv">
      <button onClick={onOpen}>
        <SearchIcon className="searchIcon" boxSize={6} ref={btnRef}>
          Open
        </SearchIcon>
        Search user
      </button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <input
              type="text"
              className="searchInputUsers"
              placeholder="Search Users..."
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <table {...getTableProps()} className="userTable">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="">
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} className="userTh">
                        {column.render("Header")}{" "}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td className="userId" {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Users;
