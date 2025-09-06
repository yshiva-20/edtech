import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./home.css"
import Testimonials from '../../components/testimonial/Testimonials'





const Home = () => {
  const navigate=useNavigate()
  return (
    
   
   <div>
      <div className="home">
        <div className="home-content">
          <h1>Welcome to our E-learning Platform</h1>
          <p>Learn, Grow, Excel</p>
          <button className='common-btn' onClick={()=> navigate("/courses")}>Get started</button>
        </div>
      </div>

<Testimonials/>

    </div>
  )
}

export default Home
