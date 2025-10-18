# 🚗 CarBnB - Car Rental & Carpooling Platform

A modern, full-stack car rental and carpooling platform built with **Node.js**, **Express**, and **Supabase** (PostgreSQL). Features include car listings with photo uploads, real-time booking management, carpool trip creation, seller/renter dashboards, and simulated payment flows.

---

## ✨ Features

### 🚙 Car Rental
- **Browse & Search**: Filter cars by location, price, seats, fuel type, and transmission
- **Photo Upload**: Upload multiple photos for car listings with Supabase Storage
- **Real-time Availability**: Smart booking system prevents double-bookings
- **Booking Management**: Create, view, and cancel bookings with status tracking
- **Simulated Payment**: QR code payment modal with status transitions

### 🚕 Carpooling
- **Create Trips**: Drivers can host carpool rides with date, time, and pricing
- **Book Seats**: Passengers can search and book available carpool seats
- **Trip Management**: View hosted trips with revenue tracking and passenger details
- **Automatic Seat Updates**: Real-time seat availability management

### 📊 Dashboards
- **Renter Dashboard**: View bookings, carpool rides, and spending analytics
- **Seller Dashboard**: Manage car listings, view booking requests, track revenue
- **Quick Stats**: Total bookings, active rentals, revenue metrics
- **SOS Emergency**: Quick access emergency assistance button

