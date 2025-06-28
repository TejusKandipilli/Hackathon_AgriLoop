/*
  # AgriLoop Seller Dashboard Database Schema
  
  This file contains SQL commands to create all necessary tables for the seller dashboard functionality.
  The users table already exists with the specified columns.
  
  ## Tables Created:
  1. waste_listings - Store waste listings with status tracking
  2. matches - Track buyer-seller matches  
  3. transactions - Record completed deals
  4. environmental_impact - Track CO₂ savings
  5. notifications - User notifications system
  6. user_preferences - Matching algorithm preferences
  
  ## Features:
  - Proper foreign key relationships
  - Status constraints for data integrity
  - Automatic timestamp updates
  - Performance indexes
  - Sample data for testing
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WASTE LISTINGS TABLE
-- Stores all waste listings created by sellers
CREATE TABLE IF NOT EXISTS waste_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    waste_type VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    location VARCHAR(255) NOT NULL,
    expected_price DECIMAL(10,2) NOT NULL CHECK (expected_price > 0),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'listed' CHECK (status IN ('listed', 'matched', 'picked_up', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waste_listings_seller_id ON waste_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_waste_listings_status ON waste_listings(status);
CREATE INDEX IF NOT EXISTS idx_waste_listings_waste_type ON waste_listings(waste_type);
CREATE INDEX IF NOT EXISTS idx_waste_listings_created_at ON waste_listings(created_at);

-- 2. MATCHES TABLE
-- Tracks when buyers express interest in seller listings
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES waste_listings(id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    offered_price DECIMAL(10,2),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(listing_id, buyer_id)
);

-- Create indexes for matches
CREATE INDEX IF NOT EXISTS idx_matches_listing_id ON matches(listing_id);
CREATE INDEX IF NOT EXISTS idx_matches_buyer_id ON matches(buyer_id);
CREATE INDEX IF NOT EXISTS idx_matches_seller_id ON matches(seller_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- 3. TRANSACTIONS TABLE
-- Records completed deals between buyers and sellers
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES waste_listings(id),
    match_id UUID NOT NULL REFERENCES matches(id),
    seller_id INTEGER NOT NULL REFERENCES users(id),
    buyer_id INTEGER NOT NULL REFERENCES users(id),
    final_price DECIMAL(10,2) NOT NULL CHECK (final_price > 0),
    quantity_delivered INTEGER NOT NULL CHECK (quantity_delivered > 0),
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    rating_seller INTEGER CHECK (rating_seller >= 1 AND rating_seller <= 5),
    rating_buyer INTEGER CHECK (rating_buyer >= 1 AND rating_buyer <= 5),
    feedback_seller TEXT,
    feedback_buyer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_listing_id ON transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_pickup_date ON transactions(pickup_date);

-- 4. ENVIRONMENTAL IMPACT TABLE
-- Tracks environmental impact metrics for each transaction
CREATE TABLE IF NOT EXISTS environmental_impact (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES waste_listings(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    waste_type VARCHAR(100) NOT NULL,
    quantity_kg INTEGER NOT NULL CHECK (quantity_kg > 0),
    co2_saved_kg DECIMAL(10,3) NOT NULL DEFAULT 0,
    trees_equivalent DECIMAL(8,2) NOT NULL DEFAULT 0,
    calculation_method VARCHAR(50) DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for environmental impact
CREATE INDEX IF NOT EXISTS idx_environmental_impact_user_id ON environmental_impact(user_id);
CREATE INDEX IF NOT EXISTS idx_environmental_impact_waste_type ON environmental_impact(waste_type);
CREATE INDEX IF NOT EXISTS idx_environmental_impact_created_at ON environmental_impact(created_at);

-- 5. NOTIFICATIONS TABLE
-- Stores notifications for users
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 6. USER PREFERENCES TABLE
-- Stores user preferences for matching algorithm
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferred_waste_types TEXT[], -- Array of preferred waste types
    max_distance_km INTEGER DEFAULT 50 CHECK (max_distance_km > 0),
    min_quantity_kg INTEGER DEFAULT 10 CHECK (min_quantity_kg > 0),
    max_quantity_kg INTEGER DEFAULT 10000 CHECK (max_quantity_kg > 0),
    price_range_min DECIMAL(10,2) DEFAULT 0,
    price_range_max DECIMAL(10,2) DEFAULT 100000,
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    auto_match BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- 7. CREATE TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
DROP TRIGGER IF EXISTS update_waste_listings_updated_at ON waste_listings;
CREATE TRIGGER update_waste_listings_updated_at 
    BEFORE UPDATE ON waste_listings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. INSERT SAMPLE DATA FOR TESTING

-- Sample waste listings (assuming user IDs 1, 2, 3 exist)
INSERT INTO waste_listings (seller_id, waste_type, quantity, location, expected_price, description, status) VALUES
(1, 'Crop Residue', 500, 'Hyderabad', 1200.00, 'Fresh wheat straw from recent harvest', 'matched'),
(1, 'Organic Manure', 300, 'Secunderabad', 800.00, 'Well-composted cow dung manure', 'listed'),
(1, 'Kitchen Waste', 150, 'Hyderabad', 450.00, 'Daily kitchen waste collection', 'picked_up'),
(1, 'Garden Waste', 200, 'Gachibowli', 600.00, 'Pruned branches and leaves', 'listed')
ON CONFLICT DO NOTHING;

-- Sample matches (assuming buyer user ID 2 exists)
INSERT INTO matches (listing_id, buyer_id, seller_id, status, offered_price, message) 
SELECT 
    wl.id, 
    2, 
    wl.seller_id, 
    'pending', 
    wl.expected_price * 0.9, 
    'Interested in purchasing this waste for composting'
FROM waste_listings wl 
WHERE wl.status = 'matched' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample transactions
INSERT INTO transactions (listing_id, match_id, seller_id, buyer_id, final_price, quantity_delivered, pickup_date, delivery_status, payment_status)
SELECT 
    wl.id,
    m.id,
    wl.seller_id,
    m.buyer_id,
    wl.expected_price,
    wl.quantity,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    'delivered',
    'paid'
FROM waste_listings wl
JOIN matches m ON wl.id = m.listing_id
WHERE wl.status = 'picked_up'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample environmental impact data
INSERT INTO environmental_impact (transaction_id, listing_id, user_id, waste_type, quantity_kg, co2_saved_kg, trees_equivalent)
SELECT 
    t.id,
    t.listing_id,
    t.seller_id,
    'Kitchen Waste',
    t.quantity_delivered,
    t.quantity_delivered * 0.95, -- 0.95 kg CO2 saved per kg waste
    (t.quantity_delivered * 0.95) / 22 -- 22 kg CO2 per tree equivalent
FROM transactions t
WHERE t.delivery_status = 'delivered'
ON CONFLICT DO NOTHING;

-- Sample notifications
INSERT INTO notifications (user_id, type, title, message, data) VALUES
(1, 'match_found', 'New Match Found!', 'A buyer is interested in your Crop Residue listing', '{"listing_id": "sample", "buyer_name": "John Doe"}'),
(1, 'pickup_scheduled', 'Pickup Scheduled', 'Your waste pickup has been scheduled for tomorrow', '{"pickup_date": "2024-01-15", "time": "10:00 AM"}'),
(1, 'payment_received', 'Payment Received', 'You have received ₹450 for your Kitchen Waste sale', '{"amount": 450, "transaction_id": "sample"}')
ON CONFLICT DO NOTHING;

-- Sample user preferences
INSERT INTO user_preferences (user_id, preferred_waste_types, max_distance_km, min_quantity_kg, max_quantity_kg, price_range_min, price_range_max)
VALUES 
(1, ARRAY['Crop Residue', 'Organic Manure', 'Kitchen Waste'], 25, 50, 1000, 100, 5000)
ON CONFLICT (user_id) DO NOTHING;

-- 9. CREATE VIEWS FOR COMMON QUERIES

-- View for seller dashboard summary
CREATE OR REPLACE VIEW seller_dashboard_summary AS
SELECT 
    u.id as seller_id,
    u.username,
    COUNT(wl.id) as total_listings,
    COUNT(CASE WHEN wl.status = 'listed' THEN 1 END) as active_listings,
    COUNT(CASE WHEN wl.status = 'picked_up' THEN 1 END) as completed_listings,
    COALESCE(SUM(CASE WHEN wl.status = 'picked_up' THEN wl.expected_price END), 0) as total_revenue,
    COALESCE(SUM(CASE WHEN wl.status = 'picked_up' AND DATE(wl.updated_at) = CURRENT_DATE THEN wl.expected_price END), 0) as today_revenue,
    COALESCE(SUM(CASE WHEN wl.status = 'picked_up' AND wl.updated_at >= CURRENT_DATE - INTERVAL '7 days' THEN wl.expected_price END), 0) as weekly_revenue,
    COALESCE(SUM(CASE WHEN wl.status = 'picked_up' AND EXTRACT(MONTH FROM wl.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE) THEN wl.expected_price END), 0) as monthly_revenue
FROM users u
LEFT JOIN waste_listings wl ON u.id = wl.seller_id
WHERE u.role = 'Seller'
GROUP BY u.id, u.username;

-- View for environmental impact summary
CREATE OR REPLACE VIEW environmental_impact_summary AS
SELECT 
    ei.user_id,
    SUM(ei.quantity_kg) as total_waste_processed,
    SUM(ei.co2_saved_kg) as total_co2_saved,
    SUM(ei.trees_equivalent) as total_trees_equivalent,
    COUNT(ei.id) as total_transactions
FROM environmental_impact ei
GROUP BY ei.user_id;

-- 10. GRANT PERMISSIONS (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'AgriLoop database schema created successfully!';
    RAISE NOTICE 'Tables created: waste_listings, matches, transactions, environmental_impact, notifications, user_preferences';
    RAISE NOTICE 'Views created: seller_dashboard_summary, environmental_impact_summary';
    RAISE NOTICE 'Sample data inserted for testing';
END $$;