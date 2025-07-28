

------------------------ My SQL Code
-- create database BDSS
-- use BDSS
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255),
    full_name VARCHAR(100),	 
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    dob DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'Unknown')),
	role VARCHAR(10) NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'MEMBER')) DEFAULT 'MEMBER',
	status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'pending', 'banned')) DEFAULT 'pending',

    verify_code VARCHAR(10),
    code_expiration datetime
);

CREATE TABLE invalidated_token (
    token_id varchar(255) not null PRIMARY KEY,
    user_id integer not null,
    expiry_time datetime(6),
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


INSERT INTO BDSS.users (user_id, address, blood_type, dob, email, full_name, gender, image_link, is_active, lat, lng, password, phone, `role`, status, username) VALUES
(0, '12 Lê Lợi, Bến Thành, Quận 1, Hồ Chí Minh, Vietnam', 'O+', '1999-04-15', 'nguyenvana1@example.com', 'Nguyễn Văn A', 'Male', '', 1, 10.7769, 106.7009, '123456', '0912345670', 'MEMBER', 'ACTIVE', 'nguyenvana1'),
(0, '45 Trần Hưng Đạo, Phường 5, Quận 5, Hồ Chí Minh, Vietnam', 'A+', '1995-09-21', 'tranthingocb@example.com', 'Trần Thị Ngọc B', 'Female', '', 1, 10.7530, 106.6664, '123456', '0912345671', 'MEMBER', 'ACTIVE', 'ngocbtran'),
(0, '88 Nguyễn Trãi, Phường 3, Quận 5, Hồ Chí Minh, Vietnam', 'B-', '2001-12-11', 'lequocd@example.com', 'Lê Quốc D', 'Male', '', 1, 10.7583, 106.6767, '123456', '0912345672', 'MEMBER', 'ACTIVE', 'quocdle'),
(0, '5 Phạm Ngũ Lão, Phường 1, Quận Gò Vấp, Hồ Chí Minh, Vietnam', 'AB+', '1990-06-09', 'phamthie@example.com', 'Phạm Thị E', 'Female', '', 1, 10.8383, 106.6640, '123456', '0912345673', 'MEMBER', 'ACTIVE', 'phamthie'),
(0, '99 Lý Thường Kiệt, Phường 7, Quận 10, Hồ Chí Minh, Vietnam', 'O-', '1998-01-30', 'dangvanf@example.com', 'Đặng Văn F', 'Male', '', 1, 10.7741, 106.6676, '123456', '0912345674', 'MEMBER', 'ACTIVE', 'dangvanf'),
(0, '123 Cách Mạng Tháng 8, Quận Tân Bình, Hồ Chí Minh, Vietnam', 'AB-', '2000-11-01', 'hoangthig@example.com', 'Hoàng Thị G', 'Female', '', 1, 10.7952, 106.6533, '123456', '0912345675', 'MEMBER', 'ACTIVE', 'hoanggthi'),
(0, '7 Hoàng Văn Thụ, Phường 4, Quận Phú Nhuận, Hồ Chí Minh, Vietnam', 'A-', '1992-07-17', 'nguyenthanhh@example.com', 'Nguyễn Thanh H', 'Male', '', 1, 10.7995, 106.6784, '123456', '0912345676', 'MEMBER', 'ACTIVE', 'thanhnguyenh'),
(0, '20 Nguyễn Kiệm, Phường 3, Quận Gò Vấp, Hồ Chí Minh, Vietnam', 'B+', '1996-03-03', 'lehung@example.com', 'Lê Hùng', 'Male', '', 1, 10.8220, 106.6852, '123456', '0912345677', 'MEMBER', 'ACTIVE', 'lehung123'),
(0, '135 Phan Xích Long, Phường 7, Quận Phú Nhuận, Hồ Chí Minh, Vietnam', 'O+', '1997-02-27', 'trangpham@example.com', 'Phạm Thị Trang', 'Female', '', 1, 10.8036, 106.6872, '123456', '0912345678', 'MEMBER', 'ACTIVE', 'phamtrang'),
(0, '50 Võ Văn Tần, Quận 3, Hồ Chí Minh, Vietnam', 'A+', '1993-10-05', 'minhhoang@example.com', 'Hoàng Minh', 'Male', '', 1, 10.7784, 106.6848, '123456', '0912345679', 'MEMBER', 'ACTIVE', 'minhhoang90'),
(0, '2 Nguyễn Thông, Quận 3, Hồ Chí Minh, Vietnam', 'O-', '1991-01-10', 'khoinguyen@example.com', 'Nguyễn Khôi', 'Male', '', 1, 10.7812, 106.6843, '123456', '0912345690', 'MEMBER', 'ACTIVE', 'khoinguyen91'),
(0, '88 Đinh Tiên Hoàng, Quận Bình Thạnh, Hồ Chí Minh, Vietnam', 'B+', '1994-08-22', 'linhpham@example.com', 'Phạm Linh', 'Female', '', 1, 10.8055, 106.7100, '123456', '0912345691', 'MEMBER', 'ACTIVE', 'linhpham'),
(0, '76 Cộng Hòa, Quận Tân Bình, Hồ Chí Minh, Vietnam', 'AB+', '1989-06-14', 'tuananh@example.com', 'Lê Tuấn Anh', 'Male', '', 1, 10.8010, 106.6473, '123456', '0912345692', 'MEMBER', 'ACTIVE', 'tuananhle'),
(0, '31 Nguyễn Trọng Tuyển, Quận Phú Nhuận, Hồ Chí Minh, Vietnam', 'A-', '2002-12-24', 'thaonguyen@example.com', 'Nguyễn Thảo', 'Female', '', 1, 10.7970, 106.6814, '123456', '0912345693', 'MEMBER', 'ACTIVE', 'thaonguyen02'),
(0, '99 Trường Chinh, Quận 12, Hồ Chí Minh, Vietnam', 'O+', '1998-09-17', 'buihuynh@example.com', 'Bùi Huỳnh', 'Male', '', 1, 10.8553, 106.6279, '123456', '0912345694', 'MEMBER', 'ACTIVE', 'buihuynh98'),
(0, '27 Nguyễn Văn Quá, Quận 12, Hồ Chí Minh, Vietnam', 'AB-', '1990-11-19', 'anhthu@example.com', 'Phạm Anh Thư', 'Female', '', 1, 10.8632, 106.6274, '123456', '0912345695', 'MEMBER', 'ACTIVE', 'anhthupham'),
(0, '12 Phan Văn Trị, Quận Bình Thạnh, Hồ Chí Minh, Vietnam', 'A+', '2001-03-30', 'namhoang@example.com', 'Hoàng Nam', 'Male', '', 1, 10.8142, 106.7053, '123456', '0912345696', 'MEMBER', 'ACTIVE', 'namhoang01'),
(0, '22 Trần Văn Đang, Quận 3, Hồ Chí Minh, Vietnam', 'O-', '2003-05-05', 'huyenpham@example.com', 'Phạm Huyền', 'Female', '', 1, 10.7787, 106.6801, '123456', '0912345697', 'MEMBER', 'ACTIVE', 'huyenpham03'),
(0, '15 Nguyễn Oanh, Quận Gò Vấp, Hồ Chí Minh, Vietnam', 'B+', '1997-07-07', 'khoapham@example.com', 'Phạm Khoa', 'Male', '', 1, 10.8350, 106.6789, '123456', '0912345698', 'MEMBER', 'ACTIVE', 'phamkhoa97'),
(0, '50 Nguyễn Thị Minh Khai, Quận 1, Hồ Chí Minh, Vietnam', 'A-', '1995-05-22', 'tramle@example.com', 'Lê Thị Trâm', 'Female', '', 1, 10.7765, 106.6997, '123456', '0912345699', 'MEMBER', 'ACTIVE', 'tramle95');
(0, '9 Nguyễn Cư Trinh, Quận 1, Hồ Chí Minh, Vietnam', 'B+', '1998-02-11', 'quangvo@example.com', 'Võ Quang', 'Male', '', 1, 10.7683, 106.6924, '123456', '0912345700', 'MEMBER', 'ACTIVE', 'voquang98'),
(0, '27 Lê Lai, Bến Thành, Quận 1, Hồ Chí Minh, Vietnam', 'O+', '2000-10-05', 'hiennguyen@example.com', 'Nguyễn Thị Hiền', 'Female', '', 1, 10.7710, 106.6937, '123456', '0912345701', 'MEMBER', 'ACTIVE', 'hiennguyen00'),
(0, '83 Phạm Văn Đồng, Thủ Đức, Hồ Chí Minh, Vietnam', 'A+', '1997-07-17', 'tanle@example.com', 'Lê Tấn', 'Male', '', 1, 10.8482, 106.7690, '123456', '0912345702', 'MEMBER', 'ACTIVE', 'letan97'),
(0, '3 Trần Hưng Đạo, Quận 5, Hồ Chí Minh, Vietnam', 'AB-', '1993-03-22', 'thuylinh@example.com', 'Nguyễn Thùy Linh', 'Female', '', 1, 10.7559, 106.6667, '123456', '0912345703', 'MEMBER', 'ACTIVE', 'thuylinh93'),
(0, '122 Nguyễn Văn Cừ, Quận 5, Hồ Chí Minh, Vietnam', 'O-', '1996-05-06', 'dangkhoa@example.com', 'Đặng Khoa', 'Male', '', 1, 10.7578, 106.6821, '123456', '0912345704', 'MEMBER', 'ACTIVE', 'dangkhoa96'),
(0, '35 Nguyễn Hữu Cảnh, Bình Thạnh, Hồ Chí Minh, Vietnam', 'AB+', '1991-01-12', 'camtu@example.com', 'Phan Cẩm Tú', 'Female', '', 1, 10.7920, 106.7132, '123456', '0912345705', 'MEMBER', 'ACTIVE', 'phantu91'),
(0, '88 Đinh Bộ Lĩnh, Bình Thạnh, Hồ Chí Minh, Vietnam', 'B-', '1995-09-03', 'thanhluan@example.com', 'Nguyễn Thành Luân', 'Male', '', 1, 10.8124, 106.7133, '123456', '0912345706', 'MEMBER', 'ACTIVE', 'luannguyen95'),
(0, '10 Nguyễn Văn Đậu, Phường 5, Bình Thạnh, Hồ Chí Minh, Vietnam', 'A-', '1999-04-30', 'myhanh@example.com', 'Trần Mỹ Hạnh', 'Female', '', 1, 10.8050, 106.6961, '123456', '0912345707', 'MEMBER', 'ACTIVE', 'hanhmy99'),
(0, '21 Nguyễn Ảnh Thủ, Quận 12, Hồ Chí Minh, Vietnam', 'O+', '1998-08-15', 'kimtuyen@example.com', 'Lê Kim Tuyến', 'Female', '', 1, 10.8601, 106.6234, '123456', '0912345708', 'MEMBER', 'ACTIVE', 'kimtuyen98'),
(0, '19 Trường Sa, Quận 3, Hồ Chí Minh, Vietnam', 'B+', '2002-12-20', 'longvo@example.com', 'Võ Trường Long', 'Male', '', 1, 10.7861, 106.6889, '123456', '0912345709', 'MEMBER', 'ACTIVE', 'longtruong02'),
(0, '1 Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam', 'A+', '1990-11-25', 'lananh@example.com', 'Ngô Lan Anh', 'Female', '', 1, 10.7840, 106.6892, '123456', '0912345710', 'MEMBER', 'ACTIVE', 'lananh90'),
(0, '67 Phạm Thế Hiển, Quận 8, Hồ Chí Minh, Vietnam', 'O-', '1992-02-13', 'dinhphu@example.com', 'Đinh Văn Phú', 'Male', '', 1, 10.7250, 106.6820, '123456', '0912345711', 'MEMBER', 'ACTIVE', 'phudinh92'),
(0, '4 Nguyễn Thị Định, Quận 2, Hồ Chí Minh, Vietnam', 'B-', '1994-09-18', 'thuyduong@example.com', 'Nguyễn Thùy Dương', 'Female', '', 1, 10.7721, 106.7519, '123456', '0912345712', 'MEMBER', 'ACTIVE', 'duongthuy94'),
(0, '109 Lê Đức Thọ, Quận Gò Vấp, Hồ Chí Minh, Vietnam', 'AB+', '1996-01-02', 'ngocbao@example.com', 'Lý Ngọc Bảo', 'Male', '', 1, 10.8381, 106.6602, '123456', '0912345713', 'MEMBER', 'ACTIVE', 'baoly96'),
(0, '50 Bùi Hữu Nghĩa, Bình Thạnh, Hồ Chí Minh, Vietnam', 'A-', '1997-08-28', 'yennguyen@example.com', 'Nguyễn Thị Yến', 'Female', '', 1, 10.8135, 106.7031, '123456', '0912345714', 'MEMBER', 'ACTIVE', 'yennguyen97'),
(0, '75 Nguyễn Văn Lượng, Gò Vấp, Hồ Chí Minh, Vietnam', 'B+', '1993-07-08', 'trungkien@example.com', 'Trần Trung Kiên', 'Male', '', 1, 10.8380, 106.6714, '123456', '0912345715', 'MEMBER', 'ACTIVE', 'kientran93'),
(0, '99 Trần Não, Quận 2, Hồ Chí Minh, Vietnam', 'AB-', '1991-05-19', 'bichvan@example.com', 'Phạm Bích Vân', 'Female', '', 1, 10.7943, 106.7395, '123456', '0912345716', 'MEMBER', 'ACTIVE', 'vanbich91'),
(0, '22 Võ Văn Ngân, Thủ Đức, Hồ Chí Minh, Vietnam', 'O+', '2000-06-12', 'anhvu@example.com', 'Vũ Anh', 'Male', '', 1, 10.8498, 106.7621, '123456', '0912345717', 'MEMBER', 'ACTIVE', 'anhvu2000'),
(0, '9 Nguyễn Hữu Thọ, Quận 7, Hồ Chí Minh, Vietnam', 'A+', '1994-04-04', 'nhungtran@example.com', 'Trần Nhung', 'Female', '', 1, 10.7366, 106.7052, '123456', '0912345718', 'MEMBER', 'ACTIVE', 'tran_nhung'),
(0, '77 Lê Văn Việt, Quận 9, Hồ Chí Minh, Vietnam', 'B-', '1999-12-01', 'quochuy@example.com', 'Lê Quốc Huy', 'Male', '', 1, 10.8424, 106.7985, '123456', '0912345719', 'MEMBER', 'ACTIVE', 'quochuy99');


INSERT INTO BDSS.blood_unit
(blood_id, blood_type, donated_date, expiry_date, note, status, volume, donate_id, receive_id)
VALUES
(0, 'A+', '2025-07-15 10:12:35', '2025-09-09 10:12:35', '', 'Stored', 350, 71, NULL),
(0, 'O-', '2025-07-20 14:25:00', '2025-09-14 14:25:00', '', 'Stored', 250, 72, NULL),
(0, 'B+', '2025-07-12 09:10:21', '2025-09-06 09:10:21', '', 'Stored', 450, 73, NULL),
(0, 'AB-', '2025-07-22 08:45:00', '2025-09-16 08:45:00', '', 'Stored', 250, 74, NULL),
(0, 'AB-', '2025-07-18 13:40:55', '2025-09-12 13:40:55', '', 'Stored', 350, 75, NULL),
(0, 'O+', '2025-07-26 11:33:22', '2025-09-20 11:33:22', '', 'Stored', 450, 76, NULL),
(0, 'B-', '2025-07-10 16:00:00', '2025-09-04 16:00:00', '', 'Stored', 250, 77, NULL),
(0, 'AB-', '2025-07-17 12:22:19', '2025-09-11 12:22:19', '', 'Stored', 350, 78, NULL),
(0, 'A+', '2025-07-14 15:45:30', '2025-09-08 15:45:30', '', 'Stored', 450, 79, NULL),
(0, 'O-', '2025-07-13 10:10:10', '2025-09-06 10:10:10', '', 'Stored', 350, 80, NULL),
(0, 'B+', '2025-07-21 11:11:11', '2025-09-15 11:11:11', '', 'Stored', 250, 81, NULL),
(0, 'AB-', '2025-07-23 17:00:00', '2025-09-16 17:00:00', '', 'Stored', 450, 82, NULL),
(0, 'A+', '2025-07-19 09:30:00', '2025-09-12 09:30:00', '', 'Stored', 250, 83, NULL),
(0, 'O+', '2025-07-25 08:20:00', '2025-09-19 08:20:00', '', 'Stored', 350, 84, NULL),
(0, 'B-', '2025-07-16 14:00:00', '2025-09-09 14:00:00', '', 'Stored', 450, 85, NULL),
(0, 'AB-', '2025-07-11 16:30:00', '2025-09-05 16:30:00', '', 'Stored', 250, 86, NULL),
(0, 'A+', '2025-07-24 12:45:00', '2025-09-17 12:45:00', '', 'Stored', 350, 87, NULL),
(0, 'O-', '2025-07-27 13:00:00', '2025-09-20 13:00:00', '', 'Stored', 450, 88, NULL),
(0, 'B+', '2025-07-09 09:00:00', '2025-09-02 09:00:00', '', 'Stored', 350, 89, NULL),
(0, 'AB-', '2025-07-08 10:15:00', '2025-09-01 10:15:00', '', 'Stored', 250, 90, NULL);




INSERT INTO BDSS.donation_request
(donate_id, health_notes, request_date, status, user_id, staff_notes)
VALUES
(0, 'Healthy, no symptoms of illness', '2025-07-01 00:00:00', 'APPROVED', 49, ''),
(0, 'Recovered from flu 3 weeks ago', '2025-07-04 00:00:00', 'APPROVED', 52, ''),
(0, 'Regular donor, no health issues', '2025-07-07 00:00:00', 'APPROVED', 55, ''),
(0, 'Slight fatigue, advised rest before donation', '2025-07-10 00:00:00', 'APPROVED', 58, ''),
(0, 'Good overall health, no medications', '2025-07-13 00:00:00', 'APPROVED', 60, ''),
(0, 'Blood pressure normal, no concerns', '2025-07-16 00:00:00', 'APPROVED', 63, ''),
(0, 'Minor allergies, not on treatment', '2025-07-19 00:00:00', 'APPROVED', 66, ''),
(0, 'No previous donation reactions', '2025-07-22 00:00:00', 'APPROVED', 69, ''),
(0, 'Physically fit, regular exercise', '2025-07-25 00:00:00', 'APPROVED', 72, ''),
(0, 'Slight anemia history, cleared by doctor', '2025-07-02 00:00:00', 'APPROVED', 75, ''),
(0, 'Fully vaccinated, no symptoms', '2025-07-05 00:00:00', 'APPROVED', 78, ''),
(0, 'No alcohol consumption before donation', '2025-07-08 00:00:00', 'APPROVED', 81, ''),
(0, 'No surgeries in the last 6 months', '2025-07-11 00:00:00', 'APPROVED', 84, ''),
(0, 'Recently completed full blood test', '2025-07-14 00:00:00', 'APPROVED', 87, ''),
(0, 'Cleared for donation by physician', '2025-07-17 00:00:00', 'APPROVED', 90, ''),
(0, 'History of mild asthma, currently stable', '2025-07-20 00:00:00', 'APPROVED', 93, ''),
(0, 'No tobacco use', '2025-07-03 00:00:00', 'APPROVED', 51, ''),
(0, 'Good iron levels, no dietary issues', '2025-07-06 00:00:00', 'APPROVED', 54, ''),
(0, 'Passed pre-donation screening', '2025-07-09 00:00:00', 'APPROVED', 57, ''),
(0, 'Healthy BMI, no chronic conditions', '2025-07-12 00:00:00', 'APPROVED', 61, '');
