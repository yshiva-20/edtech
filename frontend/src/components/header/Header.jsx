import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Import Link
import "./header.css";

const Header = ({isAuth}) => {
  return (
    <div>
      <header>
        <div className="logo">E-learning</div>
        <div className="link">
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/about">About</Link>
          
          {
            isAuth?<Link to="/accounts">Accounts</Link>:
            <Link to="/login">Login</Link>
          }
        </div>
      </header>
    </div>
  );
}

export default Header;