package com.swp.bdss.controller;

import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.BlogResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.service.BlogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/blog")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class BlogController {
    BlogService blogService;

    @PostMapping
    ApiResponse<BlogResponse> createBlog (@RequestBody BlogCreationRequest request){
        return ApiResponse.<BlogResponse>builder()
                .code(1000)
                .data(blogService.createBlog(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<BlogResponse>> getAllBlog() {
        return ApiResponse.<List<BlogResponse>>builder()
                .code(1000)
                .data(blogService.getAllBlogs())
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

    @DeleteMapping
    String deleteBlog (@RequestParam int id){
        blogService.deleteBlog(id);
        return "Delete successfully";
    }
}
