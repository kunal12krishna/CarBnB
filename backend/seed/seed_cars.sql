-- Seed script for carbnb: creates sample sellers and 100 cars
-- Usage: mysql -u root -p carbnb < backend/seed/seed_cars.sql

USE carbnb;

-- Create 10 sellers with fixed IDs to reference from cars
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO users (id, name, email, phone, password, role)
VALUES
  (1001, 'Rahul Verma', 'seed_seller_1@example.in', '+91 9000000001', 'Pass@123', 'seller'),
  (1002, 'Neha Sharma', 'seed_seller_2@example.in', '+91 9000000002', 'Pass@123', 'seller'),
  (1003, 'Arjun Singh', 'seed_seller_3@example.in', '+91 9000000003', 'Pass@123', 'seller'),
  (1004, 'Priya Iyer', 'seed_seller_4@example.in', '+91 9000000004', 'Pass@123', 'seller'),
  (1005, 'Aman Gupta', 'seed_seller_5@example.in', '+91 9000000005', 'Pass@123', 'seller'),
  (1006, 'Rohit Jain', 'seed_seller_6@example.in', '+91 9000000006', 'Pass@123', 'seller'),
  (1007, 'Divya Krishnan', 'seed_seller_7@example.in', '+91 9000000007', 'Pass@123', 'seller'),
  (1008, 'Ananya Bose', 'seed_seller_8@example.in', '+91 9000000008', 'Pass@123', 'seller'),
  (1009, 'Karan Mehta', 'seed_seller_9@example.in', '+91 9000000009', 'Pass@123', 'seller'),
  (1010, 'Sana Khan', 'seed_seller_10@example.in', '+91 9000000010', 'Pass@123', 'seller')
ON DUPLICATE KEY UPDATE name = VALUES(name);
SET FOREIGN_KEY_CHECKS = 1;

