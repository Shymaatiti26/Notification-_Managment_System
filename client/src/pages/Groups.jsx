import React, { useState, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import "./Groups.css";
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
import {SearchIcon } from "@chakra-ui/icons";
import { useAuthContext } from "../hooks/useAuthComtext";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [followedGroups, setFollowedGroups] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const {
    user
  } = useAuthContext();
  const userId =user._id;

  useEffect(() => {
    /*
    // Load followed groups from localStorage on component mount
    const storedFollowedGroups = JSON.parse(
      localStorage.getItem("followedGroups")
    );
    if (storedFollowedGroups) {
      setFollowedGroups(storedFollowedGroups);
    }*/
    getUserGroups();

    // Fetch groups from the server
    axios
      .get("http://localhost:3001/api/v1/getAllGroups")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
      getUserGroups();
  }, []);

  const getUserGroups =async ()=>{
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/getUserfollowedGroups",{userId});
       console.log('followed groups'+response.data);
      setFollowedGroups(response.data);
      //console.log(response.data)
    } catch (error) {
      throw error;
    }

  };

  const handleFollow = (groupId) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData._id;

    if (followedGroups.includes(groupId)) {
      // If the group is already followed, unfollow it
      axios
        .put("http://localhost:3001/api/v1/RemoveUserFromGroup", {
          userId,
          groupId,
        })
        .then(() => {
          // Update the state
          setFollowedGroups(followedGroups.filter((id) => id !== groupId));
          // Update localStorage
          localStorage.setItem(
            "followedGroups",
            JSON.stringify(followedGroups.filter((id) => id !== groupId))
          );
        })
        .catch((error) => {
          console.error("Error removing user from group:", error);
        });
    } else {
      // If the group is not followed, follow it
      axios
        .put("http://localhost:3001/api/v1/UpdateGroup", { userId, groupId })
        .then(() => {
          // Update the state
          setFollowedGroups([...followedGroups, groupId]);
          // Update localStorage
          localStorage.setItem(
            "followedGroups",
            JSON.stringify([...followedGroups, groupId])
          );
        })
        .catch((error) => {
          console.error("Error updating group:", error);
        });
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Group Name",
        accessor: "groupName",
      },
      {
        Header: "Follow/Unfollow",
        accessor: "_id",
        Cell: ({ row }) => (
          <button
            className={
              followedGroups.includes(row.original._id)
                ? "unfollow-button"
                : "follow-button"
            }
            onClick={() => handleFollow(row.original._id)}
          >
            {followedGroups.includes(row.original._id) ? "Unfollow" : "Follow"}
          </button>
        ),
      },
    ],
    [followedGroups]
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
      data: groups,
      initialState: { pageIndex: 0, pageSize: 10 }, // Initial page index and page size
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="searchInputDiv">
      <button onClick={onOpen}> 
        <SearchIcon
          className="searchIcon"
          boxSize={6}
          ref={btnRef}
          colorScheme="teal"
        >
          Open
        </SearchIcon>
        Search group 
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
          <DrawerHeader>Search Group</DrawerHeader>

          <DrawerBody>
                <input
        type="text"
        className="searchInputGroup"
        placeholder="Search Group Name..."
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table {...getTableProps()} className="groupTable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="groupTh">
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
                    <td className="groupTd" {...cell.getCellProps()}>
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

export default Groups;
