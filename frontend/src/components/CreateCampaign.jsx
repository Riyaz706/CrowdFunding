import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';

// ─────────────────────────────────────────────────────────
// 🔧 CLOUDINARY CONFIG
// 1. Sign up free at https://cloudinary.com
// 2. Replace YOUR_CLOUD_NAME with your Cloud Name from the dashboard
// 3. Go to Settings → Upload → Upload Presets → Add Preset
//    Set "Signing Mode" to Unsigned, save it, then replace YOUR_UPLOAD_PRESET
// ─────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = 'da9ec4aox';
const CLOUDINARY_UPLOAD_PRESET = 'CrowdFunding';

function CreateCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle file selection (via click or drag-and-drop)
  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB.');
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Upload to Cloudinary and return the secure URL
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(pct);
        },
      }
    );
    return res.data.secure_url;
  };

  const onCreateCampaign = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      let imageUrl = '';

      // Upload image first if one was selected
      if (imageFile) {
        if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME') {
          setError('Please configure your Cloudinary Cloud Name and Upload Preset in CreateCampaign.jsx before uploading images.');
          setLoading(false);
          return;
        }
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const response = await axios.post(
        'http://localhost:3000/user-api/create-campaign',
        { ...data, imageUrl },
        { withCredentials: true }
      );

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
              <p className="text-gray-800 font-medium text-lg">Fill in the details below to launch your campaign for approval.</p>
            </div>

            {success ? (
              <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-white text-center space-y-4">
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
                    />
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

                  {/* ═══ IMAGE UPLOAD SECTION ═══ */}
                  <div className="space-y-3">
                    <label className="block text-sm font-black text-gray-900 ml-1 uppercase tracking-wider">
                      Campaign Image <span className="text-gray-400 font-medium normal-case tracking-normal">(optional)</span>
                    </label>

                    {imagePreview ? (
                      /* Preview State */
                      <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-lg group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-56 object-cover"
                        />
                        {/* Dark overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        {/* Filename bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
                          <span className="text-white text-xs font-bold truncate">{imageFile?.name}</span>
                          <span className="text-green-400 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Ready
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Drop Zone State */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`relative w-full h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
                          isDragging
                            ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                            : 'border-white/60 bg-white/40 hover:bg-white/60 hover:border-white'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-sm">
                          <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="font-black text-gray-800 text-sm">
                            {isDragging ? 'Drop it here!' : 'Click to upload or drag & drop'}
                          </p>
                          <p className="text-xs text-gray-500 font-medium mt-1">JPG, PNG, WEBP — Max 10MB</p>
                        </div>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />

                    {/* Upload progress bar — shown while uploading */}
                    {loading && imageFile && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-gray-700 uppercase tracking-wider">Uploading image...</p>
                          <p className="text-xs font-black text-blue-600">{uploadProgress}%</p>
                        </div>
                        <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
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
                      {imageFile && uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Submitting...'}
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
