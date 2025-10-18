require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { supabase } = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend
const frontendDir = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendDir));

// ---------- Helpers ----------
function sendError(res, status, message, details) {
    if (details) {
        // Log server-side for debugging
        console.error(`[API ERROR] ${message}:`, details);
    }
    res.status(status).json({ error: { message, details } });
}

// ---------- Users ----------
app.post("/api/users/signup", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        let { role } = req.body;
        if (!name || !email || !password || !role) {
            return sendError(res, 400, "Missing required fields");
        }
        // Normalize role to DB enum values
        const roleMap = { owner: 'seller', renter: 'rentee', seller: 'seller', rentee: 'rentee' };
        role = roleMap[String(role).toLowerCase()];
        if (!role) return sendError(res, 400, "Invalid role (use 'owner'/'renter')");
        
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, phone: phone || null, password, role }])
            .select()
            .single();
        
        if (error) {
            if (error.code === '23505') { // Unique violation
                return sendError(res, 409, "Email already registered");
            }
            throw error;
        }
        
        res.json({ id: data.id, message: "User registered successfully" });
    } catch (err) {
        sendError(res, 500, "Failed to signup", err.message);
    }
});

app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return sendError(res, 400, "Missing credentials");
        
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, phone, role, created_at')
            .eq('email', email)
            .eq('password', password)
            .single();
        
        if (error || !data) {
            return sendError(res, 401, "Invalid credentials");
        }
        
        res.json({ user: data });
    } catch (err) {
        sendError(res, 500, "Failed to login", err.message);
    }
});

app.get("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, phone, role, created_at')
            .eq('id', id)
            .single();
        
        if (error || !data) {
            return sendError(res, 404, "User not found");
        }
        
        res.json(data);
    } catch (err) {
        sendError(res, 500, "Failed to fetch user", err.message);
    }
});

// ---------- Cars ----------
app.post("/api/cars", async (req, res) => {
    try {
    const { seller_id, make, model, variant, year, seats, price_per_day, photos, primary_photo } = req.body;
    let { fuel_type, transmission, city, state } = req.body;
        if (!seller_id || !make || !model || !year || !seats || !price_per_day || !fuel_type || !transmission) {
            return sendError(res, 400, "Missing required fields");
        }
        // Normalize enum/case values to satisfy DB CHECK constraints
        const fuelMap = {
            petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid',
            Petrol: 'Petrol', Diesel: 'Diesel', Electric: 'Electric', Hybrid: 'Hybrid'
        };
        const transMap = {
            automatic: 'Automatic', manual: 'Manual',
            Automatic: 'Automatic', Manual: 'Manual'
        };
        fuel_type = fuelMap[String(fuel_type).trim()] || fuel_type;
        transmission = transMap[String(transmission).trim()] || transmission;
        // Ensure optional strings are null if empty
        city = city ? String(city).trim() : null;
        state = state ? String(state).trim() : null;
        
        // Coerce number fields safely
        const yearNum = Number(year);
        const seatsNum = Number(seats);
        const priceNum = Number(price_per_day);
        if (!Number.isFinite(yearNum) || !Number.isFinite(seatsNum) || !Number.isFinite(priceNum)) {
            return sendError(res, 400, "Invalid numeric fields");
        }
        
        // If photos not provided, auto-assign curated Unsplash photos
        let assignedPhotos = Array.isArray(photos) ? photos : [];
        if (!assignedPhotos || assignedPhotos.length === 0) {
            // lightweight curated fallback set (same as unsplash-photos.js categories)
            const curated = {
                suv: [
                    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
                    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
                ],
                sedan: [
                    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
                ],
                hatchback: [
                    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
                    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
                ],
                electric: [
                    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
                    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'
                ],
                mpv: [
                    'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
                    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800'
                ],
                luxury: [
                    'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
                    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800'
                ]
            };

            function modelToCategory(model) {
                const m = String(model || '').toLowerCase();
                if (m.includes('creta')||m.includes('seltos')||m.includes('thar')||m.includes('xuv')||m.includes('harrier')||m.includes('safari')) return 'suv';
                if (m.includes('city')||m.includes('verna')||m.includes('camry')||m.includes('ciaz')||m.includes('octavia')) return 'sedan';
                if (m.includes('swift')||m.includes('i20')||m.includes('baleno')||m.includes('altroz')||m.includes('polo')) return 'hatchback';
                if (m.includes('ev')||m.includes('electric')||m.includes('ev6')||m.includes('zs ev')||m.includes('atto')) return 'electric';
                if (m.includes('innova')||m.includes('ertiga')||m.includes('carens')||m.includes('alczar')||m.includes('alczar')) return 'mpv';
                return 'sedan';
            }

            const category = modelToCategory(model);
            assignedPhotos = curated[category] || curated.sedan;
        }

        const { data, error } = await supabase
            .from('cars')
            .insert([{
                seller_id,
                make,
                model,
                variant: variant || null,
                year: yearNum,
                seats: seatsNum,
                price_per_day: priceNum,
                fuel_type,
                transmission,
                city,
                state,
                photos: assignedPhotos,
                primary_photo: primary_photo || (assignedPhotos && assignedPhotos.length > 0 ? assignedPhotos[0] : null)
            }])
            .select()
            .single();
        
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('[API ERROR] Failed to add car:', err.message);
        sendError(res, 500, "Failed to add car", err.message);
    }
});

