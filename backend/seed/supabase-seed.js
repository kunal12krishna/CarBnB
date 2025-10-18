/*
  Supabase seeder for carbnb: creates sample sellers and 100 cars
  Usage: npm run seed:cars
*/
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables. Please check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample sellers data
const sellers = [
    { name: 'Rahul Verma', email: 'seed_seller_1@example.in', phone: '+91 9000000001', password: 'Pass@123', role: 'seller' },
    { name: 'Neha Sharma', email: 'seed_seller_2@example.in', phone: '+91 9000000002', password: 'Pass@123', role: 'seller' },
    { name: 'Arjun Singh', email: 'seed_seller_3@example.in', phone: '+91 9000000003', password: 'Pass@123', role: 'seller' },
    { name: 'Priya Iyer', email: 'seed_seller_4@example.in', phone: '+91 9000000004', password: 'Pass@123', role: 'seller' },
    { name: 'Aman Gupta', email: 'seed_seller_5@example.in', phone: '+91 9000000005', password: 'Pass@123', role: 'seller' },
    { name: 'Rohit Jain', email: 'seed_seller_6@example.in', phone: '+91 9000000006', password: 'Pass@123', role: 'seller' },
    { name: 'Divya Krishnan', email: 'seed_seller_7@example.in', phone: '+91 9000000007', password: 'Pass@123', role: 'seller' },
    { name: 'Ananya Bose', email: 'seed_seller_8@example.in', phone: '+91 9000000008', password: 'Pass@123', role: 'seller' },
    { name: 'Karan Mehta', email: 'seed_seller_9@example.in', phone: '+91 9000000009', password: 'Pass@123', role: 'seller' },
    { name: 'Sana Khan', email: 'seed_seller_10@example.in', phone: '+91 9000000010', password: 'Pass@123', role: 'seller' }
];

