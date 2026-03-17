import React, { useEffect, useState } from "react";
import heroImg from "../assets/hero-new.png";
import { NavLink } from "react-router";
import axios from "axios";
import { authStore } from "../store/authStore";

function Home() {
  const { currentUser } = authStore();
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalCampaigns: 0,
    totalDonors: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/common-api/stats");
        setStats(res.data.payload);
      } catch (err) {
        console.error("Error fetching global stats:", err);
      }
    };
    fetchStats();
  }, []);

  const radialBg = {
    background: `radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent),
                 radial-gradient(circle at bottom left, rgba(249, 115, 22, 0.05), transparent)`
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 mt-2" style={radialBg}>
      {/* Hero Section */}
      <section className="container mx-auto px-1 py-1 lg:py-1 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 space-y-8 translate-y-0 transition-all duration-700 bg-amber-300 p-10 rounded-2xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-sm ">
            Empowering Visionaries Worldwide
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Turn Your <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-orange-500">Big Ideas</span> into Reality
          </h1>
          <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
            The world's most trusted crowdfunding platform. Connect with a global community and raise funds for projects that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {currentUser?.role !== 'ADMIN' && (
              <NavLink
                to="/create-campaign"
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center"
              >
                Start a Campaign
              </NavLink>
            )}
            <NavLink
              to="/campaigns"
              className="px-8 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center"
            >
              Explore Projects
            </NavLink>
          </div>
        </div>
        
        <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="absolute -inset-4 bg-linear-to-tr from-blue-100 to-orange-100 rounded-full blur-3xl opacity-30 -z-10"></div>
          <img 
            src={heroImg} 
            alt="Crowdfunding Illustration" 
            className="w-full max-w-2xl mx-auto drop-shadow-2xl rounded-2xl transition-opacity duration-1000"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2 bg-amber-300 p-10 rounded-2xl">
            <p className="text-4xl font-black text-blue-600">₹{stats.totalRaised.toLocaleString()}+</p>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Raised</p>
          </div>
          <div className="space-y-2 bg-amber-300 p-10 rounded-2xl">
            <p className="text-4xl font-black text-purple-600">{stats.totalCampaigns}+</p>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Active Campaigns</p>
          </div>
          <div className="space-y-2 bg-amber-300 p-10 rounded-2xl">
            <p className="text-4xl font-black text-orange-500">{stats.totalDonors}+</p>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">Global Donors</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Why choose CrowdFunding?</h2>
          <p className="text-gray-500 text-lg">We provide the tools and support you need to make your project successful from day one.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-amber-300 p-10 rounded-2xl">
          {[
            { 
              title: "Global Reach", 
              desc: "Connect with supporters from over 150 countries instantly.", 
              color: "bg-blue-50 text-blue-600",
              icon: "🌍"
            },
            { 
              title: "Trust & Security", 
              desc: "Industry-leading fraud protection and secure payment processing.", 
              color: "bg-purple-50 text-purple-600",
              icon: "🛡️"
            },
            { 
              title: "Dedicated Support", 
              desc: "Our team is here to guide you through every step of your journey.", 
              color: "bg-orange-50 text-orange-600",
              icon: "💬"
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white">
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA - Only visible to non-logged in users */}
      {!currentUser && (
        <section className="container mx-auto px-6 py-20">
          <div className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 text-center text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 blur-[120px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 blur-[120px] opacity-20"></div>
            
            <h2 className="text-4xl lg:text-6xl font-black max-w-4xl mx-auto leading-tight">
              Ready to bring your project to life?
            </h2>
            <h1 className="text-gray-400 text-xl max-w-2xl mx-auto">
              Join the community of thousands who have already successfully funded their dreams.
            </h1>
            <div className="pt-4">
              <NavLink
                to="/register"
                className="px-12 py-5 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl inline-block"
              >
                Get Started for Free
              </NavLink>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer-lite */}
      <footer className="border-t border-gray-100 py-12 text-center text-gray-400 text-sm">
        <p>&copy; 2026 CrowdFunding App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
