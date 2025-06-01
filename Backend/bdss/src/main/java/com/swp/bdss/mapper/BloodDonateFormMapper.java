package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.entities.BloodDonateForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BloodDonateFormMapper {

    BloodDonateForm toBloodDonateForm(BloodDonateFormCreationRequest request);

    @Mapping(target = "user", ignore = true)
    BloodDonateFormResponse toBloodDonateFormResponse(BloodDonateForm bloodDonateForm);
}
