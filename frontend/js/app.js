// Dummy data for cars (used as fallback when API is unavailable) — India based
const carsDataFallback = [
    {
        id: 1,
        model: "Hyundai Creta",
        brand: "Hyundai",
        year: 2024,
        price: 2800,
        location: "Bengaluru, Karnataka",
        image: "https://images.unsplash.com/photo-1628336708416-cb7a0b7b7b35?w=400&h=300&fit=crop",
        available: true,
        rating: 4.8,
        features: ["Android Auto", "Sunroof", "Automatic"],
        owner: "Rahul Verma",
        fuel: "Petrol"
    },
    {
        id: 2,
        model: "Maruti Suzuki Swift",
        brand: "Maruti Suzuki",
        year: 2023,
        price: 1800,
        location: "Mumbai, Maharashtra",
        image: "https://images.unsplash.com/photo-1605559424843-9e4f38632721?w=400&h=300&fit=crop",
        available: true,
        rating: 4.5,
        features: ["Bluetooth", "ABS", "Manual"],
        owner: "Neha Sharma",
        fuel: "Petrol"
    },
    {
        id: 3,
        model: "Tata Nexon EV",
        brand: "Tata",
        year: 2024,
        price: 3200,
        location: "New Delhi, Delhi",
        image: "https://images.unsplash.com/photo-1593941707874-ef25b8b494a7?w=400&h=300&fit=crop",
        available: false,
        rating: 4.7,
        features: ["Fast Charging", "Connected Car", "Automatic"],
        owner: "Arjun Singh",
        fuel: "Electric"
    },
    {
        id: 4,
        model: "Toyota Innova Crysta",
        brand: "Toyota",
        year: 2022,
        price: 3500,
        location: "Hyderabad, Telangana",
        image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop",
        available: true,
        rating: 4.6,
        features: ["7 Seater", "AC", "Diesel"],
        owner: "Priya Iyer",
        fuel: "Diesel"
    },
    {
        id: 5,
        model: "Honda City",
        brand: "Honda",
        year: 2023,
        price: 2600,
        location: "Pune, Maharashtra",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
        available: true,
        rating: 4.6,
        features: ["Cruise Control", "Apple CarPlay", "Automatic"],
        owner: "Aman Gupta",
        fuel: "Petrol"
    },
    {
        id: 6,
        model: "Mahindra Thar",
        brand: "Mahindra",
        year: 2024,
        price: 4000,
        location: "Jaipur, Rajasthan",
        image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=300&fit=crop",
        available: true,
        rating: 4.9,
        features: ["4x4", "Convertible", "Diesel"],
        owner: "Rohit Jain",
        fuel: "Diesel"
    },
    {
        id: 7,
        model: "Kia Seltos",
        brand: "Kia",
        year: 2022,
        price: 2500,
        location: "Chennai, Tamil Nadu",
        image: "https://images.unsplash.com/photo-1626899798511-8e3f3e5539d3?w=400&h=300&fit=crop",
        available: true,
        rating: 4.4,
        features: ["Ventilated Seats", "UVO Connect", "Automatic"],
        owner: "Divya Krishnan",
        fuel: "Petrol"
    },
    {
        id: 8,
        model: "Skoda Kushaq",
        brand: "Skoda",
        year: 2023,
        price: 2700,
        location: "Kolkata, West Bengal",
        image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop",
        available: true,
        rating: 4.5,
        features: ["Turbo", "ESP", "Manual"],
        owner: "Ananya Bose",
        fuel: "Petrol"
    }
];

// Dummy data for bookings (fallback)
const bookingsData = [
    {
        id: 1,
        carId: 1,
        userId: "user123",
        startDate: "2025-01-15",
        endDate: "2025-01-18",
        totalPrice: 8650,
        status: "confirmed",
        pickupLocation: "Bengaluru Airport (BLR)"
    },
    {
        id: 2,
        carId: 3,
        userId: "user123",
        startDate: "2025-02-01",
        endDate: "2025-02-03",
        totalPrice: 6800,
        status: "completed",
        pickupLocation: "Connaught Place, New Delhi"
    }
];

