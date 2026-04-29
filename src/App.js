import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Adminpannel from './pages/Adminpannel/Adminpannel';
import Milkman from './pages/Milkman/Milkman';
import Distributors from './pages/NewsPaper/Distributors';


import Milkmaninterface from './pages/Milkman/MilkamanInterface/Milkmaninterface';
import Milkenternce from './pages/Milkman/MilkamanInterface/Milkenternce';
import MilkLogin from './pages/Milkman/MilkLogin';
import CustomersLogin from './pages/Milkman/Coustomer/CustomersLogin';
import CustomerDashboard from './pages/Milkman/Coustomer/CustomerDashboard';
import MilkmanAdmin from './pages/Milkman/MilkamanAdmin.jsx'
import AgentInterface from './pages/EMI/EmiAgent/AgentInterface';
import AgentRegistration from './pages/EMI/EmiAgent/AgentRegistration';
import UserInterface from './pages/EMI/EmiAgent/UserInterface';
import EmiCustomerDashboard from './pages/EMI/EmiAgentCustomers/EmiCustomerDashboard';
import EmiCustomerLogin from './pages/EMI/EmiAgentCustomers/EmiCustomerLogin';
import EmiAgentLogin from './pages/EMI/EmiAgent/EmiAgentLogin';
import PaymentPage from './pages/EMI/EmiAgent/Paymentpage';
import SmallshopOwnerRegister from './pages/Smallshop/SmallshopOnerregister';
import SmallshopDashboard from './pages/Smallshop/SmallshopDashbord';
import SmallshopLogin from './pages/Smallshop/SmallshopLogin';
import SmallShopPrint from './pages/Smallshop/SmallShopPrint';
import DistributorsInterface from './pages/NewsPaper/DistributorsInterface.jsx';
import DistributorLogin from './pages/NewsPaper/DistributorLogin.jsx';
import DistributorRegister from './pages/NewsPaper/DistributorRegister.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AgentDashboard from './pages/EMI/EmiAgent/AgentDashboard.jsx';

function App() {
  return (
    <BrowserRouter>

      {/* ✅ FIXED POSITION */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Adminpannel />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/milkmanregister" element={<Milkenternce />} />
        <Route path="/customerlogin" element={<CustomersLogin />} />
        <Route path="/milkmaninterface" element={<Milkmaninterface />} />
        <Route path="/milkman" element={<Milkman />} />

        <Route path="/Smallshopregister" element={<SmallshopOwnerRegister />} />
        <Route path="/smallshopdashboard" element={<SmallshopDashboard />} />
        <Route path="/smallshopdashlogin" element={<SmallshopLogin />} />
        <Route path="/smallshopbill" element={<SmallShopPrint />} />

        <Route path="/distributors" element={<Distributors />} />
        <Route path="/distributor-interface" element={<DistributorsInterface />} />
        <Route path="/distributor-login" element={<DistributorLogin />} />
        <Route path="/distributor-register" element={<DistributorRegister />} />

      
        <Route path="/login" element={<MilkLogin />} />
        <Route path="/Milkmanadmin" element={<MilkmanAdmin />} />

        <Route path="/Userinterface" element={<UserInterface />} />
        <Route path="/emi" element={<UserInterface />} />

        <Route path="/AgentInterface" element={<AgentInterface />} />
        <Route path="/emi/agent" element={<AgentInterface />} />

        <Route path="/agentlogin" element={<EmiAgentLogin />} />

        <Route path="/agentregistration" element={<AgentRegistration />} />
        <Route path="/emi/agent/register" element={<AgentRegistration />} />

        
        <Route path="/agentdashboard" element={<AgentDashboard />} />

        <Route path="/EmiCustomerLogin" element={<EmiCustomerLogin />} />
        <Route path="/emi/customer/login" element={<EmiCustomerLogin />} />

        <Route path="/EmiCustomerDashboard" element={<EmiCustomerDashboard />} />
        <Route path="/customer-dashboard" element={<EmiCustomerDashboard />} />
        <Route path="/emi/customer/dashboard" element={<EmiCustomerDashboard />} />

        <Route path="/pay/:id" element={<PaymentPage />} />
        <Route path="/emi/payment/:id" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;