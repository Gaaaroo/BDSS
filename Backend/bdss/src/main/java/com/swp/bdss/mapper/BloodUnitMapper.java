package com.swp.bdss.mapper;

import com.swp.bdss.dto.response.BloodUnitResponse;
import com.swp.bdss.entities.BloodUnit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BloodUnitMapper {
    @Mapping(target = "userResponse", ignore = true)
    @Mapping(target = "receiveUser", ignore = true)
    BloodUnitResponse toBloodUnitResponse(BloodUnit bloodUnit);
}
