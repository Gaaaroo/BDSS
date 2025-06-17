package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.UpdateDonationProcessStepRequest;
import com.swp.bdss.dto.response.UpdateDonationProcessStepResponse;
import com.swp.bdss.entities.DonationProcess;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DonationProcessMapper {
    DonationProcess toDonationProcess(UpdateDonationProcessStepRequest request);

    @Mapping(source = "bloodDonateForm.donateId", target = "donateId")
    @Mapping(source = "updatedBy.username" , target = "updatedBy")
    UpdateDonationProcessStepResponse toUpdateDonationProcessStepResponse(DonationProcess donationProcess);

}
