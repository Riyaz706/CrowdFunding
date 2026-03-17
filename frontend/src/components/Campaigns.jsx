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
        setCampaigns(response.data.payload);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');
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
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight">Active Campaigns</h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Support the projects that resonate with you and join a global community of change-makers.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <ErrorAlert message={error} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {campaigns.map((campaign) => {
            const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
            return (
              <NavLink 
                to={`/campaign/${campaign._id}`} 
                key={campaign._id}
                className="group bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Content Card */}
                <div className="p-8 flex-1 flex flex-col space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                       <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
                         {campaign.title}
                       </h3>
                       {campaign.deadline && (
                         <div className="ml-4 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 whitespace-nowrap">
                           Deadline
                         </div>
                       )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {campaign.creator?.firstName?.[0] || 'C'}
                       </div>
                       <p className="text-xs font-bold text-gray-400">By {campaign.creator?.firstName || 'Movement Creator'}</p>
                    </div>

                    <p className="text-gray-500 font-medium line-clamp-3 text-sm leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="bg-amber-100 p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-amber-900/50 uppercase tracking-widest">Raised</p>
                        <p className="text-2xl font-black text-amber-900">₹{campaign.raisedAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs font-black text-amber-900/50 uppercase tracking-widest">Goal</p>
                        <p className="text-sm font-bold text-amber-800/80">₹{campaign.goalAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs font-black text-blue-600 text-right uppercase tracking-wider">
                      {Math.round(progress)}% Funded
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-blue-600 transition-colors">
                  <span className="text-gray-900 font-bold group-hover:text-white transition-colors">View Details</span>
                  <svg className="w-5 h-5 text-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
