package com.swp.bdss.dto.response;

import com.swp.bdss.entities.DonationProcess;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BloodDonateFormResponse {
    int donateId;
    UserResponse userResponse;
    //String full_name;
    String healthNotes;
    String status;
    LocalDateTime requestDate;
    List<UpdateDonationProcessStepResponse> steps;
}
