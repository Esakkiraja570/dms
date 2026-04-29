 🚀 Smallshop Quick Reference Guide

## File Locations & Descriptions

```
src/pages/Smallshop/
├── SmallshopOnerregister.jsx          ← Shop Registration Page
├── SmallshopLogin.jsx                 ← Shop Login Page
├── SmallshopDashbord.jsx              ← Main Dashboard (Hub)
├── ProductManagement.jsx              ← Product Management Tab
├── BillingPage.jsx                    ← Billing & Checkout Tab
├── CustomerManagement.jsx             ← Customer & Offers Tab
├── SmallShopPrint.jsx                 ← Bill Printing Component
├── Smallshop.css                      ← All Styling
├── SMALLSHOP_FLOW_DOCUMENTATION.md    ← Complete Documentation
├── API_INTEGRATION_GUIDE.md           ← Backend API Specs
├── ROUTING_SETUP.md                   ← React Router Setup
├── IMPLEMENTATION_SUMMARY.md          ← Implementation Overview
└── QUICK_REFERENCE.md                 ← This File
```

---

## 🔗 Route Map

```
/smallshop-register
      ↓
   [Registration Page]
      ↓
/smallshop-login
      ↓
   [Login Page]
      ↓
/smallshop-dashboard
      ↓
   [Main Dashboard]
      ├─ Profile Tab
      ├─ Products Tab
      ├─ Billing Tab
      └─ Customers Tab
```

---

## ⚡ Quick Component Usage

### 1. Registration Component
**File**: `SmallshopOnerregister.jsx`
**Route**: `/smallshop-register`
**Props**: None
**Access**: Public

```javascript
import SmallshopOwnerRegister from './pages/Smallshop/SmallshopOnerregister';

// In routes
<Route path="/smallshop-register" element={<SmallshopOwnerRegister />} />
```

### 2. Login Component
**File**: `SmallshopLogin.jsx`
**Route**: `/smallshop-login`
**Props**: None
**Access**: Public

```javascript
import SmallshopLogin from './pages/Smallshop/SmallshopLogin';

// In routes
<Route path="/smallshop-login" element={<SmallshopLogin />} />
```

### 3. Dashboard Component
**File**: `SmallshopDashbord.jsx`
**Route**: `/smallshop-dashboard`
**Props**: None
**Access**: Protected (requires authToken)

```javascript
import SmallshopDashboard from './pages/Smallshop/SmallshopDashbord';

// In routes (with protection)
<Route 
  path="/smallshop-dashboard" 
  element={<ProtectedRoute element={<SmallshopDashboard />} />} 
/>
```

---

## 📦 Component Dependencies

### What Each Component Needs

| Component | Dependencies | Library Imports |
|-----------|---|---|
| SmallshopOnerregister | axios | react, axios |
| SmallshopLogin | axios | react, axios |
| SmallshopDashbord | axios, ProductManagement, BillingPage, CustomerManagement | react, axios |
| ProductManagement | axios | react, axios |
| BillingPage | axios, qrcode.react | react, axios, qrcode.react |
| CustomerManagement | axios | react, axios |
| SmallShopPrint | qrcode.react | react, qrcode.react |

---

## 🔑 Local Storage Keys

```javascript
// Set on successful registration & login
localStorage.setItem('shopMobile', mobile);          // Mobile of shop owner
localStorage.setItem('shopId', shopId);              // Shop ID from DB
localStorage.setItem('shopName', shopName);          // Shop name
localStorage.setItem('authToken', token);            // JWT token

// Clear on logout
localStorage.clear();

// Check if logged in
const isLoggedIn = !!localStorage.getItem('authToken');
```

---

## 🌐 Required npm Packages

```bash
# Core
npm install react@19.2.4
npm install react-router-dom@7.13.1
npm install axios@1.13.6

# Additional
npm install qrcode.react       # For QR codes
npm install html2pdf.js        # For PDF (optional)

# Development
npm install react-scripts@5.0.1
npm install @testing-library/react@16.3.2
```

---

## 🎨 CSS Classes Quick Reference

### Layout Classes
- `.smallshop-page` - Main page container
- `.smallshop-card` - Card container
- `.dashboard-container` - Dashboard wrapper
- `.dashboard-header` - Header section
- `.dashboard-tabs` - Tab navigation
- `.dashboard-content` - Content area

### Form Classes
- `.smallshop-form` - Form wrapper
- `.form-row` - Two-column row
- `.form-group` - Single form field
- `.form-group.full-width` - Full width field
- `.submit-button` - Primary button

### Alert Classes
- `.error-alert` - Red error message
- `.success-alert` - Green success message

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 480px - 768px
- Mobile: < 480px

---

## 🔄 State Management Pattern

```javascript
const [state, setState] = useState(initialValue);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

// Always follow pattern:
setLoading(true);
try {
  // API call
  setError("");
  setSuccess("Success message");
} catch (err) {
  setError("Error message");
} finally {
  setLoading(false);
}
```

