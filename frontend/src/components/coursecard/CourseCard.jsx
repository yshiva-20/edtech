import React from "react";
import "./coursecard.css";
import { server } from "../../main";
import { useUserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useCourseData } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = useUserData();
  const { fetchCourses } = useCourseData();

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="course-card">
      <img src={`${server}/${course.image}`} alt="" className="course-image" />
      <h3>{course.title}</h3>
      <p>Instructor - {course.createdBy}</p>
      <p>Duration - {course.duration} weeks</p>
      <p>Price - ₹{course.price}</p>

      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              {user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="common-btn"
                >
                  Get Started
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {/* 🔹 Show these only for admins */}
      {user && user.role === "admin" && (
        <>
          <button
            onClick={() => deleteHandler(course._id)}
            className="common-btn"
            style={{ background: "red", marginRight: "10px" }}
          >
            Delete
          </button>

          <button
            onClick={() => navigate(`/admin/course/${course._id}/lectures`)}
            className="common-btn"
            style={{ background: "blue" }}
          >
            Manage Lectures
          </button>
        </>
      )}
    </div>
  );
};

export default CourseCard;