import React, { useContext } from 'react';
import './PaymentSuccess.css';
import { useParams, Link } from 'react-router-dom';
import { useUserData } from '../../context/UserContext';
import { server } from '../../main';

const PaymentSuccess = () => {
  const { user } = useUserData();
  const { id } = useParams();

  return (
    <div className='payment-success-page'>
      {user && (
        <div className='success-message-container'>
          <h2>Payment Successful</h2>
          <p>Your course subscription has been activated.</p>
          <p>Reference Number: {id}</p>
          <Link to={`/user/${user._id}/dashboard`} className='common-btn'>
            Go To Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;