package com.swp.bdss.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "receive_request")
public class BloodReceiveForm {
    @Id
    int receive_id;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    User user;
    String blood_type;
    String component_type;
    int quantity;
    int volume;
    String hospital_address;
    String priority;
    String status;
    LocalDate request_date;

    // cách lấy User từ BloodReceiveForm
//    BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(101);
//    User user = bloodReceiveForm.getUser(); // Trả về User có user_id = 1
//   System.out.println(user.getName()); // In ra "John Doe"

    // cách lưu form
//    User user = userRepository.findById(2);
//    BloodReceiveForm form = new BloodReceiveForm();
//   form.setBloodType("O+");
//   form.setQuantity(3);
//   form.setHospitalAddress("789 Blood St");
//   form.setUser(user); // Gắn user vào yêu cầu nhận máu
//
//   bloodReceiveFormRepository.save(form);
}