// Get all photos for a car
app.get("/api/cars/:id/photos", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('cars')
            .select('photos, primary_photo')
            .eq('id', id)
            .single();
        if (error || !data) return sendError(res, 404, "Car not found");
        res.json({ photos: data.photos || [], primary_photo: data.primary_photo || null });
    } catch (err) {
        sendError(res, 500, "Failed to fetch car photos", err.message);
    }
});

// Add a photo URL to a car
app.post("/api/cars/:id/photos", async (req, res) => {
    try {
        const { id } = req.params;
        const { photo_url } = req.body;
        if (!photo_url) return sendError(res, 400, "Missing photo_url");
        // Get current photos
        const { data, error } = await supabase
            .from('cars')
            .select('photos')
            .eq('id', id)
            .single();
        if (error || !data) return sendError(res, 404, "Car not found");
        const photos = Array.isArray(data.photos) ? data.photos : [];
        photos.push(photo_url);
        // Update car
        const { error: updateError } = await supabase
            .from('cars')
            .update({ photos, primary_photo: photos[0] })
            .eq('id', id);
        if (updateError) throw updateError;
        res.json({ photos });
    } catch (err) {
        sendError(res, 500, "Failed to add car photo", err.message);
    }
});

// Delete a photo from a car by index
app.delete("/api/cars/:id/photos/:photoIndex", async (req, res) => {
    try {
        const { id, photoIndex } = req.params;
        const index = parseInt(photoIndex, 10);
        // Get current photos
        const { data, error } = await supabase
            .from('cars')
            .select('photos')
            .eq('id', id)
            .single();
        if (error || !data) return sendError(res, 404, "Car not found");
        let photos = Array.isArray(data.photos) ? data.photos : [];
        if (index < 0 || index >= photos.length) return sendError(res, 400, "Invalid photo index");
        photos.splice(index, 1);
        // Update car
        const { error: updateError } = await supabase
            .from('cars')
            .update({ photos, primary_photo: photos[0] || null })
            .eq('id', id);
        if (updateError) throw updateError;
        res.json({ photos });
    } catch (err) {
        sendError(res, 500, "Failed to delete car photo", err.message);
    }
});

app.get("/api/cars", async (req, res) => {
    try {
        const limitRaw = parseInt(req.query.limit, 10);
        const offsetRaw = parseInt(req.query.offset, 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50;
        const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
        
        const { data, error } = await supabase
            .from('cars')
            .select(`
                id, seller_id, make, model, variant, year, seats, 
                price_per_day, fuel_type, transmission, city, state, created_at,
                photos, primary_photo,
                users!inner(name, email, phone)
            `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        
        if (error) throw error;
        
        // Flatten the user data to match MySQL format
        const rows = data.map(car => ({
            ...car,
            seller_name: car.users.name,
            seller_email: car.users.email,
            seller_phone: car.users.phone,
            users: undefined
        }));
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, "Failed to fetch cars", err.message);
    }
});

app.get("/api/cars/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('cars')
            .select(`
                id, seller_id, make, model, variant, year, seats, 
                price_per_day, fuel_type, transmission, city, state, created_at,
                photos, primary_photo,
                users!inner(name, email, phone)
            `)
            .eq('id', id)
            .single();
        
        if (error || !data) {
            return sendError(res, 404, "Car not found");
        }
        
        // Flatten the user data to match MySQL format
        const car = {
            ...data,
            seller_name: data.users.name,
            seller_email: data.users.email,
            seller_phone: data.users.phone,
            users: undefined
        };
        
        res.json(car);
    } catch (err) {
        sendError(res, 500, "Failed to fetch car", err.message);
    }
});

