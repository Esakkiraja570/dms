# Smallshop Flow Documentation

## Overview
Complete Smallshop/Supermarket management system with registration, login, product management, billing system, and customer relationship management with WhatsApp integration.

---

## 📋 System Modules

### 1. **Registration** (`SmallshopOnerregister.jsx`)
Shop owner registration with complete shop details

**Features:**
- ✅ Owner name and shop name
- ✅ Mobile & email validation
- ✅ Shop address, city, area
- ✅ GST number
- ✅ Password protection
- ✅ WhatsApp number for customer updates

**API Endpoint:**
```
POST /api/smallshop/register
Payload: {
  ownerName, shopName, mobile, email,
  shopAddress, city, area, gst,
  password, whatsappNumber
}
```

---

### 2. **Login** (`SmallshopLogin.jsx`)
Shop owner login with credentials

**Features:**
- ✅ Mobile-based login
- ✅ Password authentication
- ✅ Token-based session management
- ✅ Redirect to dashboard

**API Endpoint:**
```
POST /api/smallshop/login
Payload: { mobile, password }
Response: { shopId, shopName, token }
```

---

### 3. **Dashboard** (`SmallshopDashbord.jsx`)
Main dashboard with tabs for different modules

**Tabs:**
- 📋 **Shop Profile** - View shop details
- 📦 **Products** - Manage products
- 💳 **Billing** - Create bills & receive payments
- 👥 **Customers** - Manage customers & offers

**Features:**
- ✅ Tabbed navigation
- ✅ Profile view
- ✅ Logout functionality

---

### 4. **Product Management** (`ProductManagement.jsx`)
One-time product entry with editing capabilities

**Features:**
- ✅ Add products with details (name, SKU, category, price, stock)
- ✅ Filter products by category
- ✅ Edit product prices (double-click to edit)
- ✅ Delete products
- ✅ Product categorization:
  - Groceries, Dairy, Bakery, Beverages
  - Snacks, Fruits, Vegetables, Other

**API Endpoints:**
```
GET /api/smallshop/{shopId}/products
- Fetch all products

POST /api/smallshop/{shopId}/products
- Add new product
Payload: { productName, sku, category, price, stock }

PUT /api/smallshop/{shopId}/products/{productId}
- Update product price
Payload: { price }

DELETE /api/smallshop/{shopId}/products/{productId}
- Delete product
```

---

### 5. **Billing System** (`BillingPage.jsx`)
Complete billing & checkout system with WhatsApp integration

**Features:**

#### **Product Selection:**
- ✅ Filter by category
- ✅ Add/remove items to cart
- ✅ Adjust quantities
- ✅ Real-time cart updates

#### **Customer Info:**
- ✅ Customer name (required)
- ✅ Customer phone (optional)

#### **Bill Generation:**
- ✅ Automatic subtotal calculation
- ✅ GST (18%) calculation
- ✅ Grand total display
- ✅ QR code for bill scanning
- ✅ Bill number generation
- ✅ Timestamp

#### **WhatsApp Integration:**
- ✅ Auto-send short message to customer
- ✅ Bill number and total amount
- ✅ Shop phone in message

#### **Bill Actions:**
- ✅ Print bill
- ✅ Save as PDF (with QR code)
- ✅ Generate new bill

**API Endpoints:**
```
POST /api/smallshop/{shopId}/bills
- Save bill to database
Payload: { billNumber, items, customer, totals }

POST /api/whatsapp/send
- Send WhatsApp message
Payload: { phone, message, shopId }
```

---

### 6. **Customer Management** (`CustomerManagement.jsx`)
Customer tracking & offer management

**Customer Features:**
- ✅ Automatic customer creation from billing
- ✅ Track purchase history
- ✅ Purchase level classification:
  - 🥇 Gold (High value customers)
  - 🥈 Silver (Regular customers)
  - 🥉 Bronze (New customers)
- ✅ Total purchase tracking
- ✅ Visit count tracking

