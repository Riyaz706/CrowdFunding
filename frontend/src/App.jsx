import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router'
import Home from './components/Home'
import AdminApproval from './components/AdminApproval'
import RootLayout from './components/RootLayout'
import Login from './components/Login'
import Register from './components/Register'
import CampaignDetails from './components/CampaignDetails'
import CreateCampaign from './components/CreateCampaign'
import DonationPage from './components/DonationPage'
import DonorTracking from './components/DonorTracking'
import ProgressBar from './components/ProgressBar'


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    }
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