// ---------- Diagnostics ----------
app.get("/api/health/db", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .limit(1);
        
        if (error) throw error;
        
        res.json({ db: "ok", supabase: "connected" });
    } catch (err) {
        sendError(res, 500, "DB health check failed", err.message);
    }
});

app.get("/api/cars-simple", async (req, res) => {
    try {
        const limitRaw = parseInt(req.query.limit, 10);
        const offsetRaw = parseInt(req.query.offset, 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50;
        const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
        
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
        
        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        sendError(res, 500, "Failed to fetch cars (simple)", err.message);
    }
});

app.get("/api/cars/seller/:sellerId", async (req, res) => {
    try {
        const { sellerId } = req.params;
        // Include photos and primary_photo fields in the select
        const { data, error } = await supabase
            .from('cars')
            .select('id, seller_id, make, model, variant, year, seats, price_per_day, fuel_type, transmission, city, state, created_at, photos, primary_photo')
            .eq('seller_id', sellerId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        sendError(res, 500, "Failed to fetch seller cars", err.message);
    }
});

app.delete("/api/cars/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check for active bookings
        const { data: bookings, error: checkError } = await supabase
            .from('bookings')
            .select('id')
            .eq('car_id', id)
            .in('status', ['pending', 'confirmed', 'completed']);
        
        if (checkError) throw checkError;
        
        if (bookings && bookings.length > 0) {
            return sendError(res, 409, "Car has bookings and cannot be deleted");
        }
        
        const { error: deleteError } = await supabase
            .from('cars')
            .delete()
            .eq('id', id);
        
        if (deleteError) {
            if (deleteError.code === 'PGRST116') {
                return sendError(res, 404, "Car not found");
            }
            throw deleteError;
        }
        
        res.json({ message: "Car deleted" });
    } catch (err) {
        sendError(res, 500, "Failed to delete car", err.message);
    }
});

// Available cars search
app.get("/api/cars-available", async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const make = req.query.make || "";
        const model = req.query.model || "";
        const min_seats = Number(req.query.min_seats || 1);
        const min_price = Number(req.query.min_price || 0);
        const max_price = Number(req.query.max_price || 999999);
        const limitRaw = parseInt(req.query.limit, 10);
        const offsetRaw = parseInt(req.query.offset, 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50;
        const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
        
        if (!start_date || !end_date) return sendError(res, 400, "start_date and end_date are required");
        
        // Get all cars matching basic criteria
        let query = supabase
            .from('cars')
            .select('*')
            .gte('seats', min_seats)
            .gte('price_per_day', min_price)
            .lte('price_per_day', max_price);
        
        if (make) query = query.ilike('make', `%${make}%`);
        if (model) query = query.ilike('model', `%${model}%`);
        
        const { data: cars, error: carsError } = await query.order('price_per_day', { ascending: true });
        
        if (carsError) throw carsError;
        
        // Get all conflicting bookings
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('car_id')
            .in('status', ['pending', 'confirmed'])
            .or(`end_date.gte.${start_date},start_date.lte.${end_date}`)
            .gte('end_date', start_date)
            .lte('start_date', end_date);
        
        if (bookingsError) throw bookingsError;
        
        // Filter out cars with conflicting bookings
        const bookedCarIds = new Set(bookings?.map(b => b.car_id) || []);
        const availableCars = cars.filter(car => !bookedCarIds.has(car.id));
        
        // Apply pagination
        const paginatedCars = availableCars.slice(offset, offset + limit);
        
        res.json(paginatedCars);
    } catch (err) {
        sendError(res, 500, "Failed to search available cars", err.message);
    }
});