**Offer Management:**
- ✅ Create special offers
- ✅ Set discount percentage
- ✅ Minimum purchase requirement
- ✅ Validity periods

**WhatsApp Promotion:**
- ✅ Send offers to individual customers
- ✅ Broadcast offers to customer segments
- ✅ Target by purchase level
- ✅ Automatic message formatting

**API Endpoints:**
```
GET /api/smallshop/{shopId}/customers
- Fetch all customers

GET /api/smallshop/{shopId}/offers
- Fetch all offers

POST /api/smallshop/{shopId}/offers
- Create new offer
Payload: { offerName, description, discount, validUntil, minPurchase }

POST /api/smallshop/{shopId}/broadcast-offer
- Broadcast offer to multiple customers
Payload: { offerId, customerIds }

DELETE /api/smallshop/{shopId}/offers/{offerId}
- Delete offer
```

---

### 7. **Bill Printing** (`SmallShopPrint.jsx`)
PDF-ready bill layout with QR code

**Features:**
- ✅ Professional bill layout
- ✅ QR code (value is JSON string of bill data)
- ✅ All shop details
- ✅ Customer information
- ✅ Itemized list
- ✅ Tax & totals
- ✅ Print-to-PDF ready
- ✅ Responsive design

---

## 🔄 User Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ SHOP OWNER JOURNEY                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. Registration (SmallshopOnerregister.jsx)            │
│    ↓                                                    │
│ 2. Login (SmallshopLogin.jsx)                          │
│    ↓                                                    │
│ 3. Dashboard (SmallshopDashbord.jsx)                   │
│    ├─ Profile View                                     │
│    ├─ Product Management                               │
│    │   ├─ Add Products (One-time setup)                │
│    │   ├─ Edit Prices                                  │
│    │   ├─ Filter by Category                           │
│    │   └─ Delete Products                              │
│    ├─ Billing System (BillingPage.jsx)                 │
│    │   ├─ Select Products from Cart                    │
│    │   ├─ Customer Information                         │
│    │   ├─ Generate Bill                                │
│    │   ├─ QR Code + Bill Number                        │
│    │   ├─ WhatsApp Message to Customer                 │
│    │   └─ Print/Save as PDF (SmallShopPrint.jsx)       │
│    └─ Customer Management                              │
│        ├─ View Customer List                           │
│        ├─ Create Offers                                │
│        ├─ Send Individual Offers (WhatsApp)            │
│        ├─ Broadcast to Customer Segments               │
│        └─ Track Previous Purchases                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 Required Routes (React Router)

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/smallshop-register" element={<SmallshopOwnerRegister />} />
  <Route path="/smallshop-login" element={<SmallshopLogin />} />
  
  {/* Protected Routes */}
  <Route path="/smallshop-dashboard" element={<SmallshopDashboard />} />
  
  {/* Additional Pages */}
  <Route path="/smallshop-print/:billId" element={<SmallShopPrint />} />
