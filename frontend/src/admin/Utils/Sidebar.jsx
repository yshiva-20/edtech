import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLogout, AiFillHome } from 'react-icons/ai';
import { FaUserAlt, FaBook } from 'react-icons/fa';
import "./common.css"



const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/admin/dashboard">
                        <AiFillHome />
                        <span>Home</span>
                    </Link>
                </li>


                <li>
                    <Link to="/admin/course">
                        <FaBook />
                        <span>Courses</span>
                    </Link>
                </li>
                
                
                <li>

                    <Link to="/admin/users">
                        <FaUserAlt />
                        <span>Users</span>
                    </Link>
                </li>
                
                <li>
                    <Link to="/account">
                        <AiOutlineLogout />
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;