import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Layout from '../Utils/Layout';
import { useCourseData } from '../../context/CourseContext';
import "./dashboard.css"


const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
  totalCourses: 0,
  totalLectures: 0,
  totalUsers: 0
});
    const navigate = useNavigate();
    const { server } = useCourseData();

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${server}/api/stats`, {
                headers: {
                    token: localStorage.getItem('token'),
                },
            });
            
            setStats(data.stats);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
        fetchStats();

    }, [user, navigate]);

    return (
        <Layout>
            <div className="main-content">
                <div className="box">
                    <p>Total Courses</p>
                  <p>{stats?.totalCourses ?? 0}</p>
                </div>
               
                <div className="box">
                    <p>Total Lectures</p>
                 <p>{stats?.totalLectures ?? 0}</p>
                </div>
                
                <div className="box">
                    <p>Total Users</p>
                    <p>{stats?.totalUsers ?? 0}</p>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;