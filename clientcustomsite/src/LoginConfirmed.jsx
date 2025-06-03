import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginConfirmed = () => {
  const [message, setMessage] = useState('Logging you in...');
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tokenFromHash = hashParams.get('access_token');
    const tokenFromStorage = localStorage.getItem('accessToken');

    const accessToken = tokenFromHash || tokenFromStorage;

    if (!accessToken) {
      setMessage('Access token not found. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const confirmLogin = async () => {
      try {
        // Get appointments from localStorage
        const storedAppointments = localStorage.getItem('appointments');
        const appointments = storedAppointments ? JSON.parse(storedAppointments) : [];

        const res = await fetch('http://localhost:8080/api/website/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken, appointments }),
        });

        const data = await res.json();
        console.log(data)

        if (res.ok) {
          if (tokenFromHash) {
            localStorage.setItem('accessToken', accessToken); // store only if from URL
          }
          setMessage('Login successful! Redirecting...');
         setTimeout(() => navigate('/Payments', { state: { billId: data.billId } }), 1500);

        } else {
      
       localStorage.removeItem('accessToken');
          setMessage(data.message || 'Login failed. Redirecting to login...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('accessToken');
        setMessage('An error occurred. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    confirmLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
      </div>
    </div>
  );
};

export default LoginConfirmed;