// Dummy data for carpool trips (fallback)
const carpoolData = [
    {
        id: 1,
        driverId: "driver1",
        driverName: "Aakash Mehta",
        from: "Bengaluru",
        to: "Mysuru",
        date: "2025-01-20",
        time: "08:00",
        seats: 3,
        availableSeats: 2,
        pricePerSeat: 500,
        car: "Maruti Baleno",
        stops: ["Ramanagara", "Maddur"],
        driverRating: 4.8
    },
    {
        id: 2,
        driverId: "driver2",
        driverName: "Sana Khan",
        from: "Mumbai",
        to: "Pune",
        date: "2025-01-22",
        time: "14:30",
        seats: 4,
        availableSeats: 1,
        pricePerSeat: 450,
        car: "Hyundai i20",
        stops: ["Lonavala"],
        driverRating: 4.9
    },
    {
        id: 3,
        driverId: "driver3",
        driverName: "Rajat Bose",
        from: "Kolkata",
        to: "Digha",
        date: "2025-01-25",
        time: "10:15",
        seats: 4,
        availableSeats: 3,
        pricePerSeat: 400,
        car: "Tata Tiago",
        stops: [],
        driverRating: 4.7
    }
];

// Global cars state used by multiple pages. Initialized with fallback.
let carsData = carsDataFallback.slice();
let allCarsData = carsDataFallback.slice();

// Try to load cars from backend API; fallback to local data on failure
async function loadCarsFromApi() {
    try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error?.message || 'API returned error');
        }
        const apiCars = await response.json();
        
        // Check if we got real data from Supabase
        if (!Array.isArray(apiCars)) {
            throw new Error('Invalid API response');
        }
        
        if (apiCars.length === 0) {
            console.warn('⚠️ No cars in database. Using demo data. Run backend/seed/seed.sql in Supabase SQL Editor.');
            carsData = carsDataFallback.map(c => ({ ...c, fromDb: false }));
            allCarsData = carsData.slice();
            showToast('⚠️ Database empty - showing demo cars. Add real data via Supabase SQL Editor.', 'warning', 4000);
            return;
        }
        
        // Map backend fields to frontend shape
        carsData = apiCars.map((c) => ({
            id: c.id ?? c.car_id ?? Math.random(),
            model: c.model ?? 'Unknown Model',
            brand: c.make ?? c.brand ?? '—',
            year: c.year ?? new Date().getFullYear(),
            price: typeof c.price_per_day !== 'undefined' ? Number(c.price_per_day) : (c.price ?? 0),
            location: (c.city && c.state) ? `${c.city}, ${c.state}` : (c.city || c.state || c.location || ''),
            image: c.primary_photo || (Array.isArray(c.photos) && c.photos.length > 0 ? c.photos[0] : (c.image_url ?? c.image ?? 'https://images.unsplash.com/photo-1549921296-3fd62cf4a6ea?w=800&h=600&fit=crop')),
            photos: Array.isArray(c.photos) ? c.photos : [],
            available: typeof c.available === 'boolean' ? c.available : true,
            rating: c.rating ?? 4.8,
            features: Array.isArray(c.features) ? c.features : ["Air Conditioning", "Bluetooth"],
            owner: c.seller_name ?? c.owner ?? 'Host',
            fuel: (c.fuel_type ? String(c.fuel_type).charAt(0).toUpperCase() + String(c.fuel_type).slice(1) : (c.fuel ?? 'Petrol')),
            fromDb: true
        }));
        allCarsData = carsData.slice();
        console.log(`✅ Loaded ${carsData.length} cars from Supabase`);
    } catch (e) {
        console.error('❌ Failed to load cars from API:', e.message);
        console.warn('⚠️ Using fallback demo data (8 hardcoded cars)');
        console.log('💡 Fix: Check Supabase credentials in .env and run test-supabase.js');
        carsData = carsDataFallback.map(c => ({ ...c, fromDb: false }));
        allCarsData = carsData.slice();
        showToast('⚠️ Cannot connect to database. Showing demo cars. Check console for details.', 'error', 5000);
    }
}

