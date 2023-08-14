import React, { useState } from 'react';
import './ImpAddCard.css';
import DropdownAdd from '../../../../../Components/DropDownPop/DropDownAdd';
import { useNavigate } from 'react-router-dom';
// import { useEditContext } from '../../../../../EditContext';

const ImpAddCard = () => {
  const navigate = useNavigate();
  // const { userData, setUserData } = useEditContext();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [selectedGroupOrSubgroup, setSelectedGroupOrSubgroup] = useState('subgroup');
  const [submitText,setSubmitText] = useState('Submit');

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  if(role == "admin"){
    setIsAdmin(true);
  }

  const token = localStorage.getItem('jwtoken');

  const handleImpSubmit = async () => {
    setSubmitText('Processing ...');
    try {
      if (!date || !time || !venue || !type || !title) {
        window.alert('Please fill in all the details.');
        return;
      }

      const requestData = {
        date,
        time,
        venue,
        type,
        title,
        selectedGroupOrSubgroup,
      };

      const backendRoute =
        selectedGroupOrSubgroup === 'subgroup'
          ? 'http://localhost:5000/exam/addSubGrpExam'
          : 'http://localhost:5000/exam/addGrpExam';

      const response = await fetch(backendRoute, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSubmitText('Submit');
        // console.log('Exam date added successfully!');
        navigate('/impdates');
      } else {
        setSubmitText('Submit');
        // console.log('Failed to add the exam date!');
        // console.log(data);
      }
    } catch (error) {
      setSubmitText('Submit');
      navigate('/login');
      // console.error('Error adding exam date:', error);
    }
  };

  const classOptions = ['EST', 'MST', 'SESS', 'LAB', 'MISC.'];

  const handleTextareaKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleImpSubmit();
    }
  };
  
  return (
    <div className='full'>
      <div className='row-1'>
        <div className='rowz'>
          <div className='date-imp'>
            <div className='title-a'>Date</div>
            <input
              type='date'
              className='datechoice'
              name='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className='time-imp'>
            <div className='title-a'>Time</div>
            <input
              type='time'
              className='datechoice bbt'
              name='time'
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div className='rowz1'>
          <div className='venue-imp'>
            <div className='title-a'>Venue</div>
            <input
              type='text'
              className='datechoice'
              placeholder='LT-101'
              name='venue'
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
          </div>

          <div className='type-imp'>
            <div className='title-a'>Type</div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className='datechoice tyty'
              name='type'
            >
              <option value=''>All</option>
              {classOptions.map((option, index) => (
                <option className='harsh' key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <br />
      <div className='title-a' id='sub_grp'>
        SubGroup/Group
      </div>
      <button
        className={`sec-grp ${selectedGroupOrSubgroup === 'subgroup' ? 'active' : ''}`}
        onClick={() => setSelectedGroupOrSubgroup('subgroup')}
      >
        {subgroup}
      </button>
      <button
        className={`sec-grp ${selectedGroupOrSubgroup === 'group' ? 'active' : ''}`}
        onClick={() => setSelectedGroupOrSubgroup('group')}
      >
        {group}
      </button>
     
      <div className='title-a'>Info</div>
      <textarea
        className='an-details'
        placeholder='Write an announcement here...'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleTextareaKeyPress}
      ></textarea>
      <div className='submiting'>
        <p className='sub' onClick={handleImpSubmit}>
          {submitText}
        </p>
      </div>
    </div>
  );
};

export default ImpAddCard;
