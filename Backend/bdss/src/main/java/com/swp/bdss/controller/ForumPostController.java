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
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/{post_id}")
    ApiResponse<Void> deleteOwnPost(@PathVariable Long post_id) {
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
}