-- Insert 100 cars (distribute across seller_id 1001..1010)
INSERT INTO cars (seller_id, make, model, variant, year, seats, price_per_day, fuel_type, transmission)
VALUES
  (1001,'Hyundai','Creta','SX(O)',2024,5,2800,'Petrol','Automatic'),
  (1002,'Maruti Suzuki','Swift','ZXi+',2023,5,1800,'Petrol','Manual'),
  (1003,'Tata','Nexon EV','Empowered+',2024,5,3200,'Electric','Automatic'),
  (1004,'Toyota','Innova Crysta','ZX',2022,7,3500,'Diesel','Automatic'),
  (1005,'Honda','City','ZX CVT',2023,5,2600,'Petrol','Automatic'),
  (1006,'Mahindra','Thar','LX',2024,4,4000,'Diesel','Manual'),
  (1007,'Kia','Seltos','GTX+',2023,5,2700,'Petrol','Automatic'),
  (1008,'Skoda','Kushaq','Style',2023,5,2700,'Petrol','Manual'),
  (1009,'Hyundai','i20','Asta(O)',2022,5,1700,'Petrol','Manual'),
  (1010,'Maruti Suzuki','Baleno','Alpha',2023,5,1750,'Petrol','Manual'),
  (1001,'Maruti Suzuki','Brezza','ZXi+',2024,5,2300,'Petrol','Automatic'),
  (1002,'Hyundai','Venue','SX(O)',2023,5,2200,'Petrol','Automatic'),
  (1003,'Tata','Altroz','XZ',2022,5,1600,'Petrol','Manual'),
  (1004,'Toyota','Glanza','V',2023,5,1650,'Petrol','Manual'),
  (1005,'Honda','Amaze','VX CVT',2022,5,1900,'Petrol','Automatic'),
  (1006,'Mahindra','XUV700','AX7',2024,7,3800,'Diesel','Automatic'),
  (1007,'Kia','Carens','Luxury Plus',2023,7,3000,'Petrol','Automatic'),
  (1008,'Skoda','Slavia','Style',2023,5,2500,'Petrol','Automatic'),
  (1009,'Volkswagen','Virtus','Topline',2023,5,2550,'Petrol','Automatic'),
  (1010,'Renault','Kiger','RXZ',2022,5,1500,'Petrol','Manual'),
  (1001,'Nissan','Magnite','XV Premium',2023,5,1550,'Petrol','Manual'),
  (1002,'Tata','Harrier','XZ+',2023,5,3200,'Diesel','Automatic'),
  (1003,'Tata','Safari','Accomplished',2024,7,3600,'Diesel','Automatic'),
  (1004,'Hyundai','Verna','SX(O)',2023,5,2600,'Petrol','Automatic'),
  (1005,'Maruti Suzuki','Ciaz','Alpha',2022,5,2100,'Petrol','Manual'),
  (1006,'Honda','Elevate','ZX CVT',2024,5,2800,'Petrol','Automatic'),
  (1007,'Kia','Sonet','GTX+',2023,5,2100,'Petrol','Automatic'),
  (1008,'Hyundai','Alcazar','Signature',2023,6,3200,'Petrol','Automatic'),
  (1009,'Toyota','Urban Cruiser Hyryder','V Hybrid',2024,5,3000,'Hybrid','Automatic'),
  (1010,'Maruti Suzuki','Grand Vitara','Alpha+ Hybrid',2024,5,2950,'Hybrid','Automatic'),
  (1001,'MG','Astor','Sharp',2023,5,2600,'Petrol','Automatic'),
  (1002,'MG','ZS EV','Exclusive',2024,5,3400,'Electric','Automatic'),
  (1003,'Tata','Tiago','XZ+',2022,5,1400,'Petrol','Manual'),
  (1004,'Tata','Tigor','XZ+',2022,5,1500,'Petrol','Manual'),
  (1005,'Hyundai','Grand i10 Nios','Asta',2023,5,1450,'Petrol','Manual'),
  (1006,'Maruti Suzuki','Dzire','ZXi+',2023,5,1700,'Petrol','Manual'),
  (1007,'Honda','WR-V','VX',2022,5,1800,'Petrol','Manual'),
  (1008,'Skoda','Octavia','L&K',2021,5,4200,'Petrol','Automatic'),
  (1009,'Volkswagen','Taigun','GT Plus',2023,5,2600,'Petrol','Automatic'),
  (1010,'Toyota','Camry','Hybrid',2021,5,5000,'Hybrid','Automatic'),
  (1001,'Hyundai','Aura','SX+',2022,5,1500,'Petrol','Automatic'),
  (1002,'Maruti Suzuki','Fronx','Alpha',2024,5,2100,'Petrol','Automatic'),
  (1003,'Maruti Suzuki','Jimny','Alpha',2024,4,3000,'Petrol','Manual'),
  (1004,'Mahindra','Scorpio-N','Z8L',2024,7,3500,'Diesel','Manual'),
  (1005,'Mahindra','Bolero Neo','N10',2022,7,2200,'Diesel','Manual'),
  (1006,'Hyundai','Exter','SX(O)',2024,5,1600,'Petrol','Automatic'),
  (1007,'Kia','Carnival','Limousine',2021,7,4800,'Diesel','Automatic'),
  (1008,'Renault','Triber','RXZ',2022,7,1600,'Petrol','Manual'),
  (1009,'Renault','Duster','RXZ',2020,5,1900,'Diesel','Manual'),
  (1010,'Ford','EcoSport','Titanium+',2021,5,2000,'Petrol','Automatic'),
  (1001,'Honda','Jazz','ZX',2021,5,1700,'Petrol','Automatic'),
  (1002,'Toyota','Fortuner','Legender',2021,7,6000,'Diesel','Automatic'),
  (1003,'Jeep','Compass','Limited',2022,5,3800,'Diesel','Manual'),
  (1004,'Jeep','Meridian','Limited(O)',2023,7,4200,'Diesel','Automatic'),
  (1005,'Hyundai','Tucson','Signature',2023,5,4500,'Diesel','Automatic'),
  (1006,'Skoda','Kodiaq','L&K',2022,7,5200,'Petrol','Automatic'),
  (1007,'Volkswagen','T-Roc','Sport',2021,5,3200,'Petrol','Automatic'),
  (1008,'Nissan','Sunny','XV',2020,5,1600,'Petrol','Manual'),
  (1009,'Nissan','Terrano','XL',2020,5,1700,'Diesel','Manual'),
  (1010,'Maruti Suzuki','S-Cross','Alpha',2021,5,2000,'Petrol','Manual'),
  (1001,'Tata','Punch','Creative',2023,5,1700,'Petrol','Manual'),
  (1002,'Hyundai','i20 N Line','N8 DCT',2023,5,2300,'Petrol','Automatic'),
  (1003,'Kia','EV6','GT Line',2023,5,7800,'Electric','Automatic'),
  (1004,'BYD','Atto 3','Extended',2023,5,5200,'Electric','Automatic'),
  (1005,'Citroën','C3','Shine',2023,5,1700,'Petrol','Manual'),
  (1006,'Citroën','C3 Aircross','Max',2024,7,2500,'Petrol','Manual'),
  (1007,'Hyundai','Creta','EX',2021,5,2400,'Diesel','Manual'),
  (1008,'Hyundai','Creta','SX',2022,5,2600,'Diesel','Manual'),
  (1009,'Hyundai','Creta','SX(O)',2023,5,2900,'Petrol','Automatic'),
  (1010,'Hyundai','Creta','N Line',2024,5,3200,'Petrol','Automatic'),
  (1001,'Maruti Suzuki','Ertiga','ZXi+',2023,7,2200,'Petrol','Automatic'),
  (1002,'Maruti Suzuki','XL6','Alpha',2023,6,2400,'Petrol','Automatic'),
  (1003,'Toyota','Rumion','V',2024,7,2300,'Petrol','Automatic'),
  (1004,'Toyota','Innova Hycross','ZX(O) Hybrid',2024,7,5200,'Hybrid','Automatic'),
  (1005,'Honda','City e:HEV','ZX',2023,5,3500,'Hybrid','Automatic'),
  (1006,'Tata','Nexon','Fearless+',2024,5,2400,'Petrol','Automatic'),
  (1007,'Tata','Nexon','Smart+',2023,5,2000,'Petrol','Manual'),
  (1008,'Tata','Nexon','Creative+',2023,5,2200,'Diesel','Manual'),
  (1009,'Tata','Nexon EV','Empowered',2023,5,3000,'Electric','Automatic'),
  (1010,'Mahindra','XUV300','W8(O)',2022,5,2100,'Diesel','Manual'),
  (1001,'Mahindra','XUV400','EL Pro',2024,5,3400,'Electric','Automatic'),
  (1002,'Mahindra','Marazzo','M8',2021,7,2400,'Diesel','Manual'),
  (1003,'Mahindra','KUV100','K8',2020,5,1300,'Petrol','Manual'),
  (1004,'Hyundai','Santro','Asta',2020,5,1100,'Petrol','Manual'),
  (1005,'Maruti Suzuki','Celerio','ZXi+',2021,5,1200,'Petrol','Manual'),
  (1006,'Maruti Suzuki','Ignis','Alpha',2022,5,1400,'Petrol','Manual'),
  (1007,'Maruti Suzuki','Fronx','Delta',2024,5,1900,'Petrol','Manual'),
  (1008,'Kia','Seltos','HTX',2022,5,2400,'Diesel','Manual'),
  (1009,'Kia','Seltos','X-Line',2024,5,3100,'Petrol','Automatic'),
  (1010,'Kia','Sonet','HTX+',2024,5,2300,'Diesel','Automatic'),
  (1001,'Skoda','Rapid','Style',2020,5,1600,'Petrol','Manual'),
  (1002,'Skoda','Superb','L&K',2021,5,5200,'Petrol','Automatic'),
  (1003,'Volkswagen','Polo','GT TSI',2021,5,2000,'Petrol','Automatic'),
  (1004,'Volkswagen','Vento','Highline',2020,5,1700,'Petrol','Manual'),
  (1005,'Renault','Kwid','Climber',2021,5,1000,'Petrol','Manual'),
  (1006,'Renault','Captur','Platinium',2020,5,1800,'Petrol','Manual'),
  (1007,'Nissan','Kicks','XV Premium',2020,5,1900,'Petrol','Manual'),
  (1008,'MG','Hector','Sharp',2022,5,2800,'Diesel','Manual'),
  (1009,'MG','Hector Plus','Sharp',2022,6,3000,'Diesel','Manual'),
  (1010,'BYD','e6','GL',2022,5,4800,'Electric','Automatic');

-- Assign city/state per seller to populate location fields
UPDATE cars SET city='Bengaluru', state='Karnataka' WHERE seller_id=1001;
UPDATE cars SET city='Mumbai', state='Maharashtra'   WHERE seller_id=1002;
UPDATE cars SET city='New Delhi', state='Delhi'      WHERE seller_id=1003;
UPDATE cars SET city='Hyderabad', state='Telangana'  WHERE seller_id=1004;
UPDATE cars SET city='Pune', state='Maharashtra'     WHERE seller_id=1005;
UPDATE cars SET city='Jaipur', state='Rajasthan'     WHERE seller_id=1006;
UPDATE cars SET city='Chennai', state='Tamil Nadu'   WHERE seller_id=1007;
UPDATE cars SET city='Kolkata', state='West Bengal'  WHERE seller_id=1008;
UPDATE cars SET city='Ahmedabad', state='Gujarat'    WHERE seller_id=1009;
UPDATE cars SET city='Lucknow', state='Uttar Pradesh' WHERE seller_id=1010;


