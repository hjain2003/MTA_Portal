import React, { useEffect, useState } from 'react';
import './Announcements.css';
import SideNav from '../../../Components/Navbar/Navbar';
import ACard from './ACard/ACard';
import { useNavigate } from 'react-router-dom';
// import { useEditContext } from '../../../EditContext';

const Announcements = () => {
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [selectedButton, setSelectedButton] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const {userData, setUserData} = useEditContext();

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  const token = localStorage.getItem('jwtoken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAnnouncements = async () => {
      try {
        setIsLoading(true); // Set loading status to true when fetching data
        const response = await fetch('http://localhost:5000/announcement/getAllAnnouncements', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('An error occurred while fetching announcements');
        }

        const data = await response.json();
        setAllAnnouncements(data.announcements);
        setIsLoading(false); // Set loading status to false after data is fetched
      } catch (error) {
        // console.error('Error fetching announcements:', error);
        setIsLoading(false); // Set loading status to false on error
      }
    };

    // Fetch all announcements
    fetchAllAnnouncements();
  }, [token]);

  const handleButtonClick = (category) => {
    setSelectedButton(prevState => prevState === category ? '' : category);
  };

  const filteredAnnouncements = allAnnouncements.filter(item => {
    if (selectedButton === 'COE16') {
      return item.subgroup === subgroup;
    } else if (selectedButton === 'COE15-22') {
      return item.group === group;
    }
    return true; // No filtering for other cases
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Reverse the array to show latest announcement first

  const shouldSetHeight = filteredAnnouncements.length < 4;

  return (
    <div className={`fullmain ${shouldSetHeight ? 'app' : ''}`}>
      <SideNav heading='ANNOUNCEMENTS' />
      <div className="containerr">
        <div className='mobHead'>
          ANNOUNCEMENTS
        </div>
        <div className='fend'>
          <div
            className={`butf ${selectedButton === 'COE16' ? 'active' : ''}`}
            onClick={() => handleButtonClick('COE16')}
          >
            {subgroup}
          </div>
          <div
            className={`butf ${selectedButton === 'COE15-22' ? 'active' : ''}`}
            onClick={() => handleButtonClick('COE15-22')}
          >
            {group}
          </div>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : filteredAnnouncements.length === 0 ? (
            <div className='nodat anndat'>No Data Available</div>
          ) :  (
          filteredAnnouncements.map((item) => (
            <ACard
              key={item._id}
              id={item._id}
              date={item.date}
              description={item.description}
              groupOrSubgroup={item.group || item.subgroup}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Announcements;
