import { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import toast,{Toaster} from "react-hot-toast";
import {server} from "../main";


const UserContext = createContext();
//wrapping in children because we are going to use it in our main function
export const UserContextProvider = ({ children }) => {
  
  const[user,setUser]=useState([]);
  
  const[isAuth,setIsAuth]=useState(false);
  
  const[btnloading,setBtnloading]=useState(false);

  const[loading,setLoading]=useState(true);
  
  
  
  
async function loginUser(email,password,navigate,fetchMyCourses) {

console.log("Sending:", email, password);

    setBtnloading(true)
    try 
    {
      const {data}=await axios.post(`${server}/api/user/login`,{email,password});
      
toast.success(data.message);

localStorage.setItem("token",data.token);

setUser(data.user)
setIsAuth(true)
setBtnloading(false)
navigate("/")
fetchMyCourses()
    } 
    
    
    catch (error) {
      console.log(error);
      setIsAuth(false);
      toast.error(error.response.data.message);
    }
    
  };

  

  async function registerUser(name,email,password,navigate) {



    setBtnloading(true)
    try 
    {
      const {data}=await axios.post(`${server}/api/user/register`,{name,email,password});
      
toast.success(data.message);

localStorage.setItem("activationToken",data.activationToken);


setBtnloading(false)
navigate("/verify")
    
    } 
    
    
    catch (error) {
      console.log(error);
     setBtnloading(false)

      toast.error(error.response.data.message);
    }
    
  };

async function verifyOtp(otp,navigate){
   setBtnloading(true);
   const activationToken=localStorage.getItem("activationToken");


  try {      
    const {data}=await axios.post(`${server}/api/user/verify`, { otp,activationToken,});
toast.success(data.message);
navigate("/login");
localStorage.clear();
setBtnloading(false);

    
  } catch (error) {console.log(error);
     setBtnloading(false)

      toast.error(error.response.data.message);
    
  }
  
}

  
  async function fetchuser() 
  {
    try{
  const {data}=await axios.get(`${server}/api/user/me`, {
  headers: {
    token: localStorage.getItem("token"),
  },
});
    
   
   setIsAuth(true);
    setUser(data.user);
    setLoading(false);

  }
catch(error){
  console.log(error);
  setLoading(false);
}
}

  useEffect(()=>{
    fetchuser()
  },[])

  return (
    <UserContext.Provider value={{ user, setUser,setIsAuth,isAuth,loginUser,btnloading,loading,registerUser,verifyOtp,fetchuser }}>
      {children}
      <Toaster/>
    </UserContext.Provider>
  );
};
export const useUserData = () => useContext(UserContext);