// Sample cars data (will be distributed across sellers)
const carsData = [
    { make: 'Hyundai', model: 'Creta', variant: 'SX(O)', year: 2024, seats: 5, price_per_day: 2800, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Swift', variant: 'ZXi+', year: 2023, seats: 5, price_per_day: 1800, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Nexon EV', variant: 'Empowered+', year: 2024, seats: 5, price_per_day: 3200, fuel_type: 'Electric', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Innova Crysta', variant: 'ZX', year: 2022, seats: 7, price_per_day: 3500, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Honda', model: 'City', variant: 'ZX CVT', year: 2023, seats: 5, price_per_day: 2600, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Mahindra', model: 'Thar', variant: 'LX', year: 2024, seats: 4, price_per_day: 4000, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Kia', model: 'Seltos', variant: 'GTX+', year: 2023, seats: 5, price_per_day: 2700, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Skoda', model: 'Kushaq', variant: 'Style', year: 2023, seats: 5, price_per_day: 2700, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Hyundai', model: 'i20', variant: 'Asta(O)', year: 2022, seats: 5, price_per_day: 1700, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Maruti Suzuki', model: 'Baleno', variant: 'Alpha', year: 2023, seats: 5, price_per_day: 1750, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Maruti Suzuki', model: 'Brezza', variant: 'ZXi+', year: 2024, seats: 5, price_per_day: 2300, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'Venue', variant: 'SX(O)', year: 2023, seats: 5, price_per_day: 2200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Tata', model: 'Altroz', variant: 'XZ', year: 2022, seats: 5, price_per_day: 1600, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Toyota', model: 'Glanza', variant: 'V', year: 2023, seats: 5, price_per_day: 1650, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Honda', model: 'Amaze', variant: 'VX CVT', year: 2022, seats: 5, price_per_day: 1900, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Mahindra', model: 'XUV700', variant: 'AX7', year: 2024, seats: 7, price_per_day: 3800, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Kia', model: 'Carens', variant: 'Luxury Plus', year: 2023, seats: 7, price_per_day: 3000, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Skoda', model: 'Slavia', variant: 'Style', year: 2023, seats: 5, price_per_day: 2500, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Volkswagen', model: 'Virtus', variant: 'Topline', year: 2023, seats: 5, price_per_day: 2550, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Renault', model: 'Kiger', variant: 'RXZ', year: 2022, seats: 5, price_per_day: 1500, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Nissan', model: 'Magnite', variant: 'XV Premium', year: 2023, seats: 5, price_per_day: 1550, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Harrier', variant: 'XZ+', year: 2023, seats: 5, price_per_day: 3200, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Tata', model: 'Safari', variant: 'Accomplished', year: 2024, seats: 7, price_per_day: 3600, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'Verna', variant: 'SX(O)', year: 2023, seats: 5, price_per_day: 2600, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Ciaz', variant: 'Alpha', year: 2022, seats: 5, price_per_day: 2100, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Honda', model: 'Elevate', variant: 'ZX CVT', year: 2024, seats: 5, price_per_day: 2800, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Kia', model: 'Sonet', variant: 'GTX+', year: 2023, seats: 5, price_per_day: 2100, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'Alcazar', variant: 'Signature', year: 2023, seats: 6, price_per_day: 3200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Urban Cruiser Hyryder', variant: 'V Hybrid', year: 2024, seats: 5, price_per_day: 3000, fuel_type: 'Hybrid', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Grand Vitara', variant: 'Alpha+ Hybrid', year: 2024, seats: 5, price_per_day: 2950, fuel_type: 'Hybrid', transmission: 'Automatic' },
    { make: 'MG', model: 'Astor', variant: 'Sharp', year: 2023, seats: 5, price_per_day: 2600, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'MG', model: 'ZS EV', variant: 'Exclusive', year: 2024, seats: 5, price_per_day: 3400, fuel_type: 'Electric', transmission: 'Automatic' },
    { make: 'Tata', model: 'Tiago', variant: 'XZ+', year: 2022, seats: 5, price_per_day: 1400, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Tigor', variant: 'XZ+', year: 2022, seats: 5, price_per_day: 1500, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Hyundai', model: 'Grand i10 Nios', variant: 'Asta', year: 2023, seats: 5, price_per_day: 1450, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Maruti Suzuki', model: 'Dzire', variant: 'ZXi+', year: 2023, seats: 5, price_per_day: 1700, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Honda', model: 'WR-V', variant: 'VX', year: 2022, seats: 5, price_per_day: 1800, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Skoda', model: 'Octavia', variant: 'L&K', year: 2021, seats: 5, price_per_day: 4200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Volkswagen', model: 'Taigun', variant: 'GT Plus', year: 2023, seats: 5, price_per_day: 2600, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Camry', variant: 'Hybrid', year: 2021, seats: 5, price_per_day: 5000, fuel_type: 'Hybrid', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'Aura', variant: 'SX+', year: 2022, seats: 5, price_per_day: 1500, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Fronx', variant: 'Alpha', year: 2024, seats: 5, price_per_day: 2100, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Jimny', variant: 'Alpha', year: 2024, seats: 4, price_per_day: 3000, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Mahindra', model: 'Scorpio-N', variant: 'Z8L', year: 2024, seats: 7, price_per_day: 3500, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Mahindra', model: 'Bolero Neo', variant: 'N10', year: 2022, seats: 7, price_per_day: 2200, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Hyundai', model: 'Exter', variant: 'SX(O)', year: 2024, seats: 5, price_per_day: 1600, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Kia', model: 'Carnival', variant: 'Limousine', year: 2021, seats: 7, price_per_day: 4800, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Renault', model: 'Triber', variant: 'RXZ', year: 2022, seats: 7, price_per_day: 1600, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Renault', model: 'Duster', variant: 'RXZ', year: 2020, seats: 5, price_per_day: 1900, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Ford', model: 'EcoSport', variant: 'Titanium+', year: 2021, seats: 5, price_per_day: 2000, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Honda', model: 'Jazz', variant: 'ZX', year: 2021, seats: 5, price_per_day: 1700, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Fortuner', variant: 'Legender', year: 2021, seats: 7, price_per_day: 6000, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Jeep', model: 'Compass', variant: 'Limited', year: 2022, seats: 5, price_per_day: 3800, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Jeep', model: 'Meridian', variant: 'Limited(O)', year: 2023, seats: 7, price_per_day: 4200, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'Tucson', variant: 'Signature', year: 2023, seats: 5, price_per_day: 4500, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Skoda', model: 'Kodiaq', variant: 'L&K', year: 2022, seats: 7, price_per_day: 5200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Volkswagen', model: 'T-Roc', variant: 'Sport', year: 2021, seats: 5, price_per_day: 3200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Nissan', model: 'Sunny', variant: 'XV', year: 2020, seats: 5, price_per_day: 1600, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Nissan', model: 'Terrano', variant: 'XL', year: 2020, seats: 5, price_per_day: 1700, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Maruti Suzuki', model: 'S-Cross', variant: 'Alpha', year: 2021, seats: 5, price_per_day: 2000, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Punch', variant: 'Creative', year: 2023, seats: 5, price_per_day: 1700, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Hyundai', model: 'i20 N Line', variant: 'N8 DCT', year: 2023, seats: 5, price_per_day: 2300, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Kia', model: 'EV6', variant: 'GT Line', year: 2023, seats: 5, price_per_day: 7800, fuel_type: 'Electric', transmission: 'Automatic' },
    { make: 'BYD', model: 'Atto 3', variant: 'Extended', year: 2023, seats: 5, price_per_day: 5200, fuel_type: 'Electric', transmission: 'Automatic' },
    { make: 'Citroën', model: 'C3', variant: 'Shine', year: 2023, seats: 5, price_per_day: 1700, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Citroën', model: 'C3 Aircross', variant: 'Max', year: 2024, seats: 7, price_per_day: 2500, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Hyundai', model: 'Creta', variant: 'EX', year: 2021, seats: 5, price_per_day: 2400, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Hyundai', model: 'Creta', variant: 'SX', year: 2022, seats: 5, price_per_day: 2600, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Hyundai', model: 'Creta', variant: 'SX(O)', year: 2023, seats: 5, price_per_day: 2900, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'Creta', variant: 'N Line', year: 2024, seats: 5, price_per_day: 3200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Ertiga', variant: 'ZXi+', year: 2023, seats: 7, price_per_day: 2200, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'XL6', variant: 'Alpha', year: 2023, seats: 6, price_per_day: 2400, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Rumion', variant: 'V', year: 2024, seats: 7, price_per_day: 2300, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Innova Hycross', variant: 'ZX(O) Hybrid', year: 2024, seats: 7, price_per_day: 5200, fuel_type: 'Hybrid', transmission: 'Automatic' },
    { make: 'Honda', model: 'City e:HEV', variant: 'ZX', year: 2023, seats: 5, price_per_day: 3500, fuel_type: 'Hybrid', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Wagon R', variant: 'ZXi+', year: 2023, seats: 5, price_per_day: 1200, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Hyundai', model: 'Santro', variant: 'Sportz', year: 2022, seats: 5, price_per_day: 1100, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Nexon', variant: 'XZ+', year: 2023, seats: 5, price_per_day: 2200, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Mahindra', model: 'XUV300', variant: 'W8(O)', year: 2022, seats: 5, price_per_day: 2000, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Maruti Suzuki', model: 'Celerio', variant: 'ZXi', year: 2023, seats: 5, price_per_day: 1300, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Hyundai', model: 'i10', variant: 'Magna', year: 2021, seats: 5, price_per_day: 1150, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Punch', variant: 'Adventure', year: 2024, seats: 5, price_per_day: 1800, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Kia', model: 'Syros', variant: 'HTX Plus', year: 2024, seats: 5, price_per_day: 2500, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Maruti Suzuki', model: 'Alto K10', variant: 'VXi+', year: 2023, seats: 5, price_per_day: 1000, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Renault', model: 'Kwid', variant: 'RXT', year: 2022, seats: 5, price_per_day: 950, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Tata', model: 'Tiago EV', variant: 'XZ+ Tech', year: 2024, seats: 5, price_per_day: 2100, fuel_type: 'Electric', transmission: 'Automatic' },
    { make: 'MG', model: 'Comet EV', variant: 'Excite', year: 2024, seats: 4, price_per_day: 1800, fuel_type: 'Electric', transmission: 'Automatic' },
    { make: 'Mahindra', model: 'Scorpio Classic', variant: 'S11', year: 2023, seats: 7, price_per_day: 2800, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Toyota', model: 'Hilux', variant: 'High', year: 2023, seats: 5, price_per_day: 5500, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Isuzu', model: 'V-Cross', variant: 'High', year: 2022, seats: 5, price_per_day: 5000, fuel_type: 'Diesel', transmission: 'Automatic' },
    { make: 'Force', model: 'Gurkha', variant: 'Xplorer', year: 2023, seats: 5, price_per_day: 2700, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Mahindra', model: 'Marazzo', variant: 'M8', year: 2022, seats: 7, price_per_day: 2300, fuel_type: 'Diesel', transmission: 'Manual' },
    { make: 'Volkswagen', model: 'Polo', variant: 'Highline Plus', year: 2021, seats: 5, price_per_day: 1900, fuel_type: 'Petrol', transmission: 'Manual' },
    { make: 'Skoda', model: 'Rapid', variant: 'Onyx', year: 2021, seats: 5, price_per_day: 2000, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Honda', model: 'Civic', variant: 'VX', year: 2020, seats: 5, price_per_day: 3800, fuel_type: 'Petrol', transmission: 'Automatic' },
    { make: 'Toyota', model: 'Yaris', variant: 'VX', year: 2020, seats: 5, price_per_day: 2400, fuel_type: 'Petrol', transmission: 'Automatic' }
];

async function main() {
    console.log('🌱 Starting Supabase seed process...\n');
    
    try {
        // Step 1: Insert sellers
        console.log('👥 Creating sellers...');
        const { data: insertedSellers, error: sellersError } = await supabase
            .from('users')
            .upsert(sellers, { onConflict: 'email' })
            .select('id, email');
        
        if (sellersError) {
            throw new Error(`Failed to insert sellers: ${sellersError.message}`);
        }
        
        console.log(`✅ Inserted ${insertedSellers.length} sellers`);
        
        // Step 2: Distribute cars across sellers
        console.log('\n🚗 Creating cars...');
        const cars = carsData.map((car, index) => ({
            ...car,
            seller_id: insertedSellers[index % insertedSellers.length].id
        }));
        
        const { data: insertedCars, error: carsError } = await supabase
            .from('cars')
            .insert(cars)
            .select('id');
        
        if (carsError) {
            throw new Error(`Failed to insert cars: ${carsError.message}`);
        }
        
        console.log(`✅ Inserted ${insertedCars.length} cars`);
        
        console.log('\n✨ Seed completed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Sellers: ${insertedSellers.length}`);
        console.log(`   - Cars: ${insertedCars.length}`);
        
    } catch (error) {
        console.error('\n❌ Seed failed:', error.message);
        process.exitCode = 1;
    }
}

main();
