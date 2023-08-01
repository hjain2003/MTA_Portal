import React, { useState } from 'react';
import './CardD.css';
import DropdownAdd from '../../../../../Components/DropDownPop/DropDownAdd';
import { useNavigate } from 'react-router-dom';
import { useEditContext } from '../../../../../EditContext';

const CardD = () => {
    const navigate = useNavigate();
    const { userData, setUserData } = useEditContext();
    const [title, setTitle] = useState('');
    const [clickedButton, setClickedButton] = useState('subgroup');
    const [date, setDate] = useState(''); // State to store the selected date
    const [description, setDescription] = useState(''); // State to store the more info text

    
    const token = localStorage.getItem("jwtoken");
    const handleClickSubD = async () => {
        try {

            if (!title || !date || !description) {
                window.alert('Please fill in all the details.');
                return;
              }
            const requestData = {
                title,
                date,
                description,
            };

            // Determine the appropriate backend route based on the clickedButton value
            const backendRoute = clickedButton === 'group' ? 'http://localhost:5000/deadline/addGrpDeadline' : 'http://localhost:5000/deadline/addSubGrpDeadline';

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

            if (response.status === 422) {
                window.alert('Empty fields! Please fill in all the details.');
            } else if (response.status === 201) {
                // Handle success scenario, e.g., show success message, clear form, etc.
                console.log('Deadline submission successful!');
                console.log(data);

                // Clear the form fields after successful submission
                setTitle('');
                setDate('');
                setDescription('');

                // Navigate to another page after successful submission, if required
                navigate('/deadline'); // Change '/success' to the desired route
            } else {
                console.log('Deadline submission failed!');
                console.log(data);
            }
        } catch (error) {
            // Handle any error that may occur during the API call
            console.error('Error submitting deadline:', error);
        }
    };

    const handleSubjectChange = (subject) => {
        setTitle(subject);
        console.log('Selected Title:', subject);
        // You can also update the userData or perform any other actions with the selected title here
    };

    const handleButtonClick = (buttonType) => {
        setClickedButton(buttonType);
        console.log(buttonType);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const dropdownItems = ['DSA', 'OS', 'DAA', 'AI', 'CN'];

    return (
        <div className='full'>
            <div className='title-a'>
                Subject
            </div>
            <div className='justlikethat'>
                <DropdownAdd items={dropdownItems} onSubjectChange={handleSubjectChange} />
            </div>
            <div className='title-a'>
                Class
            </div>
            <div className='context'>
                Select your Section/Group
            </div>
            <div className='select-but'>
                <button
                    className={`sec-grp ${clickedButton === 'subgroup' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('subgroup')}
                >
                    {userData.subgroup}
                </button>
                <button
                    className={`sec-grp ${clickedButton === 'group' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('group')}
                >
                    {userData.group}
                </button>
            </div>

            <div className='title-a'>
                Deadline
            </div>
            <input
                type='date'
                className='datechoice'
                value={date}
                onChange={handleDateChange}
            />

            <div className='title-a'>
                More info
            </div>
            <textarea
                className='an-details'
                placeholder='Write an announcement here...'
                value={description}
                onChange={handleDescriptionChange}
            ></textarea>

            <div className='submiting'>
                <p className='sub' onClick={handleClickSubD}>Submit</p>
            </div>
        </div>
    );
};

export default CardD;
