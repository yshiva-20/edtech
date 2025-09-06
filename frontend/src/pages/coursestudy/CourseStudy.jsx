import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourseData } from '../../context/CourseContext';
import './CourseStudy.css';
import { server } from '../../main';

const CourseStudy = ({ user }) => {
  const { id } = useParams();
  const { fetchCourse, course } = useCourseData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse(id);
  }, [fetchCourse, id]);

  // ✅ Allow access if:
  // 1. User is admin
  // 2. OR user is subscribed to this course
  const isEnrolled =
    user &&
    user.subscription &&
    Array.isArray(user.subscription) &&
    user.subscription.includes(id);

  const hasAccess = user && (user.role === 'admin' || isEnrolled);

  // ✅ Redirect using effect instead of return
  useEffect(() => {
    if (!hasAccess) {
      navigate('/');
    }
  }, [hasAccess, navigate]);

  if (!hasAccess) {
    return null; // show nothing while redirecting
  }

  return (
    <div className="course-study-page">
      {course ? (
        <>
          <img src={`${server}/${course.image}`} alt={course.title} width="350" />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>Created By: {course.createdBy}</h5>
          <h5>Duration: {course.duration} weeks</h5>
          <Link to={`/lectures/${course._id}`} className="lecture-button">
            <h2>Lectures</h2>
          </Link>
        </>
      ) : (
        <p>Loading course details...</p>
      )}
    </div>
  );
};

export default CourseStudy;