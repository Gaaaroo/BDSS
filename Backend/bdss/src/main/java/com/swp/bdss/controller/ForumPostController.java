package com.swp.bdss.controller;

import com.swp.bdss.dto.request.ForumPostCreationRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.ForumPostResponse;
import com.swp.bdss.service.BlogService;
import com.swp.bdss.service.ForumPostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/forum")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class ForumPostController {
    ForumPostService forumPostService;

    @PostMapping
    ApiResponse<ForumPostResponse> createForumPost(@RequestBody ForumPostCreationRequest request){
        return ApiResponse.<ForumPostResponse>builder()
                .code(1111)
                .data(forumPostService.createForumPost(request))
                .message("create forum post successfully")
                .build();
    }

    @DeleteMapping("/my-posts")
    ApiResponse<Void> deleteOwnPost(@RequestParam Long post_id) {
        forumPostService.deleteOwnPost(post_id);
        return ApiResponse.<Void>builder()
                .code(1111)
                .message("delete forum post successfully")
                .build();
    }

    @DeleteMapping("/admin/{post_id}")
    ApiResponse<Void> deletePostByAdmin(@PathVariable Long post_id) {
        forumPostService.deletePostByAdmin(post_id);
        return ApiResponse.<Void>builder()
                .code(1111)
                .message("delete forum post by admin successfully")
                .build();
    }

    @GetMapping
    ApiResponse<List<ForumPostResponse>> getAllForumPosts() {
        return ApiResponse.<List<ForumPostResponse>>builder()
                .code(1111)
                .data(forumPostService.getAllForumPosts())
                .message("get all forum posts successfully")
                .build();
    }

    @GetMapping("/{post_id}")
    ApiResponse<ForumPostResponse> getForumPostById(@PathVariable Long post_id) {
        return ApiResponse.<ForumPostResponse>builder()
                .code(1111)
                .data(forumPostService.getForumPostById(post_id))
                .message("get forum post by id successfully")
                .build();
    }

    //search forum posts by title or content
    // //forum/search?keyword=some_keyword
    @GetMapping("/search")
    ApiResponse<List<ForumPostResponse>> searchForumPosts(@RequestParam String keyword) {
        return ApiResponse.<List<ForumPostResponse>>builder()
                .code(1111)
                .data(forumPostService.searchForumPost(keyword))
                .message("search forum posts successfully")
                .build();
    }

    //get all my forum posts
    // my-posts?username=some_username
    @GetMapping("/my-posts")
    ApiResponse<List<ForumPostResponse>> getMyForumPosts(@RequestParam String username) {
        return ApiResponse.<List<ForumPostResponse>>builder()
                .code(1111)
                .data(forumPostService.getAllMyForumPostsByUser(username))
                .message("get my forum posts successfully")
                .build();
    }

    //update forum post
    @PutMapping("/my-posts/update")
    ApiResponse<ForumPostResponse> updateForumPost(@RequestParam Long post_id, @RequestBody ForumPostCreationRequest request) {
        return ApiResponse.<ForumPostResponse>builder()
                .code(1111)
                .data(forumPostService.updateForumPost(post_id, request))
                .message("update forum post successfully")
                .build();
    }

}
