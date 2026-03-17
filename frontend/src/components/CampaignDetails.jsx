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
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/user-api/campaign/${id}`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/user-api/campaigns`)
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
      {/* Premium Hero Section */}
      <div className="relative h-[65vh] lg:h-[75vh] min-h-125 flex items-end">
        {/* Background Image with Overlays */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={campaign.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2074&auto=format&fit=crop"} 
            className="w-full h-full object-cover scale-105"
            alt={campaign.title}
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container mx-auto max-w-7xl px-8 pb-16 relative z-10">
          <div className="max-w-4xl space-y-8">
            <NavLink 
              to="/campaigns" 
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all hover:-translate-x-2 group w-fit"
            >
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-xs font-black uppercase tracking-widest">Explore Movements</span>
            </NavLink>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none uppercase">
                {campaign.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                 <div className="flex items-center gap-4 py-2 px-5 bg-blue-600 rounded-2xl border border-blue-500 shadow-xl shadow-blue-500/20">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-sm border border-white/20">
                      {campaign.creator?.firstName?.[0]}
                    </div>
                    <span className="text-blue-50 font-black text-sm uppercase tracking-wider">
                      Movement by {campaign.creator?.firstName} {campaign.creator?.lastName}
                    </span>
                 </div>

                 <div className="flex gap-3">
                    {isActive && (
                      <div className="px-5 py-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Campaign
                      </div>
                    )}
                    {campaign.deadline && (
                      <div className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white/80 font-black text-[10px] uppercase tracking-widest rounded-full">
                        Ends {new Date(campaign.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-20">
            <div className="space-y-10">
               <div className="inline-block">
                  <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Our Mission</h2>
                  <div className="h-1.5 w-full bg-blue-600 rounded-full" />
               </div>
               <p className="text-2xl lg:text-3xl text-gray-700 font-medium leading-[1.6] whitespace-pre-wrap">
                {campaign.description}
               </p>
            </div>

            {/* Visual Separator */}
            <div className="grid grid-cols-2 gap-8 py-12 border-y border-gray-100">
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transparency Level</p>
                  <p className="text-2xl font-black text-gray-900">Tier 1 Verified</p>
               </div>
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Support</p>
                  <p className="text-2xl font-black text-gray-900">0% Platform Fee</p>
               </div>
            </div>
          </div>

          {/* Elevated Funding Box */}
          <div className="lg:w-1/3">
            <div className="sticky top-12 bg-white border border-gray-100 rounded-[3rem] p-12 space-y-10 shadow-2xl shadow-blue-500/5">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Seeded</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-gray-900 tracking-tighter">₹{campaign.raisedAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 font-bold text-sm">Targeted goal of ₹{campaign.goalAmount.toLocaleString()}</p>
                </div>

                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{Math.round(progress)}% Progress</span>
                      <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{campaign.donations?.length || 0} Backers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                {authStore.getState().currentUser?.role !== 'ADMIN' ? (
                  <>
                    {isActive ? (
                      <NavLink 
                          to={`/donate/${campaign._id}`}
                          className="group relative block w-full py-6 bg-gray-950 text-white overflow-hidden rounded-4xl hover:bg-black transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                      >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                           <span className="font-black text-lg uppercase tracking-widest">Back this Project</span>
                           <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                           </svg>
                        </div>
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 translate-y-full transition-transform group-hover:translate-y-0" />
                      </NavLink>
                    ) : (
                      <div className="p-8 bg-gray-50 border border-gray-100 rounded-4xl text-center">
                        <p className="text-sm font-bold text-gray-500">
                          {isPending ? "Project currently in moderation." : "Journey complete. This campaign is closed."}
                        </p>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 text-center font-black uppercase tracking-widest pt-4">Direct Contribution • 100% Impact</p>
                  </>
                ) : (
                  <div className="p-8 bg-blue-50 border border-blue-100 rounded-4xl text-center">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Admin Mode</p>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">Financial interaction restricted for administrative accounts.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Discover More Section */}
        {allCampaigns.length > 0 && (
          <div className="mt-32 pt-20 border-t border-gray-100 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 overflow-hidden">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Discover More Projects</h2>
                <p className="text-gray-500 font-medium">Continue exploring the movements shaping our world.</p>
              </div>
              <NavLink to="/campaigns" className="group flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest hover:text-blue-700 transition-colors pb-1">
                View All Projects
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {allCampaigns.map((other) => {
                const otherProgress = (other.raisedAmount / other.goalAmount) * 100;
                return (
                  <NavLink 
                    to={`/campaign/${other._id}`} 
                    key={other._id}
                    className="group bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={other.imageUrl || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000"} 
                        alt={other.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{other.title}</h3>
                        <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">{other.description}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600"
                            style={{ width: `${Math.min(otherProgress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                            {Math.round(otherProgress)}% Funded
                          </p>
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                            ${other.raisedAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
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