import React from 'react'

import  { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from "../../context/UserContext";

import Loader from "../../components/loading/Loading";

const Register = () => {

const navigate=useNavigate()


  const {btnLoading,registerUser}=useUserData();
  
  const[email,setEmail]=useState("");
  
  const[password,setPassword]=useState("");

    const[name,setName]=useState("");

  
  const submitHandler=async(e)=>{
    e.preventDefault();
    await registerUser(name,email,password,navigate)
  };


if (btnLoading) {
    return <Loader message="Sending OTP..." />;
  }



  return (
    <div>
      <div className="auth-page">
        <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="name">Name</label>
                <input type="text"
                value={name} 
                onChange={(e)=>setName(e.target.value)}
                 required />


                 <label htmlFor="email">Email</label>
                <input type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
                required />


<label htmlFor="password">Password</label>
                <input type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                required />



<button type='submit' disabled={btnLoading} className='common-btn'>{btnLoading?"Please wait":"Register"}</button>
            </form>

            <p>
                 have an account?<Link to={"/login"}>Login</Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default Register