// Dark mode functionality (frontend only)
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark', savedTheme === 'dark');

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Render cars on home page
function renderCars() {
    const carGrid = document.getElementById('carGrid');
    if (!carGrid) return;

    carGrid.innerHTML = carsData.map(car => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md card-hover overflow-hidden">
            <div class="relative">
                <img src="${car.image}" alt="${car.model}" class="w-full h-48 object-cover">
                <div class="absolute top-3 right-3">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${car.available ? 'Available' : 'Booked'}
                    </span>
                </div>
                <div class="absolute top-3 left-3">
                    <span class="px-2 py-1 text-xs font-semibold bg-black bg-opacity-50 text-white rounded-full">
                        ${car.fuel}
                    </span>
                </div>
                ${car.photos && car.photos.length > 1 ? `<div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    ${car.photos.map((url, idx) => `<img src="${url}" alt="${car.model} photo ${idx+1}" class="w-8 h-8 object-cover rounded border border-gray-300">`).join('')}
                </div>` : ''}
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-lg font-semibold text-gray-800 dark:text-white">${car.model}</h4>
                    <div class="flex items-center space-x-1">
                        <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                        <span class="text-sm text-gray-600 dark:text-gray-400">${car.rating}</span>
                    </div>
                </div>
                ${car.location ? `<p class="text-gray-600 dark:text-gray-400 text-sm mb-2">${car.location}</p>` : ''}
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${car.year} • ${car.brand}</p>
                
                <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-primary-600">
                        ₹${car.price.toLocaleString('en-IN')}<span class="text-sm text-gray-600 dark:text-gray-400 font-normal">/day</span>
                    </div>
                    <button onclick="bookCar(${car.id})" class="px-4 py-2 gradient-bg text-white rounded-lg font-medium hover:opacity-90 transition-opacity ${!car.available ? 'opacity-50 cursor-not-allowed' : ''}" ${!car.available ? 'disabled' : ''}>
                        ${car.available ? 'Book Now' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// Book car function
function bookCar(carId) {
    // Single source of truth: check here only
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    if (!isLoggedIn || !userId) {
        // Preserve intent and send back after login
        localStorage.setItem('postLoginRedirect', JSON.stringify({ action: 'book', carId }));
        showToast('Please login to book a car.', 'warning');
        window.location.href = 'login.html';
        return;
    }
    const car = carsData.find(c => c.id === carId);
    if (car && car.available) {
        if (!car.fromDb) {
            showToast('This demo car is not in the database. Please list a car or seed data.', 'warning');
            return;
        }
        localStorage.setItem('selectedCar', JSON.stringify(car));
        window.location.href = 'booking.html';
    }
}

// Initialize page content
document.addEventListener('DOMContentLoaded', async () => {
    await loadCarsFromApi();
    renderCars();
    renderAuthBanner();

    // Search wiring on home page
    const searchInput = document.getElementById('searchLocation');
    const searchBtn = document.getElementById('searchCarsBtn');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyCarFilters();
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyCarFilters();
        });
    }

    // Gate "List Your Car" nav for owners only
    const listNav = document.getElementById('listYourCarNav');
    if (listNav) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('userRole');
        if (isLoggedIn && (role === 'owner' || role === 'seller')) {
            listNav.classList.remove('cursor-not-allowed', 'pointer-events-none', 'text-gray-400', 'dark:text-gray-500');
            listNav.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:text-primary-600', 'dark:hover:text-primary-400');
        } else {
            listNav.addEventListener('click', (e) => { e.preventDefault(); showToast('Login as an owner to list your car.', 'warning'); window.location.href = 'login.html'; });
        }
    }

    // Hide Login link if logged in
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    loginLinks.forEach((link) => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            link.classList.add('hidden');
        } else {
            link.classList.remove('hidden');
        }
    });
    // If we have an immediate booking intent after login, execute it
    const intentCarId = localStorage.getItem('intentCarId');
    if (intentCarId) {
        localStorage.removeItem('intentCarId');
        const idNum = Number(intentCarId);
        if (Number.isFinite(idNum)) {
            bookCar(idNum);
        }
    }
});


