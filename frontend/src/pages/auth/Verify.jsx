import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserData } from '../../context/UserContext';

const Verify = () => {
  const[otp,setOtp]=useState("");
const{btnloading,verifyOtp}=useUserData();
const navigate=useNavigate()



const submitHandler=async(e)=>{
e.preventDefault();
await verifyOtp(Number(otp),navigate);
}

  return (
    <div>
      <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Account</h2>
            <form onSubmit={submitHandler} >
                <label htmlFor="otp">OTP</label>
                <input type="number" value={otp} onChange={(e)=>setOtp(e.target.value)} required/>
                <button disabled={btnloading} type='submit' className='btn'>Verify</button>

                
            </form>
            <p>Go to <Link to={'/login'}>Login</Link> page</p>
        </div>
      </div>
    </div>
  )
}

export default Verify
