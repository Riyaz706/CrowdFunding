import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { authStore } from '../store/authStore';

import { NavLink } from 'react-router';
import ErrorAlert from './ErrorAlert';


function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = authStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onUserLogin = async (data) => {
    // Add default role if not provided or handle it based on your app logic
    const loginData = { ...data, role: 'USER' }; 
    await login(loginData);
    
    // The store handles the success/error states, but we check here to navigate
    const currentState = authStore.getState();
    if (currentState.isAuthenticated) {
      // toast.success('Welcome back!');
      navigate('/home');
    } else if (currentState.error) {
      // toast.error(currentState.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 space-y-8 border border-gray-100">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Login</h2>
          <p className="text-gray-500">Welcome back to the community</p>
        </div>

        <form onSubmit={handleSubmit(onUserLogin)} className="space-y-6">

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
                required: 'Password is required'
              })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all text-gray-900 font-medium"
            />
            {errors.password && <p className="text-red-500 text-xs font-bold ml-1">{errors.password.message}</p>}
          </div>
          <ErrorAlert message={error} />

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-500 font-medium">Remember me</label>
            </div>
            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all duration-300 active:scale-[0.98] ${
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
                Logging in...
              </span>
            ) : 'Login'}
          </button>
          
          <p className="text-center text-gray-500 font-medium pt-2">
            Don't have an account? {' '}
            <NavLink to="/register" className="text-blue-600 font-bold hover:underline">Register</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;