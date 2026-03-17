import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';

function AdminApproval() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [liveCampaigns, setLiveCampaigns] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);

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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin-api/all-donations', {
        withCredentials: true
      });
      setTransactions(response.data.payload);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transaction history.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLive = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin-api/all-campaigns', {
        withCredentials: true
      });
      // Filter live campaigns (status true)
      setLiveCampaigns(response.data.payload.filter(c => c.status === true));
    } catch (err) {
      console.error('Error fetching live campaigns:', err);
      setError('Failed to load live campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') fetchPending();
    else if (activeTab === 'live') fetchLive();
    else fetchTransactions();
  }, [activeTab]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:3000/admin-api/campaign/${id}`, 
        { status: newStatus },
        { withCredentials: true }
      );
      if (activeTab === 'pending') {
        setPendingCampaigns(prev => prev.filter(c => c._id !== id));
      } else {
        fetchLive();
      }
    } catch (err) {
      console.error('Error updating campaign status:', err);
      alert('Failed to update campaign.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(editingCampaign._id);
      await axios.put(`http://localhost:3000/admin-api/campaign/${editingCampaign._id}`, 
        editingCampaign,
        { withCredentials: true }
      );
      setEditingCampaign(null);
      fetchLive();
    } catch (err) {
      console.error('Error editing campaign:', err);
      alert('Failed to save changes.');
    } finally {
      setActionLoading(null);
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`px-8 py-3 rounded-3xl font-black text-sm transition-all flex items-center gap-2 ${
            activeTab === id 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
        }`}
    >
        <span>{icon}</span>
        {label}
    </button>
  );

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-600 font-bold text-xs uppercase tracking-widest">
                    Moderation Suite
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">System Oversight</h1>
                <p className="text-gray-500 font-medium max-w-xl">
                    Manage campaign approvals and monitor platform-wide transactions.
                </p>
            </div>
            
            <div className="flex bg-white p-2 rounded-4xl shadow-sm border border-gray-100">
                <TabButton id="pending" label="Pending" icon="🚀" />
                <TabButton id="live" label="Live" icon="🔥" />
                <TabButton id="transactions" label="History" icon="💰" />
            </div>
        </div>

        {/* Edit Modal */}
        {editingCampaign && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                <div className="bg-white rounded-4xl p-10 max-w-2xl w-full shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black text-gray-900">Edit Campaign</h2>
                        <button onClick={() => setEditingCampaign(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <form onSubmit={handleEditSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                            <input 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all font-medium"
                                value={editingCampaign.title}
                                onChange={(e) => setEditingCampaign({...editingCampaign, title: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Goal (₹)</label>
                                <input 
                                    type="number"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all font-medium"
                                    value={editingCampaign.goalAmount}
                                    onChange={(e) => setEditingCampaign({...editingCampaign, goalAmount: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Deadline</label>
                                <input 
                                    type="date"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all font-medium"
                                    value={editingCampaign.deadline?.split('T')[0]}
                                    onChange={(e) => setEditingCampaign({...editingCampaign, deadline: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                            <textarea 
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-hidden transition-all font-medium h-32"
                                value={editingCampaign.description}
                                onChange={(e) => setEditingCampaign({...editingCampaign, description: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={actionLoading === editingCampaign._id}
                            className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:bg-gray-400"
                        >
                            {actionLoading === editingCampaign._id ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        )}

        <ErrorAlert message={error} />

        {activeTab === 'pending' ? (
            pendingCampaigns.length === 0 ? (
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
                                        <span>Goal: ₹{(campaign.goalAmount || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                                <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                    {campaign.description}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                                <NavLink 
                                    to={`/campaign/${campaign._id}`}
                                    className="flex-1 lg:flex-none px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all text-center text-xs uppercase tracking-widest"
                                >
                                    Review
                                </NavLink>
                                <button 
                                    onClick={() => handleUpdateStatus(campaign._id, true)}
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
            )
        ) : activeTab === 'live' ? (
            liveCampaigns.length === 0 ? (
                <div className="bg-white rounded-4xl p-20 text-center border border-dashed border-gray-200 space-y-4">
                    <div className="text-6xl text-gray-200">📡</div>
                    <h2 className="text-2xl font-black text-gray-900">No live campaigns</h2>
                    <p className="text-gray-500 font-medium">There are currently no active movements on the platform.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {liveCampaigns.map((campaign) => (
                        <div key={campaign._id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                            <div className="space-y-4 flex-1">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-gray-900">{campaign.title}</h3>
                                        <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">Active</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                                        <span>By {campaign.creator?.firstName}</span>
                                        <span>•</span>
                                        <span>Raised: ₹{campaign.raisedAmount?.toLocaleString()}</span>
                                        <span>•</span>
                                        <span>Goal: ₹{campaign.goalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                                <button 
                                    onClick={() => setEditingCampaign(campaign)}
                                    className="flex-1 lg:flex-none px-8 py-4 bg-white border-2 border-gray-200 text-gray-600 font-black rounded-2xl hover:border-gray-900 hover:text-gray-900 transition-all text-xs uppercase tracking-widest"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(campaign._id, false)}
                                    disabled={actionLoading === campaign._id}
                                    className="flex-1 lg:flex-none px-8 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    {actionLoading === campaign._id ? (
                                        <div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                                    ) : 'Deactivate'}
                                </button>
                                <NavLink 
                                    to={`/campaign/${campaign._id}`}
                                    className="flex-1 lg:flex-none px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all text-center text-xs uppercase tracking-widest"
                                >
                                    View
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
            )
        ) : (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Donor</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((t) => (
                                <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5 align-middle">
                                        <code className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-mono">
                                            {t.transactionId?.substring(0, 15)}...
                                        </code>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900">{t.donor?.firstName || 'Anonymous'}</span>
                                            <span className="text-xs text-gray-400">{t.donor?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <span className="text-sm font-medium text-gray-600 line-clamp-1">{t.campaign?.title}</span>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <span className="text-sm font-black text-gray-900">₹{t.amount?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5 align-middle">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                            t.paymentStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {t.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 align-middle text-right">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default AdminApproval;