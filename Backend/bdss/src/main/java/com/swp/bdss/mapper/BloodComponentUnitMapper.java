package com.swp.bdss.mapper;

import com.swp.bdss.dto.response.BloodComponentUnitResponse;
import com.swp.bdss.entities.BloodComponentUnit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BloodComponentUnitMapper {
    @Mapping(target = "userResponse", ignore = true)
    BloodComponentUnitResponse toBloodComponentUnitResponse(BloodComponentUnit bloodComponentUnit);
}
