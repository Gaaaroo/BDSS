package com.swp.bdss.mapper;

import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.request.BlogSectionCreationRequest;
import com.swp.bdss.dto.response.BlogResponse;
import com.swp.bdss.entities.Blog;
import com.swp.bdss.entities.BlogSection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BlogSectionMapper {
    BlogSection toBlogSection(BlogSectionCreationRequest request);

}
