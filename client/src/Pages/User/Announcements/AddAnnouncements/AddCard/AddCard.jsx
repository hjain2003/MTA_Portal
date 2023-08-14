import React, { useState } from 'react'
import './AddCard.css'
import { useNavigate } from 'react-router-dom'
// import { useEditContext } from '../../../../../EditContext'

const AddCard = () => {
    // const { userData, setUserData } = useEditContext();
    const [clickedButton, setClickedButton] = useState('subgroup');
    const [description, setDescription] = useState('');
    const [submitText, setSubmitText] = useState('Submit');
    const navigate = useNavigate();

    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const subgroup = localStorage.getItem('subgroup');
    const group = localStorage.getItem('group');
    const email = localStorage.getItem('email');

    if (role == "admin") {
        setIsAdmin(true);
    }

    const token = localStorage.getItem("jwtoken");
    const handleAnnSubmit = async (e) => {
        setSubmitText('Processing ...');
        try {

            if (!description) {
                window.alert('Please fill in all the details.');
                return;
            }
            const requestData = {
                description,
            };

            // Determine the appropriate backend route based on the clickedButton value
            const backendRoute = clickedButton === 'group' ? 'http://localhost:5000/announcement/postMyGrpAnnouncements' : 'http://localhost:5000/announcement/postMySubGrpAnnouncements';

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
                setSubmitText('Submit');
                window.alert('Empty fields! Please fill in all the details.');
            } else if (response.status === 201) {
                setSubmitText('Submit');
                // Handle success scenario, e.g., show success message, clear form, etc.

                // Clear the form fields after successful submission
                setDescription('');

                // Navigate to another page after successful submission, if required
                navigate('/announcements'); // Change '/success' to the desired route
            } else {
                setSubmitText('Submit');
            }
        } catch (error) {
            navigate('/login');
            // Handle any error that may occur during the API call
            // console.error('Error submitting deadline:', error);
        }
    }

    const handleButtonClick = (buttonType) => {
        setClickedButton(buttonType);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleTextareaKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleAnnSubmit();
        }
    };

    return (
        <div className='full'>
            <div className='title-a'>
                Class
            </div>
            <div className='context'>
                Select your Section/Group
            </div>
            <button
                className={`sec-grp ${clickedButton === 'subgroup' ? 'active' : ''}`}
                onClick={() => handleButtonClick('subgroup')}
            >
                {subgroup}
            </button>
            <button
                className={`sec-grp ${clickedButton === 'group' ? 'active' : ''}`}
                onClick={() => handleButtonClick('group')}
            >
                {group}
            </button>
            <div className='title-a'>
                Announcement
            </div>
            <textarea className="an-detail" placeholder="Write an announcement here..." onChange={handleDescriptionChange} onKeyDown={handleTextareaKeyPress}>
            </textarea>
            <div className='submiting'>
                <p className='sub' onClick={handleAnnSubmit}>{submitText}</p>
            </div>

        </div>
    )
}

export default AddCard