import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axios from 'axios';
import BASE_URL from '../config/api';

import { NavLink } from 'react-router';
import ErrorAlert from './ErrorAlert';


function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'USER',
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onUserRegister = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const url = `${BASE_URL}/common-api/register`;
      const res = await axios.post(url, data);

      if (res.status === 201 || res.status === 200) {
        // toast.success(res.data.message || 'Registration successful!');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed.';
      setError(errorMessage);
      // toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-5 lg:p-14 space-y-10 border border-gray-100">
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider">
            Join the Mission
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 font-medium text-lg">Start your journey with us today</p>
        </div>

        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">First Name</label>
              <input
                type="text"
                placeholder="Jane"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-gray-900 font-medium"
              />
              {errors.firstName && <p className="text-red-500 text-xs font-bold ml-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-gray-900 font-medium"
              />
              {errors.lastName && <p className="text-red-500 text-xs font-bold ml-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-gray-900 font-medium"
            />
            {errors.email && <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-gray-900 font-medium"
            />
            {errors.password && <p className="text-red-500 text-xs font-bold ml-1">{errors.password.message}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all duration-300 active:scale-[0.98] ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 hover:bg-gray-800 hover:shadow-gray-900/20 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>
          
          <ErrorAlert message={error} />

          <p className="text-center text-gray-500 font-medium pt-2">
            Already have an account? {' '}
            <NavLink to="/login" className="text-blue-600 font-bold hover:underline">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;