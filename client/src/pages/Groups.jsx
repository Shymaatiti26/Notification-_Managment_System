import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';
import './Groups.css'

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [followedGroups, setFollowedGroups] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  
  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/getAllGroups')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
      });
  }, []);
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'Group Name',
        accessor: 'groupName',
      },
      {
        // Header: 'Follow/Unfollow',
        // accessor: 'id',
        // Cell: ({ value }) => (
        //   <button type='button' style={{color:'blue'}}onClick={() => handleFollow(value)}>Follow</button>
        // )
        Header: 'Follow/Unfollow',
        accessor: '_id',
        Cell: ({ row }) => (
          // <button type='button' style={{ color: followedGroups.includes(row.original._id) ? 'red' : 'blue' }} onClick={() => handleFollow(row.original._id)}>
          //   {followedGroups.includes(row.original._id) ? 'Unfollow' : 'Follow'}
          // </button>
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

  // const handleFollow = (groupId) => {
  //   if (followedGroups.includes(groupId)) {
  //       setFollowedGroups(followedGroups.filter(id => id !== groupId));
  //     } else {
  //       setFollowedGroups([...followedGroups, groupId]);
  //     }
  //   console.log('Follow group with ID:', groupId);
  // };
  const handleFollow = (groupId) => {
    const userData= JSON.parse(localStorage.getItem('user'));
    const userId=userData._id;
    if (followedGroups.includes(groupId)) {
      axios.put('http://localhost:3001/api/v1/RemoveUserFromGroup', { userId,groupId })
        .then(() => {
          setFollowedGroups(followedGroups.filter(id => id !== groupId));
        })
        .catch(error => {
          console.error('Error removing user from group:', error);
        });
    } else {
      axios.put('http://localhost:3001/api/v1/UpdateGroup', { userId,groupId })
        .then(() => {
          setFollowedGroups([...followedGroups, groupId]);
        })
        .catch(error => {
          console.error('Error updating group:', error);
        });
    }
  };

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