// --- Payment Modal Logic for Booking Page ---
if (window.location.pathname.endsWith('booking.html')) {
    // Patch handleBooking to show payment modal
    window.handleBooking = async function(event) {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) { showToast('Please login to book a car.', 'error'); return; }

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const pickupLocation = event.target.querySelector('select').value;
        const total = Number(document.getElementById('totalPrice').textContent || '0');
        if (!startDate || !endDate || !total) { showToast('Please select valid dates.', 'error'); return; }

        // Show payment modal instead of booking immediately
        showPaymentModal({
            car_id: JSON.parse(localStorage.getItem('selectedCar')).id,
            rentee_id: Number(userId),
            start_date: startDate,
            end_date: endDate,
            total_price: total,
            pickup_location: pickupLocation
        });
    };

    function showPaymentModal(bookingData) {
        const modal = document.getElementById('paymentModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        // Reset status
        document.getElementById('paymentStatus').innerHTML = '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>';
        // Wire up continue button
        document.getElementById('continuePaymentBtn').onclick = async function() {
            // Simulate payment: update status to paid (green)
            document.getElementById('paymentStatus').innerHTML = '<span class="bg-green-100 text-green-800 px-2 py-1 rounded">Paid</span>';
            // Wait a moment for effect
            await new Promise(r => setTimeout(r, 700));
            closePaymentModal();
            // Actually book the car now
            try {
                const resp = await fetch('/api/bookings', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData)
                });
                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    throw new Error(err?.error?.message || 'Failed to create booking');
                }
                showToast('Your car booking is confirmed.', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
            } catch (e) {
                showToast(e.message || 'Booking failed', 'error');
            }
        };
    }

    window.closePaymentModal = function() {
        const modal = document.getElementById('paymentModal');
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };
}

// Utility functions for other pages
function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
        });
}

function formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
        });
}


// Apply filters to cars list on homepage
function applyCarFilters() {
    const searchInput = document.getElementById('searchLocation');
    const query = (searchInput?.value || '').trim().toLowerCase();
    let filtered = allCarsData.slice();
    if (query) {
        filtered = filtered.filter(c =>
            c.location.toLowerCase().includes(query) ||
            c.model.toLowerCase().includes(query) ||
            c.brand.toLowerCase().includes(query)
        );
    }
    carsData = filtered;
    renderCars();
}

// ---- Toast notifications (site-wide) ----
function ensureToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-3 w-[90%] sm:w-auto';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'success', duration = 1600) {
    const container = ensureToastContainer();
    const colors = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-500 text-gray-900',
        info: 'bg-gray-800 text-white'
    };
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-lg shadow-lg ${colors[type] || colors.info} animate-fade-in`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-0');
        toast.classList.add('transition-opacity');
        toast.classList.add('duration-300');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ---- Auth banner (global) ----
function renderAuthBanner() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let banner = document.getElementById('authBanner');
    if (isLoggedIn) {
        if (banner) banner.remove();
        return;
    }
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'authBanner';
        banner.className = 'w-full bg-yellow-100 text-yellow-900 text-sm text-center py-2';
        banner.innerHTML = 'You are not signed in. <a href="login.html" class="underline font-medium">Sign in</a> to book or list cars.';
        const nav = document.querySelector('nav');
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(banner, nav.nextSibling);
        } else {
            document.body.prepend(banner);
        }
    }
}


