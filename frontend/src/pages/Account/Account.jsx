import React from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import {useUserData} from "../../context/UserContext"

import "./account.css"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



const Account = ({user}) => {
  const navigate=useNavigate()

  const {setIsAuth, setUser}=useUserData()
  const logoutHandler=()=>{
    localStorage.clear();
    setIsAuth(false);
    setUser([]);
    toast.success("Loged Out");
    navigate("/login");
  }

  return (
    <div>
     {
      user && ( <div className="profile">
        <h2>My Profile</h2>
        <div className="profile-info">
            <p>
                <strong>Name- {user.name}</strong>
            </p>
            <p>
                <strong>
                    Email- {user.email}
                </strong>
            </p>
            <button className='common-btn' onClick={()=>navigate(`/${user._id}/dashboard`)}>Dashboard<MdOutlineDashboard /></button>
           
            <br />
            {
              user.role=="admin" &&(<button className='common-btn' onClick={()=>navigate(`/admin/dashboard`)}>Admin Dashboard<MdOutlineDashboard /></button>)
            }
           <br />


        
        <button onClick={logoutHandler} className='common-btn' style={{color:"red"}}  >Logout<IoIosLogOut /></button>
        </div>

      </div>)
     }
    </div>
  )
}

export default Account
