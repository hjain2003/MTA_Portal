import React, { useState, useEffect } from 'react';
import './Main.css';
import SideNav from '../../../Components/Navbar/Navbar';
import SmCard from './SmCard/SmCard';
import { BiSearchAlt } from 'react-icons/bi';
// import { useEditContext } from '../../../EditContext';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState(null);
  // const {userData, setUserData} = useEditContext();

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  const navigate = useNavigate();

  const heading = 'STUDY MATERIAL';

  const shouldSetHeight = filteredData.length < 10;

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setSearchQuery(inputValue);

    if (inputValue === '') {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) =>
          item.subject.toLowerCase().includes(inputValue)
        )
      );
    }
  };

  const handleButtonClick = (buttonName) => {
    if (buttonName === selectedButton) {
      setSelectedButton(null);
      // Show all data if no button is selected
      setFilteredData(data);
    } else {
      setSelectedButton(buttonName);
      // Apply filtering based on the selected button
      if (buttonName === 'COE16') {
        setFilteredData(data.filter((item) => item.subgroup === subgroup));
      } else if (buttonName === 'COE15-22') {
        setFilteredData(data.filter((item) => item.group === group));
      }
    }
  };
  


  const token = localStorage.getItem('jwtoken');
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:5000/resource/viewResource', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }

        const data = await response.json();
        setData(data.resources);
        setFilteredData(data.resources);
        setLoading(false);
      } catch (error) {
         navigate('/login');
        // console.error(error);
        setLoading(false);
      }
    };

    fetchResources();
  }, [token]);

  return (
    <div className={`fullmain ${shouldSetHeight ? 'fill' : ''}`}>
      <SideNav heading={heading} />

      <div className='containerr'>
        <div className='mobHead'>STUDY MATERIAL</div>
        <div className='search-contain'>
          <div className='search'>
            <input
              className='cards-i'
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder='Search by subject...'
            />
            <BiSearchAlt className='icon-search' />
          </div>
          <div
            className={`butf mainbut ${selectedButton === 'COE16' ? 'active' : ''}`}
            onClick={() => handleButtonClick('COE16')}
          >
            {subgroup}
          </div>
          <div
            className={`butf mainbut ${selectedButton === 'COE15-22' ? 'active' : ''}`}
            onClick={() => handleButtonClick('COE15-22')}
          >
            {group}
          </div>
        </div>
        <div className='cards-m'>
        {loading ? (
            <div>Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className='nodat'>No Data Available</div>
          ) : (
            filteredData.map((item) => (
              <SmCard
                key={item._id}
                id={item._id}
                subject={item.subject} 
                link={item.link}
                groupOrSubgroup={item.group || item.subgroup}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
