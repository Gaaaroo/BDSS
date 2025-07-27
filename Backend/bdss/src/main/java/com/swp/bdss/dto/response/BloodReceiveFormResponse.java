package com.swp.bdss.dto.response;

import com.swp.bdss.entities.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodReceiveFormResponse {
    int receiveId;
    UserResponse user;
    String bloodType;
    String componentType;
    int quantity;
    int volume;
    String hospitalAddress;
    String priority;
    LocalDate requestDate;
    String status;
//    LocalDate requiredDate;
    List<UpdateReceivingProcessStepResponse> steps;
}
