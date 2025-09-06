import React, { useState } from 'react'
import "./auth.css";
import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from "../../context/UserContext";
import { useCourseData } from '../../context/CourseContext';

const Login = () => {

const navigate=useNavigate()

  const {btnLoading,loginUser}=useUserData();
  
  const[email,setEmail]=useState("");
  
  const[password,setPassword]=useState("");

  const{fetchMyCourses}=useCourseData();
  
  const submitHandler=async(e)=>{
    e.preventDefault();
    await loginUser(email,password,navigate,fetchMyCourses)
  };
  return (
    <div>
      <div className="auth-page">
        <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="email">Email</label>
                <input type="email" value={email} 
                onChange={(e)=>setEmail(e.target.value)} required />
<label htmlFor="password">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
<button disabled={btnLoading} type='submit' className='common-btn'>{btnLoading?"Please Wait":"Login"}</button>
            </form>

            <p>
                Don't have an account?<Link to={"/register"}>Register</Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default Login
