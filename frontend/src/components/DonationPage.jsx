import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import BASE_URL from '../config/api';
import ErrorAlert from './ErrorAlert';

// ⚠️ IMPORTANT: Replace this placeholder with your ACTUAL Stripe Publishable Key
// You can find it in your Stripe Dashboard -> Developers -> API Keys
const PUBLISHABLE_KEY = 'pk_test_51Sh0WLGRDLiIRHOAP3SSblVCSIErN506esMF2oIUmuaO2zR9nzj879YQiTAwt90TNWWceIGr7WjNyG7TLDSlrJKX00YikJ9MvU';
const stripePromise = loadStripe(PUBLISHABLE_KEY);

function CheckoutForm({ amount, campaignId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false); // New: Track if PaymentElement is mounted
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !ready) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donor-tracking`,
      },
    });

    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement onReady={() => setReady(true)} />
      {error && <ErrorAlert message={error} />}
      <button
        type="submit"
        disabled={processing || !stripe || !ready}
        className="w-full py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-xl shadow-blue-200"
      >
        {processing ? 'Processing...' : ready ? `Confirm ₹${amount.toLocaleString()} Donation` : 'Loading Payment...'}
      </button>
    </form>
  );
}

function DonationPage() {
  const { campaignId } = useParams();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(''); // New: Donor message
  const [campaign, setCampaign] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (PUBLISHABLE_KEY.includes('9z6fVrCqhG1p')) {
      console.warn("Stripe placeholder key detected. Please update PUBLISHABLE_KEY in DonationPage.jsx");
    }

    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user-api/campaign/${campaignId}`);
        setCampaign(response.data.payload);
      } catch (err) {
        setError('Campaign not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [campaignId]);

  const handleAmountSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount < 1) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${BASE_URL}/user-api/create-payment-intent`, {
        amount: parseInt(amount),
        campaignId,
        description // Pass message to backend
      }, { withCredentials: true });

      setClientSecret(response.data.clientSecret);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize payment.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">

          <div className="mb-12 text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest">
              {step === 1 ? 'Step 1: Choose Amount' : 'Step 2: Payment Details'}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              {step === 1 ? 'Support this Movement' : 'Complete Donation'}
            </h1>
            {campaign && (
              <p className="text-gray-500 font-medium italic">
                Supporting: <span className="text-gray-900 font-bold not-italic">{campaign.title}</span>
              </p>
            )}
          </div>

          <ErrorAlert message={error} />

          {step === 1 ? (
            <form onSubmit={handleAmountSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Contribution Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-14 pr-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl text-3xl font-black transition-all outline-none"
                    required
                    min="1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[500, 1000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${amount === preset.toString()
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
                        }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message field */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Message of Support (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Leave a word of encouragement..."
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl text-lg font-medium transition-all outline-none resize-none h-32"
                  maxLength="200"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !amount}
                className="w-full py-6 bg-gray-900 text-white font-black text-xl rounded-2xl hover:bg-black transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-gray-200"
              >
                {loading ? 'Initializing...' : 'Continue to Payment'}
              </button>
            </form>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm amount={parseInt(amount)} campaignId={campaignId} />
            </Elements>
          )}

          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-6 grayscale opacity-40">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
            <div className="h-4 w-px bg-gray-200"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Secure Payment</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <NavLink to={`/campaign/${campaignId}`} className="text-gray-400 font-bold hover:text-gray-600 transition-all text-sm uppercase tracking-widest">
            ← Back to Campaign
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;