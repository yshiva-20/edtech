import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseData } from '../../context/CourseContext';
import { useUserData } from '../../context/UserContext';
import './coursedescription.css';
import { server } from '../../main';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loading from '../../components/loading/Loading';

const CourseDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchuser } = useUserData();
  const { course, loading: contextLoading } = useCourseData();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // 🔹 Load Razorpay script safely
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const { data } = await axios.get(`${server}/api/course/${id}`);
        setCourseData(data.course);
      } catch (error) {
        toast.error('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const checkoutHandler = async () => {
    if (!courseData) return;

    if (!razorpayReady || !window.Razorpay) {
      toast.error("Payment SDK not loaded. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to purchase');
        navigate('/login');
        return;
      }

      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        { headers: { token } }
      );

      const options = {
        key: "rzp_test_R9ZiyxMfqQFVgo",
        amount: order.amount,
        currency: "INR",
        name: "EdTECH",
        description: "LEARN WITH US",
        order_id: order.id,
        handler: async (response) => {
          try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
            const { data } = await axios.post(
              `${server}/api/course/payment/verification/${id}`,
              { razorpay_order_id, razorpay_payment_id, razorpay_signature },
              { headers: { token } }
            );
            await fetchuser();
            toast.success(data.message);
            navigate(`/payment/success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: courseData.instructor || "",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        theme: {
          color: '#8a4bff'
        },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!loading && !courseData) {
    return (
      <div className='course-description-page'>
        <div className='course-description-container'>
          <h2>Course not found</h2>
          <button className='common-btn' onClick={() => navigate('/courses')}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled =
    user && user.subscription &&
    Array.isArray(user.subscription) &&
    user.subscription.includes(courseData?._id);

  return (
    <div className='course-description-page'>
      <div className='course-description-container'>
        <div className='course-header'>
          <img
            className='course-image'
            src={`${server}/${courseData.image}`}
            alt={courseData.title || 'Course image'}
            onError={(e) => { e.target.src = '/default-course-image.png'; }}
          />
          <div className='course-info'>
            <h2>{courseData.title}</h2>
            <p>Instructor: {courseData.createdBy || 'Unknown'}</p>
            <p>Duration: {courseData.duration || 'N/A'} weeks</p>
          </div>
        </div>
        
        <div className='course-description'>
          <p>{courseData.description}</p>
        </div>

        <p className='course-details-text'>
          Let's get started with this course at ₹{courseData.price}.
        </p>

        <div className='course-actions'>
          {user ? (
            isEnrolled ? (
              <button
                className='common-btn'
                onClick={() => navigate(`/course/study/${courseData._id}`)}
              >
                Study
              </button>
            ) : (
              <button 
                className='common-btn' 
                onClick={checkoutHandler} 
                disabled={loading || !razorpayReady}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
            )
          ) : (
            <button className='common-btn' onClick={() => navigate('/login')}>
              Login to Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;