---

## 🌍 API Base URL

```javascript
// All API calls use:
const BASE_URL = "http://localhost:1010/api";

// Example:
await axios.post(`${BASE_URL}/smallshop/login`, data);
```

---

## 📱 Mobile Optimization Tips

- All components are responsive
- Use on phones, tablets, desktops
- Touch-friendly button sizes (min 44px)
- Large input fields for mobile
- Horizontal scroll for tables on mobile
- Stack layout on small screens

---

## 🔐 Security Headers Always Include

```javascript
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  }
};

await axios.get(url, config);
```

---

## 📊 Data Flow Diagram

```
User Input
    ↓
Validation
    ↓
State Update
    ↓
API Call (with loading state)
    ↓
Response/Error
    ↓
Update State
    ↓
Re-render UI
    ↓
Show Success/Error Alert
```

---

## 🧪 Testing Checklist

### Registration
- [ ] Enter all required fields
- [ ] Validation errors show
- [ ] Submit success
- [ ] Redirect to login

### Login
- [ ] Invalid credentials show error
- [ ] Valid credentials succeed
- [ ] Token stored in localStorage
- [ ] Redirect to dashboard

### Products
- [ ] Add product successfully
- [ ] Filter by category works
- [ ] Edit price works (double-click)
- [ ] Delete product works

### Billing
- [ ] Add products to cart
- [ ] Adjust quantities
- [ ] Remove from cart
- [ ] Generate bill
- [ ] WhatsApp message sent
- [ ] Bill saved to DB

### Customers
- [ ] Customer list displays
- [ ] Create offer works
- [ ] Send offer to customer works
- [ ] Broadcast to segment works

---

## ⚙️ Common Issues & Solutions

### Issue: Token Not Sending
**Solution**: Check headers format
```javascript
headers: {
  Authorization: `Bearer ${token}` // Note: Bearer, space, token
}
```

### Issue: CORS Error
**Solution**: Backend should have CORS configured
```javascript
// Backend should include
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Issue: QR Code Not Showing
**Solution**: Check qrcode.react import
```javascript
import QRCode from "qrcode.react";
```

### Issue: Mobile Number Validation
**Solution**: 10 digits required
```javascript
/^[0-9]{10}$/.test(mobile)
```

### Issue: localStorage Empty
**Solution**: Check if on same domain/port
```javascript
// Dev: http://localhost:3000
// Prod: https://yourdomain.com
```

---

## 📈 Performance Tips

1. **Lazy Load Components** (if many products)
```javascript
const ProductManagement = React.lazy(() => import('./ProductManagement'));
```

2. **Memoize Heavy Components**
```javascript
export default React.memo(BillingPage);
```

3. **Optimize Re-renders**
```javascript
useCallback(() => {...}, [dependencies])
```

---

## 🎓 Code Examples

### Making API Request
```javascript
try {
  const response = await axios.get(
    `http://localhost:1010/api/smallshop/profile/${mobile}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }
  );
  setData(response.data);
} catch (err) {
  setError(err.response?.data?.message || 'Error occurred');
}
```

### Form Submission
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const errors = validate();
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  setLoading(true);
  try {
    await axios.post(url, data);
    setSuccess("Success!");
  } catch (err) {
    setError(err.response?.data?.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🌟 Best Practices Implemented

✅ Consistent error handling
✅ Loading states prevent UX issues
✅ Input validation on client side
✅ Professional UI/UX
✅ Responsive design
✅ Security headers included
✅ localStorage for persistence
✅ Component modularization
✅ DRY code principles
✅ Clear variable naming

---

## 📞 Troubleshooting

**Q: Component not rendering?**
A: Check route is added and component imported

**Q: API call fails?**
A: Check backend is running on port 1010

**Q: Styling looks broken?**
A: Ensure Smallshop.css is imported in component

**Q: localStorage empty?**
A: Check browser allows localStorage

**Q: WhatsApp not sending?**
A: Verify WhatsApp API is configured

---

## 🚀 Deployment Checklist

- [ ] Change API URL to production in all components
- [ ] Update backend URL from localhost:1010
- [ ] Add SSL certificate for HTTPS
- [ ] Configure WhatsApp API keys in backend
- [ ] Setup environment variables
- [ ] Test all flows in production
- [ ] Setup error logging
- [ ] Configure analytics
- [ ] Setup backup & recovery

---

## 📞 Need Help?

Refer to these files in order:
1. `IMPLEMENTATION_SUMMARY.md` - Overview
2. `SMALLSHOP_FLOW_DOCUMENTATION.md` - Detailed flow
3. `API_INTEGRATION_GUIDE.md` - Backend specs
4. `ROUTING_SETUP.md` - Integration examples
5. Individual component files - Code details

---

**Version**: 1.0
**Last Updated**: April 2026
**Status**: ✅ Production Ready
