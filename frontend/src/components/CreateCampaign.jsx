import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';


function CreateCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onCreateCampaign = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:3000/user-api/create-campaign', data, {
        withCredentials: true
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (err) {
      console.error('Campaign Creation Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create campaign';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-amber-300 rounded-[2.5rem] p-8 lg:p-16 shadow-2xl shadow-amber-100/50 border border-amber-400/20">
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm text-amber-900 font-bold text-xs uppercase tracking-widest">
                Start a Movement
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none">
                Bring your <span className="text-blue-600">vision</span> to life
              </h1>
              <p className="text-gray-800 font-medium text-lg"> Fill in the details below to launch your campaign for approval.</p>
            </div>

            {success ? (
              <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white text-center space-y-4 animate-bounce-short">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Campaign Submitted!</h2>
                <p className="text-gray-600 font-medium">Your campaign is now waiting for admin approval.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onCreateCampaign)} className="space-y-8">
                <ErrorAlert message={error} />


                <div className="grid grid-cols-1 gap-8">
                  {/* Campaign Title */}
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-gray-900 ml-1 uppercase tracking-wider">Campaign Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Solar Power for Rural Villages"
                      {...register('title', { 
                        required: 'Campaign title is required',
                        minLength: { value: 5, message: 'Title must be at least 5 characters' }
                      })}
                      className="w-full px-6 py-5 bg-white/80 border border-white rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 font-bold text-lg placeholder:text-gray-400 placeholder:font-medium"
                    />
                    {errors.title && <p className="text-red-600 text-xs font-black ml-2 uppercase italic">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-gray-900 ml-1 uppercase tracking-wider">Description</label>
                    <textarea
                      rows="5"
                      placeholder="Tell your story. Why does this project matter?"
                      {...register('description', { required: 'Please provide a description' })}
                      className="w-full px-6 py-5 bg-white/80 border border-white rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 font-bold text-lg placeholder:text-gray-400 placeholder:font-medium resize-none"
                    ></textarea>
                    {errors.description && <p className="text-red-600 text-xs font-black ml-2 uppercase italic">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Goal Amount */}
                    <div className="space-y-3">
                      <label className="block text-sm font-black text-gray-900 ml-1 uppercase tracking-wider">Goal Amount (₹)</label>
                      <div className="relative group">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xl">₹</span>
                          <input
                            type="number"
                            placeholder="5000"
                            {...register('goalAmount', { 
                                required: 'Goal amount is required',
                                min: { value: 10, message: 'Minimum goal is ₹10' }
                            })}
                            className="w-full pl-12 pr-6 py-5 bg-white/80 border border-white rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 font-black text-xl"
                          />
                      </div>
                      {errors.goalAmount && <p className="text-red-600 text-xs font-black ml-2 uppercase italic">{errors.goalAmount.message}</p>}
                    </div>

                    {/* Deadline */}
                    <div className="space-y-3">
                      <label className="block text-sm font-black text-gray-900 ml-1 uppercase tracking-wider">Deadline</label>
                      <input
                        type="date"
                        {...register('deadline', { required: 'Deadline is required' })}
                        className="w-full px-6 py-5 bg-white/80 border border-white rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 font-bold text-lg"
                      />
                      {errors.deadline && <p className="text-red-600 text-xs font-black ml-2 uppercase italic">{errors.deadline.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 rounded-4xl font-black text-xl text-white shadow-2xl transition-all duration-500 active:scale-[0.98] mt-4 flex items-center justify-center gap-3 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-900 hover:bg-black hover:shadow-black/20 hover:-translate-y-1.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span>Submit for Review</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;
