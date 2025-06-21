package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.UpdateReceivingProcessStepRequest;
import com.swp.bdss.dto.response.UpdateReceivingProcessStepResponse;
import com.swp.bdss.entities.ReceivingProcess;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReceivingProcessMapper {
    ReceivingProcess toReceivingProcess(UpdateReceivingProcessStepRequest request);

    @Mapping(source = "bloodReceiveForm.receiveId", target = "receiveId")
    @Mapping(source = "updatedBy.username" , target = "updatedBy")
    UpdateReceivingProcessStepResponse toUpdateReceivingProcessStepResponse(ReceivingProcess receivingProcess);
}
