import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';
import { authStore } from '../store/authStore';


function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campaignRes, allRes] = await Promise.all([
          axios.get(`http://localhost:3000/user-api/campaign/${id}`),
          axios.get('http://localhost:3000/user-api/campaigns')
        ]);
        
        setCampaign(campaignRes.data.payload);
        // Exclude the current campaign from the "More Projects" list
        setAllCampaigns(allRes.data.payload.filter(c => c._id !== id).slice(0, 3));
      } catch (err) {
        console.error('Error fetching campaign details:', err);
        setError('Failed to load campaign details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
        <ErrorAlert message={error || 'Campaign not found'} />
        <NavLink to="/campaigns" className="text-blue-600 font-bold hover:underline">Back to Exploring</NavLink>
      </div>
    );
  }

  const isExpired = campaign.deadline && new Date(campaign.deadline) < new Date();
  const isActive = campaign.status === true && !isExpired;
  const isPending = campaign.status === false;

  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <div className="bg-amber-300 py-16 lg:py-24 px-6 border-b border-amber-400/20">
        <div className="container mx-auto max-w-5xl space-y-6">
          <NavLink to="/campaigns" className="inline-flex items-center gap-2 text-amber-900 font-black uppercase text-xs tracking-widest hover:translate-x-1 transition-transform">
             <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
             Back to Exploring
          </NavLink>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-none max-w-4xl">
            {campaign.title}
          </h1>
          <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm text-gray-900 font-bold text-sm">
                   By {campaign.creator?.firstName} {campaign.creator?.lastName || ''}
               </div>
                {isActive && (
                  <div className="px-4 py-2 rounded-full bg-blue-600 text-white font-black text-sm">
                    Active Campaign
                  </div>
                )}
                {isPending && (
                  <div className="px-4 py-2 rounded-full bg-amber-500 text-white font-black text-sm">
                    Pending Approval
                  </div>
                )}
                {isExpired && campaign.status === true && (
                  <div className="px-4 py-2 rounded-full bg-gray-500 text-white font-black text-sm">
                    Campaign Closed
                  </div>
                )}
               {campaign.deadline && (
                 <div className="px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-100 font-black text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ends on {new Date(campaign.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                 </div>
               )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Story */}
          <div className="lg:w-2/3 space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-gray-900">The Story</h2>
              <p className="text-xl text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Sidebar / Funding Box */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 bg-gray-50 border border-gray-100 rounded-4xl p-10 space-y-8 shadow-2xl shadow-gray-200/50">
              <div className="space-y-2">
                <p className="text-4xl font-black text-gray-900">₹{campaign.raisedAmount.toLocaleString()}</p>
                <p className="text-gray-500 font-medium">raised of <span className="font-bold text-gray-700">₹{campaign.goalAmount.toLocaleString()}</span> goal</p>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-lg shadow-blue-500/20"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-wider text-blue-600">
                  <span>{Math.round(progress)}% Funded</span>
                  <span>{campaign.donations?.length || 0} Donors</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-center">
                {authStore.getState().currentUser?.role !== 'ADMIN' ? (
                  <>
                    {isActive ? (
                      <NavLink 
                          to={`/donate/${campaign._id}`}
                          className="block w-full py-5 bg-gray-900 text-white font-black text-xl rounded-2xl hover:bg-black transition-all hover:-translate-y-1 hover:shadow-2xl shadow-gray-900/10 active:scale-95"
                      >
                        Donate Now
                      </NavLink>
                    ) : (
                      <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                        <p className="text-sm font-bold text-gray-500 italic">
                          {isPending ? "This campaign is awaiting approval." : "This campaign has ended and is no longer accepting donations."}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 font-medium pt-2">100% of your donation goes to the cause</p>
                  </>
                ) : (
                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                    <p className="text-sm font-bold text-blue-600 italic">Administrators are in moderation mode. Donations are restricted to user accounts.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Impact Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <p className="text-xl font-black text-purple-600">24h</p>
                          <p className="text-[10px] uppercase font-bold text-gray-400">Response</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-gray-100">
                          <p className="text-xl font-black text-green-600">Pure</p>
                          <p className="text-[10px] uppercase font-bold text-gray-400">Transparency</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discover More Section */}
        {allCampaigns.length > 0 && (
          <div className="mt-32 pt-20 border-t border-gray-100 space-y-12">
            <div className="flex justify-between items-end border-2 border-gray-100 rounded-3xl p-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">Discover More Projects</h2>
                <p className="text-gray-500 font-medium">Continue exploring the movements shaping our world.</p>
              </div>
              <NavLink to="/campaigns" className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline pb-2">
                View All Projects
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {allCampaigns.map((other) => {
                const otherProgress = (other.raisedAmount / other.goalAmount) * 100;
                return (
                  <NavLink 
                    to={`/campaign/${other._id}`} 
                    key={other._id}
                    className="group bg-gray-200 rounded-4xl border border-gray-100 p-8 space-y-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="space-y-3">
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{other.title}</h3>
                      <p className="text-gray-500 text-sm font-medium line-clamp-2">{other.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${Math.min(otherProgress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                        {Math.round(otherProgress)}% Funded
                      </p>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignDetails;