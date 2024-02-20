import React, { useEffect, useState } from 'react';
import './Deadline.css';
import SideNav from '../../../Components/Navbar/Navbar';
import DCard from './DCard/DCard';
import Dropdown from './Dropdown/Dropdown';
import { useNavigate } from 'react-router-dom';

const Deadline = () => {
  const dropdownItems = ['MicroPSD', 'Optimization Techniques', 'TOC', 'Innovation', 'Computer Graphics','Elective', 'Capstone'];
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [allDeadlines, setAllDeadlines] = useState([]);
  const [originalDeadlines, setOriginalDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDueFilterActive, setIsDueFilterActive] = useState(false); 

  useEffect(() => {
    const fetchAllDeadlines = async () => {
      try {
        const response = await fetch('https://mta-backend.vercel.app/deadline/getAllDeadlines', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('An error occurred while fetching deadlines');
        }

        const data = await response.json();
        setAllDeadlines(data.deadlines);
        setOriginalDeadlines(data.deadlines);
        setIsLoading(false);
      } catch (error) {
        // console.error('Error fetching deadlines:', error);
        navigate('/landing');
        setIsLoading(false);
      }
    };

    fetchAllDeadlines();
  }, []);

  // const sortedDataArray = allDeadlines.slice().sort((a, b) => {
  //   const dateA = new Date(a.date);
  //   const dateB = new Date(b.date);
  //   return dateA - dateB;
  // });
  const sortedDataArray = allDeadlines.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const currentDate = new Date();

    if (dateA < currentDate && dateB < currentDate) {
      return dateA - dateB;
    } else if (dateA < currentDate) {
      return 1;
    } else if (dateB < currentDate) {
      return -1; 
    }

    return dateA - dateB; // Sort by date for other cases
  });

  const shouldSetHeight = sortedDataArray.length < 4;
  const noEl = sortedDataArray.length === 0;

  const handleSubjectChange = (selectedSubject) => {
    setSelectedSubject(selectedSubject);
  
    if (selectedSubject !== 'All Subjects') {
      const filteredDeadlines = originalDeadlines.filter(item => item.title === selectedSubject);
      setAllDeadlines(filteredDeadlines);
    } else {
      setAllDeadlines(originalDeadlines);
    }
  };

  const handleDueFilter = () => {
    if (isDueFilterActive) {
      setAllDeadlines(originalDeadlines);
    } else {
      const currentDate = new Date();
      const filteredDeadlines = originalDeadlines.filter(item => new Date(item.date) < currentDate);
      setAllDeadlines(filteredDeadlines); 
    }
    setIsDueFilterActive(prevState => !prevState);
  };

  return (
    <div className={`fullmain ${shouldSetHeight ? 'fill' : ''}`}>
      <SideNav heading='DEADLINES' />
      <div className="containerr-dd">
        <div className='mobHead'>
          DEADLINES
        </div>

        <div className='deadBard'>
          <div className='filter'>
            FILTER BY <Dropdown items={[...dropdownItems, 'All Subjects']} onChange={(selectedSubject) => handleSubjectChange(selectedSubject === null ? 'All Subjects' : selectedSubject)} selectedSubject={selectedSubject} />
          </div>
          <div
            className={`butf BUTD ${isDueFilterActive ? 'active' : ''}`}
            onClick={handleDueFilter}
          >
            PAST DUE
          </div>
        </div>
        <div className={`msg ${isLoading ? 'show' : ''}`}>
          {isLoading ? 'Loading ...' : null}
        </div>
        {sortedDataArray.length === 0 ? (
            <div className='nodat anndat'>No Data Available</div>
          ) : sortedDataArray.map(item => (
          <DCard
            key={item._id}
            id={item._id}
            title={item.title}
            description={item.description}
            date={item.date}
            groupOrSubgroup={item.group || item.subgroup}
          />
        ))}
      </div>
    </div>
  );
};

export default Deadline;
