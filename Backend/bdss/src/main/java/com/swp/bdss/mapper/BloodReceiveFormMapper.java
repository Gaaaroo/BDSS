package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UpdateDonationProcessStepResponse;
import com.swp.bdss.dto.response.UpdateReceivingProcessStepResponse;
import com.swp.bdss.entities.BloodReceiveForm;
import com.swp.bdss.entities.DonationProcess;
import com.swp.bdss.entities.ReceivingProcess;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ReceivingProcessMapper.class})
public interface BloodReceiveFormMapper {
    @Mapping(target = "requestDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    BloodReceiveForm toBloodReceiveForm(BloodReceiveFormCreationRequest request);

    @Mapping(source = "receiveId", target = "receiveId")
    @Mapping(source = "user", target = "user")
    @Mapping(source = "steps", target = "steps")
    @Mapping(target = "bloodReceived", ignore = true)
    BloodReceiveFormResponse toBloodReceiveFormResponse(BloodReceiveForm bloodReceiveForm);

    List<UpdateReceivingProcessStepResponse> toReceivingProcessResponseList(List<ReceivingProcess> steps);

}
