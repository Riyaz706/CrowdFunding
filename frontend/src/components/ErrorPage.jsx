import React from 'react';
import { useRouteError, NavLink } from 'react-router';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full text-center space-y-10">
        <div className="relative">
          <div className="text-[12rem] font-black text-gray-200 leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 bg-amber-300 rounded-4xl flex items-center justify-center shadow-2xl shadow-amber-200 animate-bounce-short">
                <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Oops! Page not found.</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            The page you're looking for was moved, removed, or never existed. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <NavLink
            to="/"
            className="px-10 py-5 bg-gray-900 text-white font-black text-lg rounded-2xl hover:bg-black transition-all hover:-translate-y-1 shadow-2xl shadow-gray-200 ring-4 ring-transparent hover:ring-gray-100"
          >
            Back to Home
          </NavLink>
          <NavLink
            to="/campaigns"
            className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 font-black text-lg rounded-2xl hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl"
          >
            Explore Projects
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
