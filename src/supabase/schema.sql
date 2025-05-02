-- Create schema for poultry farm management system
-- Note: Run this SQL in your Supabase SQL Editor

-- Enable UUID extension for better ID management
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'ProductionManager', 'OperationsManager', 'Owner', 'ITSpecialist', 'SalesManager', 'SalesTeamMember', 'Driver', 'WarehouseManager')),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  password TEXT, -- Note: In production, authentication should be handled by Supabase Auth
  initial_login_complete BOOLEAN DEFAULT FALSE
);

-- MODULE ACCESS TABLE
CREATE TABLE IF NOT EXISTS module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dashboard BOOLEAN DEFAULT TRUE,
  batches BOOLEAN DEFAULT FALSE,
  egg_collection BOOLEAN DEFAULT FALSE,
  feed_management BOOLEAN DEFAULT FALSE,
  vaccination BOOLEAN DEFAULT FALSE,
  sales BOOLEAN DEFAULT FALSE,
  customers BOOLEAN DEFAULT FALSE,
  calendar BOOLEAN DEFAULT FALSE,
  reports BOOLEAN DEFAULT FALSE,
  user_management BOOLEAN DEFAULT FALSE,
  warehouse BOOLEAN DEFAULT FALSE
);

-- USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BATCHES TABLE
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bird_count INTEGER NOT NULL,
  batch_status TEXT NOT NULL CHECK (batch_status IN ('New', 'Laying', 'Not Laying', 'Retired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- EGG COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS egg_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  whole_count INTEGER NOT NULL,
  broken_count INTEGER NOT NULL,
  small_eggs INTEGER DEFAULT 0,
  medium_eggs INTEGER DEFAULT 0,
  large_eggs INTEGER DEFAULT 0,
  xl_eggs INTEGER DEFAULT 0,
  good_eggs INTEGER DEFAULT 0,
  broken_eggs INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FEED TYPES TABLE
CREATE TABLE IF NOT EXISTS feed_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  bird_type TEXT NOT NULL CHECK (bird_type IN ('Layers', 'Growers', 'Other'))
);

-- FEED INVENTORY TABLE
CREATE TABLE IF NOT EXISTS feed_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_type_id UUID REFERENCES feed_types(id) ON DELETE CASCADE,
  quantity_kg NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  is_produced BOOLEAN NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FEED CONSUMPTION TABLE
CREATE TABLE IF NOT EXISTS feed_consumption (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  feed_type_id UUID REFERENCES feed_types(id) ON DELETE CASCADE,
  quantity_kg NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('Morning', 'Afternoon', 'Evening')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VACCINES TABLE
CREATE TABLE IF NOT EXISTS vaccines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  interval_days INTEGER
);

-- VACCINATION RECORDS TABLE
CREATE TABLE IF NOT EXISTS vaccination_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  vaccine_id UUID REFERENCES vaccines(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT,
  next_scheduled_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Egg', 'Bird')),
  condition TEXT CHECK (condition IN ('Whole', 'Broken', 'NA')),
  current_price NUMERIC(10,2) NOT NULL,
  price_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_number TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SALES TABLE
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SALE ITEMS TABLE (for the products in each sale)
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_per_unit NUMERIC(10,2) NOT NULL
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_location TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Processing', 'Delivered', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDER ITEMS TABLE (for the products in each order)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL
);

-- REPORT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS report_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  default_format TEXT DEFAULT 'pdf' CHECK (default_format IN ('pdf', 'excel', 'csv')),
  include_header BOOLEAN DEFAULT TRUE,
  include_footer BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for authenticated users
-- Note: In a real application, you would create more specific policies based on user roles

-- Example policy for authenticated users to access batches
CREATE POLICY "Allow authenticated users to access batches" 
  ON batches FOR ALL 
  TO authenticated 
  USING (true);

-- Create similar policies for all tables
CREATE POLICY "Allow authenticated users to access egg_collections" 
  ON egg_collections FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access feed_types" 
  ON feed_types FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access feed_inventory" 
  ON feed_inventory FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access feed_consumption" 
  ON feed_consumption FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access vaccines" 
  ON vaccines FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access vaccination_records" 
  ON vaccination_records FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access products" 
  ON products FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access customers" 
  ON customers FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access sales" 
  ON sales FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access sale_items" 
  ON sale_items FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access orders" 
  ON orders FOR ALL 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to access order_items" 
  ON order_items FOR ALL 
  TO authenticated 
  USING (true);

-- Create custom function to check user role for admin-specific operations
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IN (
    SELECT id FROM users WHERE role IN ('Admin', 'Owner', 'OperationsManager', 'ITSpecialist')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_batches_status ON batches(batch_status);
CREATE INDEX idx_egg_collections_batch_id ON egg_collections(batch_id);
CREATE INDEX idx_egg_collections_date ON egg_collections(date);
CREATE INDEX idx_feed_consumption_batch_id ON feed_consumption(batch_id);
CREATE INDEX idx_feed_consumption_date ON feed_consumption(date);
CREATE INDEX idx_vaccination_records_batch_id ON vaccination_records(batch_id);
CREATE INDEX idx_vaccination_records_date ON vaccination_records(date);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Create functions to summarize data for dashboards
CREATE OR REPLACE FUNCTION get_daily_egg_summary(date_param DATE)
RETURNS TABLE(
  total_whole_count INTEGER,
  total_broken_count INTEGER,
  small_count INTEGER,
  medium_count INTEGER,
  large_count INTEGER,
  xl_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(whole_count), 0)::INTEGER AS total_whole_count,
    COALESCE(SUM(broken_count), 0)::INTEGER AS total_broken_count,
    COALESCE(SUM(small_eggs), 0)::INTEGER AS small_count,
    COALESCE(SUM(medium_eggs), 0)::INTEGER AS medium_count,
    COALESCE(SUM(large_eggs), 0)::INTEGER AS large_count,
    COALESCE(SUM(xl_eggs), 0)::INTEGER AS xl_count
  FROM egg_collections
  WHERE date = date_param;
END;
$$ LANGUAGE plpgsql;

-- Create function for monthly sales summary
CREATE OR REPLACE FUNCTION get_monthly_sales_summary(year_param INTEGER, month_param INTEGER)
RETURNS TABLE(
  total_sales NUMERIC,
  total_eggs_sold INTEGER,
  total_birds_sold INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(s.total_amount), 0) AS total_sales,
    COALESCE(SUM(CASE WHEN p.type = 'Egg' THEN si.quantity ELSE 0 END), 0)::INTEGER AS total_eggs_sold,
    COALESCE(SUM(CASE WHEN p.type = 'Bird' THEN si.quantity ELSE 0 END), 0)::INTEGER AS total_birds_sold
  FROM sales s
  JOIN sale_items si ON s.id = si.sale_id
  JOIN products p ON si.product_id = p.id
  WHERE EXTRACT(YEAR FROM s.date) = year_param
  AND EXTRACT(MONTH FROM s.date) = month_param;
END;
$$ LANGUAGE plpgsql;
