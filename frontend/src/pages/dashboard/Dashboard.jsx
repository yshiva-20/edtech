import React, { useEffect } from 'react';
import { useCourseData } from '../../context/CourseContext';
import CourseCard from '../../components/coursecard/CourseCard';
import './Dashboard.css';

const Dashboard = () => {
  const { myCourse } = useCourseData();

  return (
    <div className="student-dashboard">
      <h2>All Enrolled Courses</h2>
      <div className="dashboard-content">
        {myCourse && myCourse.length > 0 ? (
          myCourse.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p>No course enrolled yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;