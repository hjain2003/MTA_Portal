import React,{useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  
  const [user, setUser] = useState({
    email: "",
    password: "",
})

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
        ...prevState,
        [name]: value
    }));
}

const loginUser = async (e) => {
  e.preventDefault();
  const {email, password } = user;

  const res = await fetch('http://localhost:5000/user/login', {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          email,
          password
      })
  });

  const data = await res.json();

  if (res.status === 400) {
      window.alert("Login failed !");
      console.log(res.status);
      console.log(data);
  } else if (res.status !== 400) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("jwtoken", data.token);
      navigate('/study');
      console.log(res.status);
      console.log(data);
  }
};
  
  return (
    <div className='lpage'>
        <div className='pimg'>
        </div>
        <div className='form-sec'>
        <div className='form'>
            <div className='descF'>
                <div className='title'>
                    Sign in
                </div>
                <div className='desc'>
                If you don't have an account,<br/>Contact your <span className='
                red'>GR/CR!</span>
                </div>
            </div>
    <div className="form-container">
      <form >
        <div className="form-group">
            <div className='labell'>Email</div>
          <input
            placeholder='College email id'
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
            <div className='labell'>Password</div>
          <input
            placeholder='Enter your password'
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div className='forg'></div>
        <button type="submit" className='but-sin' onClick={loginUser}>Login</button>
      </form>
    </div>
        </div>
        </div>
    </div>
  )
}

export default Login