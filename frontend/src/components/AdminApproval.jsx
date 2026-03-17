import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';

function AdminApproval() {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin-api/pending-campaigns', {
        withCredentials: true
      });
      setPendingCampaigns(response.data.payload);
    } catch (err) {
      console.error('Error fetching pending campaigns:', err);
      setError('Failed to load pending campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:3000/admin-api/campaign/${id}`, 
        { status: true },
        { withCredentials: true }
      );
      // Remove approved campaign from list
      setPendingCampaigns(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Error approving campaign:', err);
      alert('Failed to approve campaign.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Admin Moderation</h1>
                <p className="text-gray-500 font-medium">Review and approve campaigns before they go public.</p>
            </div>
            <div className="bg-amber-100 px-6 py-3 rounded-2xl border border-amber-200">
                <span className="text-sm font-black text-amber-900 uppercase tracking-widest">
                    {pendingCampaigns.length} Pending Requests
                </span>
            </div>
        </div>

        <ErrorAlert message={error} />

        {pendingCampaigns.length === 0 ? (
            <div className="bg-white rounded-4xl p-20 text-center border border-dashed border-gray-200 space-y-4">
                <div className="text-6xl text-gray-200">✨</div>
                <h2 className="text-2xl font-black text-gray-900">All caught up!</h2>
                <p className="text-gray-500 font-medium">There are no campaigns waiting for approval right now.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
                {pendingCampaigns.map((campaign) => (
                    <div key={campaign._id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="space-y-4 flex-1">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-gray-900">{campaign.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                                    <span>By {campaign.creator?.firstName || 'Unknown'}</span>
                                    <span>•</span>
                                    <span>Raised: ₹{(campaign.raisedAmount || 0).toLocaleString()}</span>
                                    <span>•</span>
                                    <span>Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                {campaign.description}
                            </p>
                        </div>
                        
                        <div className="flex gap-4 w-full lg:w-auto">
                            <button 
                                onClick={() => handleApprove(campaign._id)}
                                disabled={actionLoading === campaign._id}
                                className={`flex-1 lg:flex-none px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 ${actionLoading === campaign._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {actionLoading === campaign._id ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Approve
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default AdminApproval;