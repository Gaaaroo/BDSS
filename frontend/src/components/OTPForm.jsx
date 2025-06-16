import React, { useRef, useState } from 'react';
import { resendOTP, verifyOTP } from '../services/api/authService';
import { useNavigate } from 'react-router';

export default function OTPForm({ onSubmit }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputsRef = Array.from({ length: 6 }, () => useRef());
  const handleChange = (idx, e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    if (value && idx < 5) {
      inputsRef[idx + 1].current.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef[idx - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('Text').replace(/[^0-9]/g, '');
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputsRef[5].current.focus();
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (onSubmit) onSubmit(code);
  };

  const renderInputs = () =>
    otp.map((digit, idx) => (
      <React.Fragment key={idx}>
        <input
          ref={inputsRef[idx]}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="w-16 h-21 text-center text-3xl border-2 border-red-200 focus:border-red-500 rounded-lg shadow-lg transition-all outline-none bg-gradient-to-b from-white to-red-50 font-bold tracking-widest focus:ring-2 focus:ring-red-200"
          value={digit}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          autoFocus={idx === 0}
        />
        {(idx === 1 || idx === 3) && (
          <span className="mx-2 text-red-300 text-3xl font-extrabold select-none opacity-80">
            &ndash;
          </span>
        )}
      </React.Fragment>
    ));

  const handleVerify = async () => {
    const email = localStorage.getItem('otpEmail');
    const otpString = otp.join('');
    console.log('lấy được email rồi nè: ', email);
    console.log('Mã otp nè: ', otpString);
    if (!email) {
      setError('Email Not Found!!');
      return;
    }
    try {
      const res = await verifyOTP({ email, otp: otpString });
      if (res) {
        console.log('Verify successful');
        setError('');
        navigate('/login');
      } else {
        setError('Verify fail');
      }
    } catch (err) {
      console.log('lỗi nè', err);
      if (err.code) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleResentOTP = async () => {
    const email = localStorage.getItem('otpEmail');
    const otpString = otp.join('');
    if (!email) {
      setError('Email Not Found!!');
      return;
    }
    try {
      const res = await resendOTP({ email, otp: otpString });
      if (res) {
        console.log('Resend OTP successful');
        setError('');
        setOtp(['', '', '', '', '', '']);
      } else {
        setError('Failed to resend OTP: ', res.message);
      }
    } catch (err) {
      console.log('lỗi nè', err);
      if (err.code) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-10 space-y-8 border border-red-300 h-[600px]"
      >
        <div className="flex justify-center mb-6">
          <img
            src="https://www.theedigital.com/wp-content/uploads/2022/01/Sync-With-Your-Email-Marketing-Tools-768x509.png"
            alt="OTP Illustration"
            className="w-52 object-contain"
          />
        </div>
        <h2 className="text-4xl font-extrabold text-center text-red-500 mb-2 tracking-tight">
          OTP Verification
        </h2>
        <p className="text-center text-gray-500 mb-6 text-base">
          Enter the 6-digit code sent to your email
        </p>
        <div
          className="flex items-center justify-center gap-3"
          onPaste={handlePaste}
        >
          {renderInputs()}
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-100 rounded py-2 px-4">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-md font-semibold text-lg hover:from-red-400 hover:to-red-700 transition disabled:opacity-50"
          disabled={otp.some((v) => v === '')}
          onClick={handleVerify}
        >
          Confirm OTP
        </button>
        <div className="text-center">
          <span className="text-gray-500">Didn't receive the code?</span>
          <button
            type="button"
            className="ml-2 text-red-500 font-semibold hover:underline"
            onClick={handleResentOTP}
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
}
