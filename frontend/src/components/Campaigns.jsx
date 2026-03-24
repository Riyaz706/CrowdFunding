import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';


function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user-api/campaigns');
        // Ensure payload exists or default to empty array
        setCampaigns(response.data.payload || []);
        setError(null); // Clear any previous errors
      } catch (err) {
        // If the backend returns 404 for "no campaigns", don't show the error alert
        if (err.response?.status === 404) {
          setCampaigns([]);
          setError(null);
        } else {
          console.error('Error fetching campaigns:', err);
          setError('Failed to load campaigns. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight">Active Campaigns</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Support the projects that resonate with you and join a global community of change-makers.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-10">
            <ErrorAlert message={error} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {!error && campaigns.length > 0 && campaigns.map((campaign) => {
            const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
            return (
              <NavLink
                to={`/campaign/${campaign._id}`}
                key={campaign._id}
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/50 shadow-md hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 hover:-translate-y-3"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                   <img 
                    src={campaign.imageUrl || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?q=80&w=2070&auto=format&fit=crop"} 
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.background='linear-gradient(135deg, #1e293b 0%, #334155 100%)'; }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-950/60 to-transparent" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                    {campaign.deadline && (
                      <>
                        <div className={`px-3 py-1.5 backdrop-blur-md border text-white text-[10px] font-black uppercase tracking-widest rounded-full ${
                          new Date(campaign.deadline) < new Date()
                            ? 'bg-red-500/20 border-red-500/30'
                            : 'bg-white/10 border-white/20'
                        }`}>
                          {new Date(campaign.deadline) < new Date() ? 'Closed' : 'Active'}
                        </div>
                        <div className="px-3 py-1.5 bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold rounded-full flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(campaign.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Goal Badge */}
                  <div className="absolute bottom-6 left-6">
                     <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Goal</p>
                     <p className="text-xl font-black text-white">₹{campaign.goalAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {campaign.title}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-black text-blue-600 border border-blue-100">
                        {campaign.creator?.firstName?.[0] || 'C'}
                      </div>
                      <p className="text-xs font-bold text-gray-400 capitalize">
                        By <span className="text-gray-900">{campaign.creator?.firstName} {campaign.creator?.lastName || ''}</span>
                      </p>
                    </div>

                    <p className="text-gray-500 font-medium line-clamp-2 text-sm leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Raised</p>
                             <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-gray-900">₹{campaign.raisedAmount.toLocaleString()}</span>
                             </div>
                          </div>
                          <p className="text-sm font-black text-blue-600">
                             {Math.round(progress)}%
                          </p>
                       </div>
                       
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-blue-600 transition-all duration-1000 ease-out absolute left-0 top-0 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                       </div>
                    </div>

                    <button className="w-full py-4 bg-gray-50 group-hover:bg-blue-600 rounded-2xl border border-gray-100 group-hover:border-blue-500 flex items-center justify-center gap-3 transition-all duration-500">
                       <span className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-white transition-colors">Support Now</span>
                       <svg className="w-5 h-5 text-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>

        {campaigns.length === 0 && !loading && (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-2xl font-black text-gray-900">No campaigns found</h3>
            <p className="text-gray-500 font-medium">Be the first to start a movement!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Campaigns;