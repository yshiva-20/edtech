
import "./courses.css"

import React, { useEffect } from 'react';
import { useCourseData } from '../../context/CourseContext.jsx';
import CourseCard from "../../components/coursecard/CourseCard.jsx";
import './courses.css';

const Courses = () => {

  const { courses } = useCourseData();



  return (
    <div className='courses'>
      <h2>Available Courses</h2>
      {courses.length > 0 ? (
        <div className='courses-container'>
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} /> //yo yo is ki working
          ))}
        </div>
      ) : (
        <p>No courses available yet.</p>
      )}
    </div>
  );
};

export default Courses;