import React, { useEffect, useState } from 'react';
import './ACard.css';
// import { useEditContext } from '../../../../EditContext';

const ACard = ({ id, date, description, groupOrSubgroup }) => {
  // const { userData, setUserData } = useEditContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteBtnText, setDeleteBtnText] = useState('Delete');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // New state to track deletion4

  const name = localStorage.getItem('name');
  // const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this card?');
    if (confirmed) {
      setDeleteBtnText('Deleting...');
      try {
        const backendRoute =
          groupOrSubgroup === 'group'
            ? `http://localhost:5000/announcement/delGrpAnnouncement/${id}`
            : `http://localhost:5000/announcement/delSubGrpAnnouncement/${id}`;

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
      }
    }
  };

  const handleReadMoreClick = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (isDeleted) {
    return null; // Return null if the card is deleted
  }

  return (
    <div className='card-a'>
      <div className='top-an'>
        <div className='grpclass-a'>{date}</div>
        {isAdmin && (
          <div className='del-an' onClick={handleDelete}>
            {deleteBtnText}
          </div>
        )}
      </div>
      <div className='info-a'>
        {showFullDescription ? (
          <div>
            {description}
            <span className='read-more' onClick={handleReadMoreClick}>Read less...</span>
          </div>
        ) : (
          <div>
            {description.length > 100 ? (
              <div>
                {description.substring(0, 100)}...
                <span className='read-more' onClick={handleReadMoreClick}>Read more...</span>
              </div>
            ) : (
              description
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ACard;
