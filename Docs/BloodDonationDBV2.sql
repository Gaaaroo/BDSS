
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    gender NVARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    dob DATE NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    blood_type NVARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'Unknown')),
    role NVARCHAR(10) CHECK (role IN ('admin', 'staff', 'member', 'guest')) NOT NULL,
    status NVARCHAR(10) CHECK (status IN ('active', 'pending', 'banned')) DEFAULT 'pending',
    verify_code NVARCHAR(10),
    code_expiration DATETIME
);
GO

CREATE TABLE Token (
    token_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    token NVARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- HEALTH RECORDS
CREATE TABLE HealthRecords (
    health_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    record_date DATE NOT NULL,
    health_condition NVARCHAR(MAX) NOT NULL,
    remarks NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- DONATIONS
CREATE TABLE Donations (
    donation_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    collection_date DATE NOT NULL,
    next_donation DATE,
    remarks NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- BLOOD
-- BLOOD (gộp BloodType vào Blood)
CREATE TABLE Blood (
    blood_id INT PRIMARY KEY IDENTITY(1,1),
    donation_id INT NOT NULL,
    blood_type NVARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-')) NOT NULL,
    component_type NVARCHAR(20) CHECK (component_type IN ('Whole', 'RBCs', 'Platelets', 'WBCs')) NOT NULL,
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    storage_location NVARCHAR(100),
    status NVARCHAR(20) CHECK (status IN ('available', 'expired', 'used')),
    FOREIGN KEY (donation_id) REFERENCES Donations(donation_id)
);
GO

-- VOLUME (tham chiếu blood_id thay vì blood_type_id)
CREATE TABLE Volume (
    volume_id INT PRIMARY KEY IDENTITY(1,1),
    blood_id INT NOT NULL,
    volume INT NOT NULL,
    FOREIGN KEY (blood_id) REFERENCES Blood(blood_id) ON DELETE CASCADE
);
GO


-- DONATION REQUEST
CREATE TABLE DonationRequest (
    donation_request_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    request_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    health_notes NVARCHAR(MAX),
    staff_notes NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- RECEIVE REQUEST
CREATE TABLE ReceiveRequest (
    receive_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    blood_type NVARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-')) NOT NULL,
    component_type NVARCHAR(20) CHECK (component_type IN ('Whole', 'RBCs', 'Platelets', 'WBCs')) NOT NULL,
    quantity INT NOT NULL,
    volume INT NOT NULL,
    hospital_address NVARCHAR(255) NOT NULL,
    priority NVARCHAR(10) CHECK (priority IN ('medium', 'urgent')) DEFAULT 'medium',
    status NVARCHAR(20) CHECK (status IN ('pending', 'approved', 'canceled', 'placed')) DEFAULT 'pending',
    request_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- REQUEST ALLOCATION (KHÔNG CASCADE)
CREATE TABLE RequestAllocation (
    allocation_id INT PRIMARY KEY IDENTITY(1,1),
    receive_id INT NOT NULL,
    blood_id INT NOT NULL,
    allocation_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (receive_id) REFERENCES ReceiveRequest(receive_id), -- NO ACTION
    FOREIGN KEY (blood_id) REFERENCES Blood(blood_id) -- NO ACTION
);
GO

-- BLOG
CREATE TABLE Blog (
    blog_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_by INT NOT NULL,
    created_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

------------------------ My SQL Code
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),	 
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    dob DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'Unknown')),
    role VARCHAR(10) CHECK (role IN ('admin', 'staff', 'member', 'guest')) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('active', 'pending', 'banned')) DEFAULT 'pending',
    verify_code VARCHAR(10),
    code_expiration datetime
);

CREATE TABLE token (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- HEALTH RECORDS
CREATE TABLE healthrecords (
    health_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    record_date DATE NOT NULL,
    health_condition TEXT NOT NULL,
    remarks TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- DONATIONS
CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    collection_date DATE NOT NULL,
    next_donation DATE,
    remarks TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- BLOOD
CREATE TABLE blood (
    blood_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-')),
    component_type VARCHAR(20) CHECK (component_type IN ('Whole', 'RBCs', 'Platelets', 'WBCs')),
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    storage_location VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('available', 'expired', 'used')),
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id)
);

-- VOLUME
CREATE TABLE volume (
    volume_id INT AUTO_INCREMENT PRIMARY KEY,
    blood_id INT NOT NULL,
    volume INT NOT NULL,
    FOREIGN KEY (blood_id) REFERENCES blood(blood_id) ON DELETE CASCADE
);

-- DONATION REQUEST
CREATE TABLE donation_request (
    donation_request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    health_notes TEXT,
    staff_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- RECEIVE REQUEST
CREATE TABLE receive_request (
    receive_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-')),
    component_type VARCHAR(20) CHECK (component_type IN ('Whole', 'RBCs', 'Platelets', 'WBCs')),
    quantity INT NOT NULL,
    volume INT NOT NULL,
    hospital_address VARCHAR(255) NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('medium', 'urgent')) DEFAULT 'medium',
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'canceled', 'placed')) DEFAULT 'pending',
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- REQUEST ALLOCATION (KHÔNG CASCADE)
CREATE TABLE request_allocation (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    receive_id INT NOT NULL,
    blood_id INT NOT NULL,
    allocation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receive_id) REFERENCES receive_request(receive_id), -- NO ACTION
    FOREIGN KEY (blood_id) REFERENCES blood(blood_id) -- NO ACTION
);

-- BLOG
CREATE TABLE blog (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by INT NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);