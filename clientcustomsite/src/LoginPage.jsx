import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from 'jwt-decode';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const enrichedAppointments = location.state?.enriched || [];

  // Add expiresAt (30 minutes from now) to each appointment
  const appointments = enrichedAppointments.map((appt) => ({
    ...appt,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins later
  }));

  const [email, setEmail] = useState('');
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  // Redirect if accessToken already exists
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
   if (appointments.length > 0) {
    
  }
    if (token) {
      navigate('/loginConfirmed');
    }
  }, [navigate]);

useEffect(() => {
  if (appointments.length > 0) {
 
  }
}, [appointments]);
  useEffect(() => {
    if (emailCaptured) {
      const sendLoginData = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/website/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              appointments,
            }),
          });

          const result = await response.json();
          console.log('Server response:', result);

          if (response.ok) {
            setLinkSent(true);
         
          }
        } catch (error) {
          console.error('Error sending login data:', error);
        }
      };

      sendLoginData();
    }
  }, [emailCaptured, email, appointments]);

  const handleSuccess = (credentialResponse) => {
    try {
      const payload = jwt_decode.jwtDecode(credentialResponse.credential);
      setEmail(payload.email);
      setEmailCaptured(true);
      console.log('Google user payload:', payload);
    } catch (err) {
      console.error('JWT decode failed:', err);
    }
  };

  const handleError = () => {
    console.error('Google Sign In Failed');
  };

  const handleManualEmailInput = () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }
    setEmailCaptured(true);
    console.log('User manually entered email:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
          <p className="text-sm text-gray-500 mt-2">
            Please choose your Google account or enter email
          </p>
        </div>

        {linkSent && (
          <p className="text-center text-blue-600 border border-blue-300 bg-blue-50 rounded-md py-2 px-3">
            📧 Please check your email and click the magic link to proceed.
          </p>
        )}

        {emailCaptured && !linkSent && (
          <p className="text-center text-green-600 border border-green-300 bg-green-50 rounded-md py-2 px-3">
            ✅ Email captured: <strong>{email}</strong>. Sending login link...
          </p>
        )}

        {!emailCaptured && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Or enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>

            <div className="flex items-center gap-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-400 text-sm">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <button
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              onClick={handleManualEmailInput}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8.99l8 7 8-7V18H4z" />
              </svg>
              Confirm Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
