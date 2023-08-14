import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useEditContext } from '../../EditContext';
import './Login.css';

const Login = () => {
  // const { userData, setUserData } = useEditContext();
  const [loadingMsg, setLoadingMsg] = useState('Login');
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoadingMsg('LOGGING IN ...');

    const { email, password } = user;

    try {
      const res = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.status === 400) {
        setLoadingMsg('Login');
        window.alert('Login failed !');
      } else {
        // setUserData(data);
        setLoadingMsg('Login');
        localStorage.setItem('jwtoken', data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('role', data.role);
        localStorage.setItem('subgroup', data.subgroup);
        localStorage.setItem('group', data.group);
        localStorage.setItem('email', data.email);
        navigate('/study');
      }
    } catch (error) {
      // console.error('An error occurred:', error);
      setLoadingMsg('Login');
    }
  };

  return (
    <div className='lpage'>
      <div className='pimg'></div>
      <div className='form-sec'>
        <div className='form'>
          <div className='descF'>
            <div className='title'>Sign in</div>
            <div className='desc'>
              If you don't have an account,
              <br />
              Contact your <span className='red'>GR/CR!</span>
            </div>
          </div>
          <div className='form-container'>
            <form onSubmit={loginUser}>
              <div className='form-group'>
                <div className='labell'>
                  Email
                </div>
                <input
                  placeholder='College email id'
                  type='email'
                  id='email'
                  name='email'
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <div className='labell'>
                  Password
                </div>
                <input
                  placeholder='Enter your password'
                  type='password'
                  id='password'
                  name='password'
                  onChange={handleChange}
                  required
                />
              </div>
              <Link className='rplink' to='/reset'>
                <div className='rp'>Reset Password!</div>
              </Link>
              <div className='forg'></div>
              <button type='submit' className='but-sin'>
                {loadingMsg}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
