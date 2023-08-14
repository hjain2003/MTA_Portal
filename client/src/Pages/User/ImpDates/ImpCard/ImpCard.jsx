import React, { useEffect, useState } from 'react';
import './ImpCard.css';
import { MdOutlineDeleteForever } from 'react-icons/md';
// import { useEditContext } from '../../../../EditContext';

const ImpCard = ({ id, subject, date, time, venue, type, groupOrSubgroup }) => {
  // const { userData, setUserData } = useEditContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // New state to track deletion

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  if(role == "admin"){
    setIsAdmin(true);
  }

  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-indexed
    const year = dateObj.getFullYear().toString().slice(-2); // Get last two digits of the year

    return `${day}/${month}/${year}`;
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this exam?');
    if (confirmed) {
      try {
        setIsDeleting(true);

        const backendRoute =
          groupOrSubgroup === 'group'
            ? `http://localhost:5000/exam/delGrpExams/${id}`
            : `http://localhost:5000/exam/delSubGrpExams/${id}`;

        const token = localStorage.getItem('jwtoken');
        const response = await fetch(backendRoute, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsDeleted(true); // Update state to hide the card
        } else {
          // Handle deletion failure
        }
      } catch (error) {
        // Handle error
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isDeleted) {
    return null; // Return null if the card is deleted
  }

  return (
    <>
      <div>
        <div className='card-imp-d'>
          <div className='card-imp'>
            <div className='sub-box'>
              <div className='subj'>
                {subject} <br/><div className='harshFuckedUp'>{groupOrSubgroup}</div>
              </div>
            </div>
            <div className='dtogether'>
              <div className='date'>{formatDate(date)}</div>
              <div className='time'>{time}</div>
            </div>
            <div className='tven'>
              <div className='type'>&nbsp;&nbsp;&nbsp;&nbsp;{type}</div>
              <div className='venmob'>&nbsp;{venue}</div>
            </div>
            <div className='venue'>{venue}</div>
            {isAdmin && (
              <div className='del-impdate' onClick={handleDelete}>
                {isDeleting ? '...' : <MdOutlineDeleteForever />}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImpCard;
