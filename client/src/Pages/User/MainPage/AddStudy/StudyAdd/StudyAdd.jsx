import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudyAdd.css';
// import { useEditContext } from '../../../../../EditContext';

const StudyAddCard = () => {
  // const { userData, setUserData } = useEditContext();
  const navigate = useNavigate();
  const [addBtn, setAddBtn] = useState('Add');
  const [inputData, setInputData] = useState({ subject: '', link: '' });
  const [selectedSection, setSelectedSection] = useState('subgroup'); // Default to subgroup selection

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  if(role == "admin"){
    setIsAdmin(true);
  }

  const handleButtonClick = (section) => {
    setSelectedSection(section);
  };

  const handleResourceAdd = async (event) => {
    event.preventDefault();
    setAddBtn('Adding ...');

    try {
      const response = await fetch(
        selectedSection === 'subgroup'
          ? 'http://localhost:5000/resource/addSubGrpResource'
          : 'http://localhost:5000/resource/addGrpResource',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtoken')}`,
          },
          body: JSON.stringify(inputData),
        }
      );

      if (response.status === 400) {
        setAddBtn('Add');
        window.alert('Empty fields!');
      } else {
        setAddBtn('Add');
        navigate('/study');
      }
    } catch (error) {
      navigate('/login');
      // console.error(error);
      // Handle error if needed
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='full'>
      <form onSubmit={handleResourceAdd}>
        <div className='title-a'>Subject</div>
        <input
          className='an-details-sm'
          placeholder='Enter title'
          type='text'
          name='subject'
          onChange={handleChange}
        />
        <div className='title-a sm-cl'>Class</div>
        <div className='context'>Select your Section/Group</div>
        <div className='sm-but-cl'>
          <button
            className={`sec-grp ${selectedSection === 'subgroup' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              handleButtonClick('subgroup');
            }}
          >
            {subgroup}
          </button>
          <button
            className={`sec-grp ${selectedSection === 'group' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              handleButtonClick('group');
            }}
          >
            {group}
          </button>
        </div>

        <div className='title-a'>Link</div>
        <input
          className='an-details-sm'
          placeholder='Paste link here...'
          type='text'
          name='link'
          onChange={handleChange}
        />
        <div className='break'></div>
        <div className='submiting'>
          <button type='submit' className='sub'>
            {addBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyAddCard;
