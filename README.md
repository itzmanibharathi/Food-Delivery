```markdown
# Food Delivery Management System  
**Real-time Admin Dashboard + Food Management Panel**  
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

---

## Project Overview

This is a **real-time food delivery admin system** built using **HTML, CSS, JavaScript, and Firebase Realtime Database**. It allows:

- **Admins** to:
  - Monitor live orders
  - View revenue & stats
  - Track delivery status
  - See customer ratings & feedback
  - Manage cancellation timers
- **Add new food items** with name, price, restaurant, and image

> **Live sync**: All data updates in **real time** across all devices — no refresh needed!

---

## Features

| Feature | Description |
|-------|-----------|
| **Live Order Dashboard** | Real-time updates for new, pending, and delivered orders |
| **Smart Timer** | Shows cancellation window: **2 min (Cash)**, **10 min (Online)** |
| **Revenue Tracking** | Auto-calculates total earnings from delivered orders |
| **Add Food Items** | Form to add menu items with image URL |
| **Responsive Design** | Works on desktop, tablet, and mobile |
| **Secure Firebase Integration** | Uses Realtime Database with modular imports |

---

## Project Structure

```
food-delivery-admin/
│
├── Admin.html          → Main admin dashboard
├── addfood.html        → Add new food item page
├── admin.js            → Real-time order monitoring logic
├── addFood.js          → Submit new food to Firebase
├── firebase.js         → Firebase config & DB initialization
├── styles.css          → Modern, responsive UI styles
└── README.md           → You're here!
```

---

## How It Works

### 1. **Add Food (`addfood.html`)**
- Fill form: Name, Price, Hotel, Image URL
- Click **"Add Food"**
- Data saved instantly to Firebase `foods` node
- Success alert + form reset

### 2. **Admin Dashboard (`Admin.html`)**
- Auto-loads all orders from `orders` node
- Updates **live** when:
  - New order arrives
  - Status changes
  - Rating/feedback added
- Shows:
  - Total Orders
  - Delivered vs Pending
  - Total Revenue
  - Per-order timer (counts down)

---

## Firebase Database Structure

```json
{
  "foods": {
    "food_1": {
      "name": "Cheese Burger",
      "price": 8.99,
      "hotelName": "Burger King",
      "imageUrl": "https://example.com/burger.jpg"
    }
  },
  "orders": {
    "order_1": {
      "customerName": "Alex Smith",
      "items": [
        { "name": "Pizza", "hotelName": "Pizza Hut" }
      ],
      "total": 25.50,
      "status": "Delivered",
      "paymentMethod": "online",
      "createdAt": 1736000000000,
      "rating": 5,
      "feedback": "Fast delivery!"
    }
  }
}
```

---

## Setup Instructions

### Step 1: Clone the Project
```bash
git clone https://github.com/yourusername/food-delivery-admin.git
cd food-delivery-admin
```

### Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Realtime Database** (start in test mode)
4. Copy config and replace in `firebase.js`

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456"
};
```

### Step 3: Run Locally

Open files directly in browser:
```bash
# Just double-click these files
open Admin.html
open addfood.html
```

Or use a local server:
```bash
npx serve
# or
python -m http.server 8000
```

---

## Security Rules (Recommended)

```js
{
  "rules": {
    "foods": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "orders": {
      ".read": "auth != null",
      ".write": true   // Allow users to place orders
    }
  }
}
```

> **Warning**: For demo, you can temporarily allow public read:
> ```js
> ".read": true
> ```
> But **never in production**!

---

## Screenshots

### Admin Dashboard
![Dashboard](https://via.placeholder.com/1200x600.png?text=Live+Admin+Dashboard)

### Add Food Form
![Add Food](https://via.placeholder.com/600x500.png?text=Add+Food+Item+Form)

---

## Future Improvements

- [ ] Admin login (Firebase Auth)
- [ ] Update order status from dashboard
- [ ] Image upload via Firebase Storage
- [ ] Search & filter orders
- [ ] Export data to CSV
- [ ] Dark mode toggle
- [ ] User-side ordering page

---

## Contributing

We welcome contributions!

1. Fork the repo
2. Create your branch: `git checkout -b feature/new-ui`
3. Commit: `git commit -m 'Add new feature'`
4. Push: `git push origin feature/new-ui`
5. Open a Pull Request

---


## Author

**MANIBHARATHI A**  
[GitHub](https://github.com/itzmanibharathi) | [Email](amanibharathi2006@gmail.com)

---

**Star this project if you like it!**  
Built with Firebase + JS
```

---

### Next Steps:
1. Replace placeholder images with real screenshots
2. Add `LICENSE` file (MIT)
3. Deploy live demo on **Netlify** or **Vercel**
4. Build the **user ordering page** (if needed)

**Want me to generate the user-side ordering page next?** Just say the word!
```