// ---------- Bookings ----------
app.post("/api/bookings", async (req, res) => {
    try {
        const { car_id, rentee_id, start_date, end_date, total_price } = req.body;
        if (!car_id || !rentee_id || !start_date || !end_date || total_price == null) {
            return sendError(res, 400, "Missing required fields");
        }
        
        // Check if car exists
        const { data: car, error: carError } = await supabase
            .from('cars')
            .select('id')
            .eq('id', car_id)
            .single();
        
        if (carError || !car) {
            return sendError(res, 404, "Car not found");
        }
        
        // Check for overlapping bookings
        const { data: overlaps, error: overlapError } = await supabase
            .from('bookings')
            .select('id')
            .eq('car_id', car_id)
            .in('status', ['pending', 'confirmed'])
            .or(`and(end_date.gte.${start_date},start_date.lte.${end_date})`);
        
        if (overlapError) throw overlapError;
        
        if (overlaps && overlaps.length > 0) {
            return sendError(res, 409, "Car is not available for selected dates");
        }
        
        // Create booking
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                car_id,
                rentee_id,
                start_date,
                end_date,
                total_price,
                status: 'pending'
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({ id: data.id, message: "Booking created successfully" });
    } catch (err) {
        sendError(res, 500, "Failed to create booking", err.message);
    }
});

app.get("/api/bookings/rentee/:renteeId", async (req, res) => {
    try {
        const { renteeId } = req.params;
        
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id, car_id, rentee_id, start_date, end_date, total_price, status, created_at,
                cars!inner(make, model, variant, year, seats, price_per_day, fuel_type, transmission, primary_photo, photos)
            `)
            .eq('rentee_id', renteeId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Flatten the cars data
        const rows = data.map(booking => ({
            ...booking,
            make: booking.cars.make,
            model: booking.cars.model,
            variant: booking.cars.variant,
            year: booking.cars.year,
            seats: booking.cars.seats,
            price_per_day: booking.cars.price_per_day,
            fuel_type: booking.cars.fuel_type,
            transmission: booking.cars.transmission,
            primary_photo: booking.cars.primary_photo,
            photos: booking.cars.photos,
            cars: undefined
        }));
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, "Failed to fetch bookings", err.message);
    }
});

app.get("/api/bookings/seller/:sellerId", async (req, res) => {
    try {
        const { sellerId } = req.params;
        
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id, car_id, rentee_id, start_date, end_date, total_price, status, created_at,
                cars!inner(make, model, variant, seller_id, primary_photo, photos),
                users!inner(name, email)
            `)
            .eq('cars.seller_id', sellerId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Flatten the data
        const rows = data.map(booking => ({
            ...booking,
            rentee_name: booking.users.name,
            rentee_email: booking.users.email,
            make: booking.cars.make,
            model: booking.cars.model,
            variant: booking.cars.variant,
            primary_photo: booking.cars.primary_photo,
            photos: booking.cars.photos,
            cars: undefined,
            users: undefined
        }));
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, "Failed to fetch seller bookings", err.message);
    }
});

app.put("/api/bookings/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) return sendError(res, 400, "Missing status");
        
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            return sendError(res, 404, "Booking not found");
        }
        
        res.json({ message: "Status updated" });
    } catch (err) {
        sendError(res, 500, "Failed to update booking status", err.message);
    }
});

app.put("/api/bookings/:id/cancel", async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .in('status', ['pending', 'confirmed'])
            .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            return sendError(res, 404, "No pending/confirmed booking to cancel");
        }
        
        res.json({ message: "Booking cancelled" });
    } catch (err) {
        sendError(res, 500, "Failed to cancel booking", err.message);
    }
});

// POST alias for clients that cannot send PUT easily
app.post("/api/bookings/:id/cancel", async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .in('status', ['pending', 'confirmed'])
            .select();
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            return sendError(res, 404, "No pending/confirmed booking to cancel");
        }
        
        res.json({ message: "Booking cancelled" });
    } catch (err) {
        sendError(res, 500, "Failed to cancel booking", err.message);
    }
});

