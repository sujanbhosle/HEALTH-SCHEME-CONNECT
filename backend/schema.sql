-- PostgreSQL Relational Database Schema for AWS RDS Deployment
-- Matches the types and architecture of the Health Scheme Hub Application

-- 1. Enable any required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    image TEXT,
    is_nabh BOOLEAN NOT NULL DEFAULT FALSE,
    is_nabl BOOLEAN NOT NULL DEFAULT FALSE,
    total_beds INT NOT NULL DEFAULT 0,
    icu_beds INT NOT NULL DEFAULT 0,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    emergency_24x7 BOOLEAN NOT NULL DEFAULT TRUE,
    ambulance_available BOOLEAN NOT NULL DEFAULT TRUE,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    review_count INT NOT NULL DEFAULT 0,
    established_year INT,
    schemes_accepted TEXT[] NOT NULL DEFAULT '{}',
    facilities TEXT[] NOT NULL DEFAULT '{}',
    consulting_fee INT NOT NULL DEFAULT 0,
    checkup_fee INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on city for faster searches
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals(city);

-- 4. Create Schemes Table
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_local JSONB,
    short_name VARCHAR(100),
    logo_url TEXT,
    coverage_limit INT NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    government_level VARCHAR(20) NOT NULL CHECK (government_level IN ('Central', 'State')),
    state VARCHAR(100),
    launch_year INT,
    beneficiaries_count BIGINT,
    description TEXT NOT NULL,
    description_local JSONB,
    detailed_description TEXT,
    eligibility_criteria JSONB,
    eligibility TEXT,
    covered_treatments TEXT[] NOT NULL DEFAULT '{}',
    excluded_treatments TEXT[] NOT NULL DEFAULT '{}',
    claim_process TEXT[] NOT NULL DEFAULT '{}',
    documents_required TEXT[] NOT NULL DEFAULT '{}',
    official_website VARCHAR(255),
    helpline_number VARCHAR(50),
    mobile_app VARCHAR(255),
    states_covered TEXT[] NOT NULL DEFAULT '{}',
    empanelled_hospitals_count INT DEFAULT 0,
    claims_processed INT DEFAULT 0,
    success_stories_count INT DEFAULT 0,
    average_claim_amount INT DEFAULT 0,
    cashless BOOLEAN DEFAULT TRUE,
    pre_existing_conditions_covered BOOLEAN DEFAULT TRUE,
    family_floater BOOLEAN DEFAULT TRUE,
    age_limit INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on government_level
CREATE INDEX IF NOT EXISTS idx_schemes_govt_level ON schemes(government_level);

-- 5. Create Treatments Table
CREATE TABLE IF NOT EXISTS treatments (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- 6. Create Hospital Treatments Junction Table (Surgical Cost Mapping)
CREATE TABLE IF NOT EXISTS hospital_treatments (
    hospital_id VARCHAR(50) REFERENCES hospitals(id) ON DELETE CASCADE,
    treatment_id VARCHAR(50) REFERENCES treatments(id) ON DELETE CASCADE,
    estimated_cost INT NOT NULL DEFAULT 0,
    scheme_covered BOOLEAN NOT NULL DEFAULT TRUE,
    scheme_coverage_limit INT NOT NULL DEFAULT 0,
    PRIMARY KEY (hospital_id, treatment_id)
);

-- 7. Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    hospital_id VARCHAR(50) REFERENCES hospitals(id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Bed Statuses Table (Real-time Live Capacity Tracking)
CREATE TABLE IF NOT EXISTS bed_statuses (
    hospital_id VARCHAR(50) PRIMARY KEY REFERENCES hospitals(id) ON DELETE CASCADE,
    available_icu INT NOT NULL DEFAULT 0,
    available_general INT NOT NULL DEFAULT 0,
    available_maternity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Empanelments Junction Table
CREATE TABLE IF NOT EXISTS empanelments (
    hospital_id VARCHAR(50) REFERENCES hospitals(id) ON DELETE CASCADE,
    scheme_id VARCHAR(50) REFERENCES schemes(id) ON DELETE CASCADE,
    PRIMARY KEY (hospital_id, scheme_id)
);
