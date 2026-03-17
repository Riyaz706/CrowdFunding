import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router';
import ErrorAlert from './ErrorAlert';
import ProgressBar from './ProgressBar';

function DonorTracking() {
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' or 'donations'
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCampaign, setExpandedCampaign] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchData = async (tab) => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = tab === 'campaigns' ? 'my-campaigns' : 'my-donations';
      const response = await axios.get(`http://localhost:3000/user-api/${endpoint}`, {
        withCredentials: true
      });
      setData(response.data.payload);
      setSummary(response.data.summary);
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
      setError(`Failed to load your ${tab}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentIntent = query.get('payment_intent');
    const redirectStatus = query.get('redirect_status');

    const verifyAndFetch = async () => {
      if (paymentIntent && redirectStatus === 'succeeded') {
        try {
          // Avoid re-verifying if we've already done it in this session
          const processed = sessionStorage.getItem(`processed_${paymentIntent}`);
          if (!processed) {
            setActiveTab('donations');
            await axios.get(`http://localhost:3000/user-api/verify-payment/${paymentIntent}`, {
               withCredentials: true
            });
            console.log("✅ Payment verified successfully");
            setShowSuccessToast(true);
            sessionStorage.setItem(`processed_${paymentIntent}`, 'true');
            // Clean URL to prevent re-triggering on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error("❌ Verification fallback failed:", err);
        }
      }
      fetchData(activeTab);
    };

    verifyAndFetch();
  }, [activeTab]);

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
        activeTab === id 
          ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 -translate-y-1' 
          : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest">
                    Your Activity
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight">Track Your Impact</h1>
                <p className="text-xl text-gray-500 font-medium max-w-xl">
                    Monitor your contributions and see how the movements you started are growing.
                </p>
            </div>
            
            <div className="flex bg-white p-2 rounded-4xl shadow-sm border border-gray-100">
                <TabButton id="campaigns" label="My Campaigns" icon="🚀" />
                <TabButton id="donations" label="My Donations" icon="💝" />
            </div>
        </div>

        {showSuccessToast && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-100 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-green-100">
                        ✓
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900">Payment Successful!</h3>
                        <p className="text-gray-500 text-sm font-medium">Thank you for your generous contribution to this movement.</p>
                    </div>
                </div>
                <button onClick={() => setShowSuccessToast(false)} className="text-gray-400 hover:text-gray-600 font-bold px-4 py-2">Dismiss</button>
            </div>
        )}

        {/* Stats Overview */}
        {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {activeTab === 'campaigns' ? (
                    <>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Funds Raised</p>
                            <p className="text-4xl font-black text-gray-900">₹{(summary.totalRaised || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Donors</p>
                            <p className="text-4xl font-black text-blue-600">{summary.totalDonationsReceived || 0}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Live Campaigns</p>
                            <p className="text-4xl font-black text-purple-600">{summary.totalCampaigns || 0}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Amount Contributed</p>
                            <p className="text-4xl font-black text-gray-900">₹{(summary.totalDonated || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Movements Supported</p>
                            <p className="text-4xl font-black text-pink-600">{summary.totalDonationsMade || 0}</p>
                        </div>
                    </>
                )}
            </div>
        )}

        <ErrorAlert message={error} />

        {loading ? (
             <div className="min-h-[40vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
             </div>
        ) : data.length === 0 ? (
            <div className="bg-white rounded-4xl p-20 text-center border border-dashed border-gray-200 space-y-6">
                <div className="text-6xl opacity-20">🍃</div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900">No {activeTab} yet</h2>
                    <p className="text-gray-500 font-medium">Ready to start something amazing?</p>
                </div>
                <NavLink 
                    to={activeTab === 'campaigns' ? "/create-campaign" : "/campaigns"}
                    className="inline-block px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                    {activeTab === 'campaigns' ? "Start a Campaign" : "Explore Projects"}
                </NavLink>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
                {activeTab === 'campaigns' ? (
                    data.map((campaign) => {
                        const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
                        return (
                            <div key={campaign._id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                                <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-gray-900">{campaign.title}</h3>
                                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
                                                Created on {new Date(campaign.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Raised</p>
                                                <p className="text-xl font-black text-gray-900">₹{(campaign.raisedAmount || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Goal</p>
                                                <p className="text-xl font-black text-gray-900">₹{(campaign.goalAmount || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Donors</p>
                                                <p className="text-xl font-black text-blue-600">{campaign.donations?.length || 0}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <ProgressBar 
                                                progress={progress} 
                                                color="bg-blue-600"
                                            />
                                            <p className="text-xs font-black text-blue-600 text-right uppercase tracking-wider">
                                                {Math.round(progress)}% Funded
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 w-full lg:w-auto">
                                        <button 
                                            onClick={() => setExpandedCampaign(expandedCampaign === campaign._id ? null : campaign._id)}
                                            className={`flex-1 lg:flex-none px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                                                expandedCampaign === campaign._id 
                                                ? 'border-blue-600 bg-blue-50 text-blue-600' 
                                                : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                        >
                                            {expandedCampaign === campaign._id ? 'Hide Donors' : 'View Donors'}
                                        </button>
                                        <NavLink 
                                            to={`/campaign/${campaign._id}`}
                                            className="flex-1 lg:flex-none px-8 py-3 border-2 border-gray-900 text-gray-900 font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all text-center text-xs uppercase tracking-widest"
                                        >
                                            View Page
                                        </NavLink>
                                        <span className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 flex items-center justify-center ${
                                            campaign.status 
                                            ? 'bg-green-50 text-green-600 border-green-100' 
                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {campaign.status ? 'Live' : 'Pending'}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Donors */}
                                {expandedCampaign === campaign._id && (
                                    <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Recent Contributions</h4>
                                        {campaign.donations && campaign.donations.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {campaign.donations.map((donation, idx) => (
                                                    <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-gray-900">{donation.donor?.firstName || 'Anonymous'}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                                {new Date(donation.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-blue-600">₹{donation.amount?.toLocaleString()}</p>
                                                            <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter">SUCCESS</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 font-medium py-4 italic">No donations received yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <div className="bg-white rounded-4xl overflow-hidden border border-gray-100 divide-y divide-gray-50">
                        <div className="grid grid-cols-4 px-8 py-6 bg-gray-50/50 text-xs font-black uppercase tracking-widest text-gray-400">
                            <span>Movement</span>
                            <span>Date</span>
                            <span>Amount</span>
                            <span className="text-right">Status</span>
                        </div>
                        {data.map((donation) => (
                            <div key={donation._id} className="grid grid-cols-4 px-8 py-8 items-center hover:bg-gray-50/30 transition-colors">
                                <NavLink to={`/campaign/${donation.campaign?._id}`} className="font-black text-gray-900 hover:text-blue-600 transition-colors truncate pr-4">
                                    {donation.campaign?.title || 'Unknown Project'}
                                </NavLink>
                                <span className="text-gray-500 font-bold text-sm">
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-gray-900 font-black text-lg">
                                    ₹{(donation.amount || 0).toLocaleString()}
                                </span>
                                <div className="text-right">
                                    <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border ${
                                        donation.paymentStatus === 'success'
                                            ? 'bg-green-50 text-green-600 border-green-100'
                                            : 'bg-red-50 text-red-600 border-red-100'
                                    }`}>
                                        {donation.paymentStatus}
                                    </span>
                                </div>
                                {donation.description && (
                                    <div className="col-span-4 mt-4 px-6 py-4 bg-blue-50/50 rounded-2xl">
                                        <p className="text-sm font-medium text-blue-700 italic">
                                            "{donation.description}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

export default DonorTracking;