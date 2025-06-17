package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UpdateDonationProcessStepResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.DonationProcess;
import com.swp.bdss.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {DonationProcessMapper.class})
public interface BloodDonateFormMapper {

    BloodDonateForm toBloodDonateForm(BloodDonateFormCreationRequest request);

    @Mapping(source = "user", target = "userResponse")
            @Mapping(source = "steps", target = "steps")
    //@Mapping(target = "user", ignore = true)

    BloodDonateFormResponse toBloodDonateFormResponse(BloodDonateForm bloodDonateForm);

    List<UpdateDonationProcessStepResponse> toDonationProcessResponseList(List<DonationProcess> steps);

}
