require('dotenv').config();
const { supabase } = require('../db');

/**
 * Script to add Unsplash car photos to existing cars
 * 
 * Two modes:
 * 1. Free Mode: Uses direct Unsplash URLs (no API key needed)
 * 2. API Mode: Uses Unsplash API for better quality/variety (requires API key)
 * 
 * Usage: node backend/seed/unsplash-photos.js
 */

// ====================
// MODE 1: FREE MODE (No API Key Required)
// ====================

// Curated high-quality car photos from Unsplash
const carPhotoCollections = {
    suv: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'
    ],
    sedan: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
    ],
    hatchback: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
    ],
    luxury: [
        'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
    ],
    electric: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
        'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?w=800',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'
    ],
    mpv: [
        'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800',
        'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'
    ]
};

// Map car models to photo categories
const carCategoryMapping = {
    'Creta': 'suv',
    'Seltos': 'suv',
    'Venue': 'suv',
    'Brezza': 'suv',
    'Nexon': 'suv',
    'Kushaq': 'suv',
    'Thar': 'suv',
    'XUV700': 'suv',
    'XUV300': 'suv',
    'Harrier': 'suv',
    'Safari': 'suv',
    'Fortuner': 'luxury',
    'Compass': 'suv',
    
    'City': 'sedan',
    'Verna': 'sedan',
    'Ciaz': 'sedan',
    'Slavia': 'sedan',
    'Virtus': 'sedan',
    'Camry': 'luxury',
    'Octavia': 'sedan',
    'Superb': 'luxury',
    
    'Swift': 'hatchback',
    'i20': 'hatchback',
    'Baleno': 'hatchback',
    'Altroz': 'hatchback',
    'Tiago': 'hatchback',
    'Polo': 'hatchback',
    'Jazz': 'hatchback',
    
    'Nexon EV': 'electric',
    'ZS EV': 'electric',
    'Atto 3': 'electric',
    'EV6': 'electric',
    'XUV400': 'electric',
    'e6': 'electric',
    
    'Innova': 'mpv',
    'Crysta': 'mpv',
    'Hycross': 'mpv',
    'Carens': 'mpv',
    'Ertiga': 'mpv',
    'XL6': 'mpv',
    'Alcazar': 'mpv',
    'Carnival': 'luxury'
};

// Function to get random photos from a category
function getRandomPhotos(category, count = 3) {
    const photos = carPhotoCollections[category] || carPhotoCollections.sedan;
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, photos.length));
}

// Function to determine category from car model
function getCarCategory(model) {
    for (const [key, category] of Object.entries(carCategoryMapping)) {
        if (model.includes(key)) {
            return category;
        }
    }
    return 'sedan'; // default
}

// ====================
// UPDATE FUNCTION
// ====================

async function updateCarsWithUnsplashPhotos() {
    try {
        console.log('📸 Fetching cars from database...\n');

        // Get all cars
        const { data: cars, error } = await supabase
            .from('cars')
            .select('id, make, model, variant')
            .order('id');

        if (error) throw error;

        console.log(`Found ${cars.length} cars. Starting photo assignment...\n`);

        let successCount = 0;
        let errorCount = 0;

        // Update each car with photos
        for (const car of cars) {
            const category = getCarCategory(car.model);
            const photos = getRandomPhotos(category, 3);
            const primaryPhoto = photos[0];

            try {
                const { error: updateError } = await supabase
                    .from('cars')
                    .update({
                        photos: photos,
                        primary_photo: primaryPhoto
                    })
                    .eq('id', car.id);

                if (updateError) throw updateError;

                console.log(`✅ Car #${car.id} (${car.make} ${car.model}) - ${category} - ${photos.length} photos`);
                successCount++;

            } catch (error) {
                console.error(`❌ Car #${car.id} - Error: ${error.message}`);
                errorCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n' + '='.repeat(60));
        console.log(`📊 Summary:`);
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// ====================
// MODE 2: UNSPLASH API (Optional - Better Quality)
// ====================

async function updateWithUnsplashAPI() {
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    if (!UNSPLASH_ACCESS_KEY) {
        console.log('⚠️  No UNSPLASH_ACCESS_KEY found. Using free mode instead.');
        return updateCarsWithUnsplashPhotos();
    }

    console.log('🔑 Using Unsplash API for high-quality photos...\n');

    try {
        const { data: cars, error } = await supabase
            .from('cars')
            .select('id, make, model, variant')
            .order('id');

        if (error) throw error;

        let successCount = 0;
        let errorCount = 0;

        for (const car of cars) {
            try {
                const searchQuery = `${car.make} ${car.model} car`;
                
                // Fetch from Unsplash API
                const response = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape`,
                    {
                        headers: {
                            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                        }
                    }
                );

                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const photos = data.results.map(photo => photo.urls.regular);
                    const primaryPhoto = photos[0];

                    const { error: updateError } = await supabase
                        .from('cars')
                        .update({
                            photos: photos,
                            primary_photo: primaryPhoto
                        })
                        .eq('id', car.id);

                    if (updateError) throw updateError;

                    console.log(`✅ Car #${car.id} (${car.make} ${car.model}) - ${photos.length} API photos`);
                    successCount++;
                } else {
                    // Fallback to curated photos
                    const category = getCarCategory(car.model);
                    const photos = getRandomPhotos(category, 3);
                    
                    const { error: updateError } = await supabase
                        .from('cars')
                        .update({
                            photos: photos,
                            primary_photo: photos[0]
                        })
                        .eq('id', car.id);

                    if (updateError) throw updateError;
                    
                    console.log(`⚠️  Car #${car.id} (${car.make} ${car.model}) - Using fallback photos`);
                    successCount++;
                }

                // Rate limiting (50 requests per hour for free)
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`❌ Car #${car.id} - Error: ${error.message}`);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`📊 Summary:`);
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// ====================
// RUN SCRIPT
// ====================

const useAPI = process.argv.includes('--api');

console.log('🚗 Unsplash Photo Assignment Tool\n');

if (useAPI) {
    console.log('Mode: Unsplash API (requires API key)\n');
    updateWithUnsplashAPI()
        .then(() => {
            console.log('\n✨ Photo assignment complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
} else {
    console.log('Mode: Free (curated URLs)\n');
    updateCarsWithUnsplashPhotos()
        .then(() => {
            console.log('\n✨ Photo assignment complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Script failed:', error);
            process.exit(1);
        });
}
