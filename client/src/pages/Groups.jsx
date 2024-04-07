import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';
import './Groups.css'

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [followedGroups, setFollowedGroups] = useState([]);

  useEffect(() => {
    // Load followed groups from localStorage on component mount
    const storedFollowedGroups = JSON.parse(localStorage.getItem('followedGroups'));
    if (storedFollowedGroups) {
      setFollowedGroups(storedFollowedGroups);
    }

    // Fetch groups from the server
    axios.get('http://localhost:3001/api/v1/getAllGroups')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
  }, []);

  const handleFollow = (groupId) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData._id;

    if (followedGroups.includes(groupId)) {
      // If the group is already followed, unfollow it
      axios.put('http://localhost:3001/api/v1/RemoveUserFromGroup', { userId, groupId })
        .then(() => {
          // Update the state
          setFollowedGroups(followedGroups.filter(id => id !== groupId));
          // Update localStorage
          localStorage.setItem('followedGroups', JSON.stringify(followedGroups.filter(id => id !== groupId)));
        })
        .catch(error => {
          console.error('Error removing user from group:', error);
        });
    } else {
      // If the group is not followed, follow it
      axios.put('http://localhost:3001/api/v1/UpdateGroup', { userId, groupId })
        .then(() => {
          // Update the state
          setFollowedGroups([...followedGroups, groupId]);
          // Update localStorage
          localStorage.setItem('followedGroups', JSON.stringify([...followedGroups, groupId]));
        })
        .catch(error => {
          console.error('Error updating group:', error);
        });
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Group Name',
        accessor: 'groupName',
      },
      {
        Header: 'Follow/Unfollow',
        accessor: '_id',
        Cell: ({ row }) => (
          <button
            className={followedGroups.includes(row.original._id) ? 'unfollow-button' : 'follow-button'}
            onClick={() => handleFollow(row.original._id)}
          >
            {followedGroups.includes(row.original._id) ? 'Unfollow' : 'Follow'}
          </button>
        )
      }
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
      initialState: { pageIndex: 0, pageSize: 10 } // Initial page index and page size
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className='searchInputDiv'>
      <h2>Groups</h2>
      <input
        type="text"
        className='searchInputGroup'
        placeholder="Search Group Name..."
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table {...getTableProps()} className='groupTable'>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className=''>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className='groupTh'>{column.render('Header')} </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td className='groupTd'{...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='pagintorDiv'>
        <button className='pagination-buttons' onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <button className='pagination-buttons' onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Groups;