### 🎨 UI/UX
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions
- **Card Hover Effects**: Smooth transitions and animations

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- A Supabase account and project
- npm or yarn

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (or use existing project)
3. Go to the **SQL Editor** in your Supabase dashboard
4. Run the schema file `backend/seed/schema.sql` to create all tables:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role TEXT CHECK (role IN ('rentee', 'seller')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table (with photo support)
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    variant VARCHAR(50),
    year INT,
    seats INT,
    price_per_day DECIMAL(10,2) NOT NULL,
    fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
    transmission TEXT CHECK (transmission IN ('Manual', 'Automatic')),
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photos TEXT[] DEFAULT '{}',
    primary_photo TEXT
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    rentee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10,2),
    status TEXT CHECK (status IN ('pending','confirmed','completed','cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carpool trips table
CREATE TABLE carpool_trips (
    id SERIAL PRIMARY KEY,
    driver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    from_city VARCHAR(100) NOT NULL,
    to_city VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    seats INT NOT NULL,
    available_seats INT NOT NULL,
    price_per_seat DECIMAL(10,2) NOT NULL,
    car_desc VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carpool bookings table
CREATE TABLE carpool_bookings (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES carpool_trips(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seats INT NOT NULL,
    price_total DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending','confirmed','cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> 💡 **Tip**: Full schema with all tables is in `backend/seed/schema.sql`

### 3. Set Up Supabase Storage (For Photo Uploads)

1. In your Supabase project, go to **Storage**
2. Click **New bucket**
3. Create a bucket named `car-photos`
4. Set the bucket to **Public** (so photos are accessible)
5. Go to **Policies** and add a policy to allow:
   - `SELECT` (read): Public access
   - `INSERT` (upload): Authenticated users only (or public for testing)

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
PORT=3000
NODE_ENV=development
```

**To get your Supabase credentials:**
- Go to **Project Settings → API** in Supabase dashboard
- Copy the **Project URL** (SUPABASE_URL)
- Copy the **anon/public key** (SUPABASE_ANON_KEY)

### 5. Seed the Database (Optional)

To populate your database with sample data:

```bash
node backend/seed/supabase-seed.js
```

This will create:
- 10 sample sellers
- 100 cars with auto-assigned Unsplash photos
- Realistic Indian car data (Maruti, Hyundai, Tata, etc.)

### 6. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

### 7. Access the Application

Open your browser and navigate to:
- **Homepage**: `http://localhost:3000`
- **Login**: `http://localhost:3000/login.html`
- **Car Listing**: `http://localhost:3000/car-listing.html`
- **Dashboard**: `http://localhost:3000/dashboard.html`
- **Carpool**: `http://localhost:3000/carpool.html`

---

## 🛠️ Tech Stack

- **Backend**: Node.js (v14+), Express.js
- **Database**: Supabase (PostgreSQL) with automatic backups
- **Storage**: Supabase Storage (for car photos)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Tailwind CSS
- **Icons**: Lucide Icons
- **Styling**: Tailwind CSS (via CDN), Custom dark mode
- **Hosting**: Supabase (Database + Storage), Any Node.js host (Backend)

---

## � How to Use

### For Renters (Customers):
1. **Sign Up**: Create account as "Renter"
2. **Browse Cars**: Search and filter cars on homepage
3. **Book a Car**: Select dates, view payment QR, confirm booking
4. **View Dashboard**: Track bookings, spending, and carpool rides
5. **Join Carpool**: Search for carpool trips and book seats

### For Sellers (Car Owners):
1. **Sign Up**: Create account as "Owner"
2. **List Your Car**: Fill car details, upload photos
3. **Manage Listings**: View and edit your cars in dashboard
4. **Track Bookings**: See booking requests and revenue
5. **Host Carpool**: Create carpool trips and manage passengers

---

## 🎨 UI Features

- **🌙 Dark Mode**: Toggle between light/dark themes
- **📱 Responsive**: Mobile-friendly design
- **🔔 Toast Notifications**: Real-time feedback
- **💳 Payment Modal**: Simulated QR payment with status
- **🆘 SOS Button**: Emergency assistance access
- **📊 Quick Stats**: Dashboard analytics cards
- **🖼️ Photo Gallery**: Multiple car photos with preview
- **🔍 Smart Search**: Filter by location, price, features

---

## 🔒 Security Notes

- ✅ Environment variables for sensitive data
- ✅ `.env` file is gitignored
- ⚠️ Passwords stored as plain text (add bcrypt hashing for production)
- ⚠️ No JWT authentication (consider implementing for production)
- ✅ SQL injection prevention via Supabase SDK
- ⚠️ No rate limiting (add for production)

### 🚨 For Production:
1. Add password hashing (bcrypt)
2. Implement JWT authentication
3. Add Row Level Security (RLS) policies in Supabase
4. Enable rate limiting
5. Add input validation and sanitization
6. Use HTTPS only
7. Implement CSRF protection

---

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - ✅ Make sure `.env` file exists in project root
   - ✅ Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
   - ✅ Restart server after updating `.env`

2. **Database connection errors**
   - ✅ Verify Supabase project is active (not paused)
   - ✅ Check if API keys are correct (no extra spaces)
   - ✅ Ensure tables are created in Supabase SQL Editor
   - ✅ Test with `node test-supabase.js`
   - ✅ Run full test suite: `node test-comprehensive.js`

3. **Photos not uploading**
   - ✅ Create `car-photos` bucket in Supabase Storage
   - ✅ Set bucket to **Public**
   - ✅ Add storage policies for read/write access
   - ✅ Check browser console for errors

4. **CORS errors**
   - ✅ Server has CORS enabled by default (`cors` middleware)
   - ✅ Check if frontend is accessing correct backend URL
   - ✅ Ensure backend is running on port 3000

5. **Dashboard not showing cars**
   - ✅ Seed database with `node backend/seed/supabase-seed.js`
   - ✅ Check if user is logged in (check localStorage)
   - ✅ Verify API endpoint returns data: `http://localhost:3000/api/cars`
   - ✅ Check browser console for API errors

6. **"Cannot find module '@supabase/supabase-js'"**
   - ✅ Run `npm install` to install dependencies
   - ✅ Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Debug Tips:
- Check browser console (F12) for frontend errors
- Check terminal for backend errors
- Use `console.log()` to inspect data
- Test API endpoints with Postman or curl
- Check Supabase dashboard logs (Logs & Reports)

---

## � Additional Resources

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Storage**: [supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)
- **PostgreSQL Docs**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Express.js Guide**: [expressjs.com](https://expressjs.com/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)

---

## �📄 License

ISC License - Feel free to use this project for learning and development.

