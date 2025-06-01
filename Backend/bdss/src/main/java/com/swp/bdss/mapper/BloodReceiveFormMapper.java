package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.entities.BloodReceiveForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BloodReceiveFormMapper {
    @Mapping(target = "request_date", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    BloodReceiveForm toBloodReceiveForm(BloodReceiveFormCreationRequest request);

    @Mapping(source = "receive_id", target = "receive_id")
    BloodReceiveFormResponse toBloodReceiveFormResponse(BloodReceiveForm bloodReceiveForm);
}