</Routes>
```

---

## 💾 Database Collections Required

### 1. **ShopOwners**
```javascript
{
  _id: ObjectId,
  ownerName: String,
  shopName: String,
  mobile: String (unique),
  email: String,
  shopAddress: String,
  city: String,
  area: String,
  gst: String,
  password: String (hashed),
  whatsappNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Products**
```javascript
{
  _id: ObjectId,
  shopId: ObjectId (ref: ShopOwners),
  productName: String,
  sku: String,
  category: String,
  price: Number,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Bills**
```javascript
{
  _id: ObjectId,
  shopId: ObjectId (ref: ShopOwners),
  billNumber: String (unique),
  customerName: String,
  customerPhone: String,
  items: [
    {
      productId: ObjectId,
      productName: String,
      price: Number,
      quantity: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  date: Date,
  createdAt: Date
}
```

### 4. **Customers**
```javascript
{
  _id: ObjectId,
  shopId: ObjectId (ref: ShopOwners),
  name: String,
  phone: String,
  totalPurchase: Number (aggregate),
  visitCount: Number,
  purchaseLevel: String (gold/silver/bronze),
  lastPurchaseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. **Offers**
```javascript
{
  _id: ObjectId,
  shopId: ObjectId (ref: ShopOwners),
  offerName: String,
  description: String,
  discount: Number,
  minPurchase: Number,
  validUntil: Date,
  status: String (active/inactive),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

- **Session**: localStorage stores `shopMobile`, `shopId`, `authToken`
- **Protected Routes**: Check token before accessing dashboard
- **API Headers**: All requests include `Authorization: Bearer {token}`

---

## 📞 WhatsApp Integration Requirements

**Services Needed:**
1. WhatsApp Business API or Twilio integration
2. API endpoint: `POST /api/whatsapp/send`

**Message Format:**
```
✅ Thank you for shopping at [Shop Name]!
📋 Bill Number: [Bill#]
💰 Total: ₹[Amount]
📞 Call: [Phone]
```

**For Offers:**
```
🎉 Special Offer from [Shop Name]!
📢 [Offer Name]
💬 [Description]
🏷️ Discount: [Discount]% OFF
📍 Come visit us today!
```

---

## 🎯 Key Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| One-way Registration | ✅ | SmallshopOnerregister.jsx |
| One-way Login | ✅ | SmallshopLogin.jsx |
| Profile View | ✅ | SmallshopDashbord.jsx |
| Product Add (One-time) | ✅ | ProductManagement.jsx |
| Filter Products | ✅ | ProductManagement.jsx |
| Edit Prices | ✅ | ProductManagement.jsx |
| Billing System | ✅ | BillingPage.jsx |
| Total Display | ✅ | BillingPage.jsx |
| WhatsApp Messages | ✅ | BillingPage.jsx |
| QR Code | ✅ | BillingPage.jsx + SmallShopPrint.jsx |
| PDF Bill Printing | ✅ | SmallShopPrint.jsx |
| Customer Management | ✅ | CustomerManagement.jsx |
| Offers Creation | ✅ | CustomerManagement.jsx |
| Broadcast Offers | ✅ | CustomerManagement.jsx |
| WhatsApp Offers | ✅ | CustomerManagement.jsx |
| Customer Segmentation | ✅ | CustomerManagement.jsx |
| Previous Purchase Tracking | ✅ | CustomerManagement.jsx |

---

## 🚀 Implementation Steps

1. **Backend Setup**
   - Create API endpoints for all modules
   - Setup database collections
   - Implement WhatsApp integration

2. **Frontend Installation**
   ```bash
   npm install qrcode.react
   npm install html2pdf.js (for PDF generation)
   ```

3. **Routing Setup**
   - Add routes to main App.js/App.jsx
   - Setup route protection/guards

4. **Testing**
   - Test registration flow
   - Test product management
   - Test billing workflow
   - Test WhatsApp integration

5. **Deployment**
   - Setup environment variables
   - Configure WhatsApp API keys
   - Deploy frontend & backend

---

## 📝 Notes

- All components use axios for API calls
- Error handling is implemented throughout
- Loading states prevent double-submission
- Responsive design for mobile, tablet, desktop
- QR code contains full bill data in JSON format
- Product prices are editable anytime
- Customer data is auto-created from bills
- Offer broadcasts target specific customer segments

---

## 🔧 Customization Options

1. **Discount Levels**: Modify customer tiers (gold/silver/bronze) based on your criteria
2. **Categories**: Add/remove product categories in the select dropdown
3. **QR Code**: Modify QR data structure as needed
4. **Bill Layout**: Customize bill format in SmallShopPrint.jsx
5. **Tax Rate**: Change GST from 18% to your requirement
6. **WhatsApp Messages**: Modify message templates

---

## 📧 Support

For issues or modifications needed, refer to component files or API documentation.

**Last Updated:** April 2026
