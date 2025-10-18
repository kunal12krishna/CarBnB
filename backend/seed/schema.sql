-- =====================
-- DATABASE: carbnb
-- =====================

-- Drop tables if they already exist (optional)
DROP TABLE IF EXISTS carpool_members, carpool_groups, carpool_bookings, carpool_trips, bookings, cars, users CASCADE;

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role TEXT CHECK (role IN ('rentee', 'seller')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- CARS TABLE
-- =====================
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ,photos TEXT[] DEFAULT '{}'
    ,primary_photo TEXT
);

-- =====================
-- BOOKINGS TABLE
-- =====================
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

-- =====================
-- CARPOOL_TRIPS TABLE
-- =====================
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

-- =====================
-- CARPOOL_BOOKINGS TABLE
-- =====================
CREATE TABLE carpool_bookings (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES carpool_trips(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seats INT NOT NULL,
    price_total DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending','confirmed','cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- CARPOOL_GROUPS TABLE
-- =====================
CREATE TABLE carpool_groups (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    max_passengers INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carpool_members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES carpool_groups(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- =====================
-- CAR_PHOTOS TABLE (advanced photo management)
-- =====================
CREATE TABLE IF NOT EXISTS car_photos (
    id SERIAL PRIMARY KEY,
    car_id INT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_car_photos_car_id ON car_photos(car_id);
