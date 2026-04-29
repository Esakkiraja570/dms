# Smallshop Routes Setup Guide

## Add these routes to your App.js or App.jsx

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Smallshop Components
import SmallshopOwnerRegister from './pages/Smallshop/SmallshopOnerregister';
import SmallshopLogin from './pages/Smallshop/SmallshopLogin';
import SmallshopDashboard from './pages/Smallshop/SmallshopDashbord';
import SmallShopPrint from './pages/Smallshop/SmallShopPrint';

// Protected Route Component (Optional but recommended)
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');
  return token ? element : <Navigate to="/smallshop-login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== SMALLSHOP ROUTES ===== */}
        
        {/* Public Routes */}
        <Route 
          path="/smallshop-register" 
          element={<SmallshopOwnerRegister />} 
        />
        
        <Route 
          path="/smallshop-login" 
          element={<SmallshopLogin />} 
        />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/smallshop-dashboard" 
          element={<ProtectedRoute element={<SmallshopDashboard />} />}
        />

        <Route 
          path="/smallshop-print/:billId" 
          element={<ProtectedRoute element={<SmallShopPrint />} />}
        />

        {/* Other existing routes can go here */}
      </Routes>
    </Router>
  );
}

export default App;
```

---

## Navigation Links

Add these links in your Navbar component:

```javascript
// For unauthenticated users
<a href="/smallshop-register">Shop Register</a>
<a href="/smallshop-login">Shop Login</a>

// For authenticated users (check localStorage)
{localStorage.getItem('shopMobile') && (
  <>
    <span>Welcome, {localStorage.getItem('shopName')}</span>
    <a href="/smallshop-dashboard">Dashboard</a>
    <button onClick={handleLogout}>Logout</button>
  </>
)}
```

---

## Installation Dependencies

```bash
npm install qrcode.react
npm install axios
npm install react-router-dom
```

---

## Environment Variables (.env)

```
REACT_APP_API_URL=http://localhost:1010
REACT_APP_WHATSAPP_API_KEY=your_api_key_here
```

---

## Alternative: If using Context API for Auth

```javascript
// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [shopData, setShopData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('authToken')
  );

  const login = (shopId, shopName, mobile, token) => {
    localStorage.setItem('shopId', shopId);
    localStorage.setItem('shopName', shopName);
    localStorage.setItem('shopMobile', mobile);
    localStorage.setItem('authToken', token);
    setShopData({ shopId, shopName, mobile });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setShopData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ shopData, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Then use in components:
```javascript
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const MyComponent = () => {
  const { shopData, isAuthenticated, logout } = useContext(AuthContext);
  // Use auth data
};
```
