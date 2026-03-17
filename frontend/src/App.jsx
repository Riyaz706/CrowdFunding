import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router'
import Home from './components/Home'
import AdminApproval from './components/AdminApproval'
import RootLayout from './components/RootLayout'
import Login from './components/Login'
import Campaigns from './components/Campaigns'
import CampaignDetails from './components/CampaignDetails'
import ErrorPage from './components/ErrorPage'
import DonationPage from './components/DonationPage'
import DonorTracking from './components/DonorTracking'
import ProgressBar from './components/ProgressBar'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import CreateCampaign from './components/CreateCampaign'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />
        },
        {
          path: '/home',
          element: <Home />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          path: '/campaigns',
          element: <Campaigns />
        },
        {
          path: '/campaign/:id',
          element: <CampaignDetails />
        },
        {
          // Protected User Routes (Only accessible by USER)
          element: <ProtectedRoute allowedRoles={['USER']} />,
          children: [
            {
              path: '/create-campaign',
              element: <CreateCampaign />
            },
            {
              path: '/donor-tracking',
              element: <DonorTracking />
            },
            {
              path: '/donate/:campaignId',
              element: <DonationPage />
            },
          ]
        },
        {
          // Protected Admin Routes
          element: <ProtectedRoute allowedRoles={['ADMIN']} />,
          children: [
            {
              path: '/admin-approval',
              element: <AdminApproval />
            },
          ]
        },
        {
          path: '/progress-bar',
          element: <ProgressBar />
        }
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