// ---------- Carpool ----------
// Create a carpool trip
app.post('/api/carpool/trips', async (req, res) => {
    try {
        const { driver_id, from_city, to_city, date, time, seats, price_per_seat, car_desc } = req.body;
        if (!driver_id || !from_city || !to_city || !date || !time || !seats || !price_per_seat) {
            return sendError(res, 400, 'Missing required fields');
        }
        
        const { data, error } = await supabase
            .from('carpool_trips')
            .insert([{
                driver_id,
                from_city,
                to_city,
                date,
                time,
                seats,
                available_seats: seats,
                price_per_seat,
                car_desc: car_desc || null
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        res.json({ id: data.id, message: 'Trip created' });
    } catch (err) {
        sendError(res, 500, 'Failed to create trip', err.message);
    }
});

// List/search carpool trips
app.get('/api/carpool/trips', async (req, res) => {
    try {
        const from = (req.query.from_city || '').trim();
        const to = (req.query.to_city || '').trim();
        const date = (req.query.date || '').trim();
        const limitRaw = parseInt(req.query.limit, 10);
        const offsetRaw = parseInt(req.query.offset, 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50;
        const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
        
        let query = supabase
            .from('carpool_trips')
            .select(`
                *,
                users!inner(name)
            `)
            .gt('available_seats', 0);
        
        if (from) query = query.ilike('from_city', `%${from}%`);
        if (to) query = query.ilike('to_city', `%${to}%`);
        if (date) query = query.eq('date', date);
        
        const { data, error } = await query
            .order('date', { ascending: true })
            .order('time', { ascending: true })
            .range(offset, offset + limit - 1);
        
        if (error) throw error;
        
        // Flatten the user data
        const rows = data.map(trip => ({
            ...trip,
            driver_name: trip.users.name,
            users: undefined
        }));
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, 'Failed to fetch trips', err.message);
    }
});

// Book a seat on a trip
app.post('/api/carpool/bookings', async (req, res) => {
    try {
        const { trip_id, user_id, seats } = req.body;
        const seatsNum = Number(seats || 1);
        if (!trip_id || !user_id || !seatsNum) {
            return sendError(res, 400, 'Missing required fields');
        }
        
        // Get trip details
        const { data: trip, error: tripError } = await supabase
            .from('carpool_trips')
            .select('id, available_seats, price_per_seat')
            .eq('id', trip_id)
            .single();
        
        if (tripError || !trip) {
            return sendError(res, 404, 'Trip not found');
        }
        
        if (trip.available_seats < seatsNum) {
            return sendError(res, 409, 'Not enough seats available');
        }
        
        const priceTotal = Number(trip.price_per_seat) * seatsNum;
        
        // Create booking
        const { data: booking, error: bookingError } = await supabase
            .from('carpool_bookings')
            .insert([{
                trip_id,
                user_id,
                seats: seatsNum,
                price_total: priceTotal,
                status: 'confirmed'
            }])
            .select()
            .single();
        
        if (bookingError) throw bookingError;
        
        // Update available seats
        const { error: updateError } = await supabase
            .from('carpool_trips')
            .update({ available_seats: trip.available_seats - seatsNum })
            .eq('id', trip_id);
        
        if (updateError) throw updateError;
        
        res.json({ id: booking.id, message: 'Seat booked' });
    } catch (err) {
        sendError(res, 500, 'Failed to book seat', err.message);
    }
});

// Get carpool bookings for a user
app.get('/api/carpool/bookings/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const { data, error } = await supabase
            .from('carpool_bookings')
            .select(`
                id, seats, price_total, status, created_at,
                carpool_trips!inner(from_city, to_city, date, time, price_per_seat, driver_id)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Flatten the trip data
        const rows = data.map(booking => ({
            ...booking,
            from_city: booking.carpool_trips.from_city,
            to_city: booking.carpool_trips.to_city,
            date: booking.carpool_trips.date,
            time: booking.carpool_trips.time,
            price_per_seat: booking.carpool_trips.price_per_seat,
            driver_id: booking.carpool_trips.driver_id,
            carpool_trips: undefined
        }));
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, 'Failed to fetch carpool bookings', err.message);
    }
});

// Cancel carpool booking
app.put('/api/carpool/bookings/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('carpool_bookings')
            .select('id, trip_id, seats, status')
            .eq('id', id)
            .single();
        
        if (bookingError || !booking) {
            return sendError(res, 404, 'Booking not found');
        }
        
        if (booking.status === 'cancelled') {
            return res.json({ message: 'Already cancelled' });
        }
        
        // Update booking status
        const { error: updateBookingError } = await supabase
            .from('carpool_bookings')
            .update({ status: 'cancelled' })
            .eq('id', id);
        
        if (updateBookingError) throw updateBookingError;
        
        // Restore available seats
        const { data: trip, error: tripError } = await supabase
            .from('carpool_trips')
            .select('available_seats')
            .eq('id', booking.trip_id)
            .single();
        
        if (tripError) throw tripError;
        
        const { error: updateTripError } = await supabase
            .from('carpool_trips')
            .update({ available_seats: trip.available_seats + booking.seats })
            .eq('id', booking.trip_id);
        
        if (updateTripError) throw updateTripError;
        
        res.json({ message: 'Carpool booking cancelled' });
    } catch (err) {
        sendError(res, 500, 'Failed to cancel carpool booking', err.message);
    }
});

// Driver's hosted trips with aggregates
app.get('/api/carpool/trips/driver/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        
        // Get all trips for driver
        const { data: trips, error: tripsError } = await supabase
            .from('carpool_trips')
            .select('*')
            .eq('driver_id', driverId)
            .order('date', { ascending: false })
            .order('time', { ascending: false });
        
        if (tripsError) throw tripsError;
        
        // Get bookings for all trips
        const { data: bookings, error: bookingsError } = await supabase
            .from('carpool_bookings')
            .select('trip_id, seats, price_total, status')
            .in('trip_id', trips.map(t => t.id));
        
        if (bookingsError) throw bookingsError;
        
        // Aggregate booking data per trip
        const rows = trips.map(trip => {
            const tripBookings = bookings.filter(b => b.trip_id === trip.id);
            const sold_seats = tripBookings
                .filter(b => ['pending', 'confirmed', 'completed'].includes(b.status))
                .reduce((sum, b) => sum + b.seats, 0);
            const revenue = tripBookings
                .filter(b => ['confirmed', 'completed'].includes(b.status))
                .reduce((sum, b) => sum + parseFloat(b.price_total), 0);
            
            return {
                ...trip,
                sold_seats,
                revenue
            };
        });
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, 'Failed to fetch hosted trips', err.message);
    }
});

// Bookings for a specific trip (with renter details)
app.get('/api/carpool/trips/:tripId/bookings', async (req, res) => {
    try {
        const { tripId } = req.params;
        
        const { data, error } = await supabase
            .from('carpool_bookings')
            .select(`
                id, user_id, seats, price_total, status, created_at,
                users!inner(name, email, phone)
            `)
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Flatten the user data
        const rows = data.map(booking => ({
            ...booking,
            renter_name: booking.users.name,
            renter_email: booking.users.email,
            renter_phone: booking.users.phone,
            users: undefined
        }));
        
        res.json(rows);
    } catch (err) {
        sendError(res, 500, 'Failed to fetch trip bookings', err.message);
    }
});
// ---------- Seller metrics ----------
app.get("/api/sellers/:sellerId/revenue", async (req, res) => {
    try {
        const { sellerId } = req.params;
        const from = req.query.from;
        const to = req.query.to;
        if (!from || !to) return sendError(res, 400, "from and to are required (YYYY-MM-DD)");
        
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                total_price,
                cars!inner(seller_id)
            `)
            .eq('cars.seller_id', sellerId)
            .in('status', ['confirmed', 'completed'])
            .gte('created_at', from)
            .lte('created_at', to);
        
        if (error) throw error;
        
        const total_revenue = data.reduce((sum, booking) => sum + parseFloat(booking.total_price || 0), 0);
        
        res.json({ total_revenue });
    } catch (err) {
        sendError(res, 500, "Failed to compute revenue", err.message);
    }
});

// ---------- Photo Upload APIs ----------

// Upload a single photo to Supabase Storage
app.post("/api/upload/photo", async (req, res) => {
    try {
        const { file, fileName, carId } = req.body;
        
        if (!file || !fileName) {
            return sendError(res, 400, "Missing file or fileName");
        }

        // Decode base64 file
        const base64Data = file.split(',')[1] || file;
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate unique filename
        const timestamp = Date.now();
        const uniqueFileName = carId 
            ? `car-${carId}-${timestamp}-${fileName}`
            : `${timestamp}-${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('car-photos')
            .upload(uniqueFileName, buffer, {
                contentType: 'image/jpeg',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('car-photos')
            .getPublicUrl(uniqueFileName);

        res.json({ 
            url: publicUrlData.publicUrl,
            fileName: uniqueFileName 
        });
    } catch (err) {
        sendError(res, 500, "Failed to upload photo", err.message);
    }
});

// Upload multiple photos for a car
app.post("/api/upload/photos", async (req, res) => {
    try {
        const { files, carId } = req.body;
        
        if (!files || !Array.isArray(files) || files.length === 0) {
            return sendError(res, 400, "Missing files array");
        }

        const uploadedUrls = [];
        const errors = [];

        for (let i = 0; i < files.length; i++) {
            const { file, fileName } = files[i];
            
            try {
                // Decode base64
                const base64Data = file.split(',')[1] || file;
                const buffer = Buffer.from(base64Data, 'base64');

                // Generate unique filename
                const timestamp = Date.now();
                const uniqueFileName = carId 
                    ? `car-${carId}-${timestamp}-${i}-${fileName}`
                    : `${timestamp}-${i}-${fileName}`;

                // Upload to Supabase Storage
                const { data, error } = await supabase.storage
                    .from('car-photos')
                    .upload(uniqueFileName, buffer, {
                        contentType: 'image/jpeg',
                        upsert: false
                    });

                if (error) throw error;

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from('car-photos')
                    .getPublicUrl(uniqueFileName);

                uploadedUrls.push(publicUrlData.publicUrl);
            } catch (uploadError) {
                errors.push({ index: i, fileName, error: uploadError.message });
            }
        }

        res.json({ 
            urls: uploadedUrls,
            errors: errors.length > 0 ? errors : null,
            successCount: uploadedUrls.length,
            totalCount: files.length
        });
    } catch (err) {
        sendError(res, 500, "Failed to upload photos", err.message);
    }
});

// Delete a photo from Supabase Storage
app.delete("/api/upload/photo/:fileName", async (req, res) => {
    try {
        const { fileName } = req.params;
        
        if (!fileName) {
            return sendError(res, 400, "Missing fileName");
        }

        const { error } = await supabase.storage
            .from('car-photos')
            .remove([fileName]);

        if (error) throw error;

        res.json({ message: "Photo deleted successfully" });
    } catch (err) {
        sendError(res, 500, "Failed to delete photo", err.message);
    }
});

// Update car photos (add or replace)
app.put("/api/cars/:id/update-photos", async (req, res) => {
    try {
        const { id } = req.params;
        const { photos, primary_photo, action } = req.body;
        
        if (!photos || !Array.isArray(photos)) {
            return sendError(res, 400, "Missing or invalid photos array");
        }

        let updateData = {};

        if (action === 'replace') {
            // Replace all photos
            updateData = {
                photos: photos,
                primary_photo: primary_photo || photos[0] || null
            };
        } else {
            // Add to existing photos (default)
            const { data: currentCar, error: fetchError } = await supabase
                .from('cars')
                .select('photos')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            const existingPhotos = Array.isArray(currentCar.photos) ? currentCar.photos : [];
            const updatedPhotos = [...existingPhotos, ...photos];

            updateData = {
                photos: updatedPhotos,
                primary_photo: primary_photo || updatedPhotos[0] || null
            };
        }

        const { error: updateError } = await supabase
            .from('cars')
            .update(updateData)
            .eq('id', id);

        if (updateError) throw updateError;

        res.json({ 
            message: "Photos updated successfully",
            photos: updateData.photos,
            primary_photo: updateData.primary_photo
        });
    } catch (err) {
        sendError(res, 500, "Failed to update car photos", err.message);
    }
});

// Fallback route to serve index.html for non-API routes
app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});


