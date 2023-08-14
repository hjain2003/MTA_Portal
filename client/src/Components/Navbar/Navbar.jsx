import React, { useState, useEffect, memo, useMemo } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { PiBooksDuotone } from 'react-icons/pi';
import { TiThMenuOutline } from 'react-icons/ti';
import { TfiAnnouncement } from 'react-icons/tfi';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import { LiaStopwatchSolid, LiaCalendarSolid } from 'react-icons/lia';
import { Link, useNavigate } from 'react-router-dom';
import { useEditContext } from '../../EditContext';


const SideNav = (props) => {
  // const {userData, setUserData} = useEditContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { heading } = props;

  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const subgroup = localStorage.getItem('subgroup');
  const group = localStorage.getItem('group');
  const email = localStorage.getItem('email');

  
  // Check admin status
  const { makeEdit, setMakeEdit } = useEditContext();


  const [showSidee, setShowSidee] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleEditClick = () => {
    setMakeEdit(true); // Set the makeEdit state using the context function
  };

  const handleExitClick = () => {
    setMakeEdit(false); // Set the makeEdit state using the context function
  };

  useEffect(() => {

    if(role == "admin"){
      setIsAdmin(true);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidee = () => {
    if (windowWidth < 1038) {
      setShowSidee(!showSidee);
    }
  };


  const token = localStorage.getItem("jwtoken");

  const handleLogout = async () => {
    const result = window.confirm('Are you sure you want to logout?');
    if (result) {
      try {
        const res = await fetch('http://localhost:5000/user/logout', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          const error = new Error(res.error);
          throw error;
        } else {
          navigate('/login');
          // localStorage.removeItem('userId');
          localStorage.removeItem('jwtoken');
        }
      } catch (err) {
      }
    }
  };


  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div className='whole'>
      <div className={`sidee ${showSidee ? 'show-sidee' : ''}`}>
        <div className='sidenav'>
          {/* <div className='dash'>DASHBOARD</div> */}
          <div className='person-info'>
            <p className='welc'>Welcome,</p>

            <>
              <p className='name'>{name}</p>
              <p className='mail'>{email}</p>
            </>

            <p className='admin-mode'>
              {isAdmin && <p className='crgr'>CR/GR</p>}
              {!isAdmin && <p className='crgr'>STUDENT</p>}
              {isAdmin && !makeEdit && <button className='edit' onClick={handleEditClick}>ADD INFO</button>}
              {isAdmin && makeEdit && <button className='edit' onClick={handleExitClick}>EXIT</button>}
            </p>
          </div>
          <div className='links'>
            <Link to="/study">
              <div className='link'>
                <div className={`focus ${(isActive('/study') || isActive('/add/study')) ? 'active-link' : ''}`}>
                  <PiBooksDuotone className='logo' />
                  &nbsp;Study Material
                </div>
                {isAdmin && makeEdit &&
                  <Link to="/add/study">
                    <BsFillPlusSquareFill className='addLogo' />
                  </Link>
                }
              </div>
            </Link>

            <Link to="/announcements">
              <div className='link'>
                <div className={`focus ${(isActive('/announcements') || isActive('/add/announcements')) ? 'active-link' : ''}`}>
                  <TfiAnnouncement className='logo annlog' />
                  &nbsp;Announcements
                </div>

                &nbsp;
                {isAdmin && makeEdit &&
                  <Link to="/add/announcements">
                    <BsFillPlusSquareFill className='addLogo' />
                  </Link>
                }
              </div>
            </Link>

            <Link to="/deadline">
              <div className='link'>
                <div className={`focus ${(isActive('/deadline') || isActive('/add/deadline')) ? 'active-link' : ''}`}>
                  <LiaStopwatchSolid className='logo' />
                  &nbsp;Deadlines
                </div>

                {isAdmin && makeEdit &&
                  <Link to="/add/deadline">
                    <BsFillPlusSquareFill className='addLogo' />
                  </Link>
                }
              </div>
            </Link>

            <Link to="/impdates">
              <div className='link'>
                <div className={`focus ${(isActive('/impdates') || isActive('/add/impdates')) ? 'active-link' : ''}`}>
                  <LiaCalendarSolid className='logo' />
                  &nbsp;Evaluations
                </div>

                {isAdmin && makeEdit &&
                  <Link to="/add/impdates">
                    <BsFillPlusSquareFill className='addLogo' />
                  </Link>
                }
              </div>
            </Link>


          </div>

          {/* <Link className="linkabt" to="/about"> */}
          <div className='foot'>
            Made with ❤️ by <br />Team
            <a className='lucky' target="_blank" rel="noopener" href='https://www.linkedin.com/in/lakshaya-aggarwal-9b958b228/'> L</a>
            <a className='grass' target="_blank" rel="noopener" href='https://www.linkedin.com/in/harsh--jain/'>H</a>
            <a target="_blank" rel="noopener" href='https://www.linkedin.com/in/shreeyachatterji/' className='chatz'>S</a>
          </div>
          {/* </Link> */}

        </div>
      </div>

      <div className='horHead' onClick={toggleSidee}>
        <div className='ham'>
          <TiThMenuOutline />
          <p>Menu</p>
        </div>
        <button className='logout-btn' onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className='pcHead'>
        <div className='head'>
          <p>{heading}</p>
        </div>
        <button className='logout-btn-pc' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideNav;
