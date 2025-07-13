package com.swp.bdss.controller;

import com.google.protobuf.Api;
import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BlogResponse;
import com.swp.bdss.service.BlogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/blog")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class BlogController {
    BlogService blogService;

    @GetMapping("/count")
    public ApiResponse<Long> countAllBlogs() {
        return ApiResponse.<Long>builder()
                .code(1000)
                .data(blogService.countAllBlog())
                .build();
    }

    @PostMapping
    ApiResponse<BlogResponse> createBlog (@RequestBody BlogCreationRequest request){
        return ApiResponse.<BlogResponse>builder()
                .code(1000)
                .data(blogService.createBlog(request))
                .build();
    }

    @GetMapping("/top3")
    ApiResponse<List<BlogResponse>> getTop3Blog() {
        return ApiResponse.<List<BlogResponse>>builder()
                .code(1000)
                .data(blogService.getTop3Blogs())
                .build();
    }

    @GetMapping
    public ApiResponse<Page<BlogResponse>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.<Page<BlogResponse>>builder()
                .code(1000)
                .data(blogService.getAllBlogs(pageable))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<BlogResponse> getBlogById(@PathVariable("id") int id) {
        return ApiResponse.<BlogResponse>builder()
                .code(1000)
                .data(blogService.getBlogById(id))
                .build();
    }

    @GetMapping("/myBlog")
    ApiResponse<List<BlogResponse>> getMyBloodReceiveForm(){
        return ApiResponse.<List<BlogResponse>>builder()
                .code(1000)
                .data(blogService.getMyBlog())
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<BlogResponse> updateBlog(@PathVariable("id") int id, @RequestBody BlogCreationRequest request){
        return ApiResponse.<BlogResponse>builder()
                .code(1000)
                .data(blogService.updateBlog(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteBlog (@PathVariable("id") int id){
        blogService.deleteBlog(id);
        return ApiResponse.<String>builder()
                .code(1000)
                .data("Delete successful")
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<BlogResponse>> searchBlogs(
            @RequestParam String username,
            Pageable pageable
    ) {
        return ApiResponse.<Page<BlogResponse>>builder()
                .code(1000)
                .data(blogService.searchBlogsByUsername(username, pageable))
                .build();
    }
}
