package com.swp.bdss.controller;


import com.swp.bdss.dto.request.CommentCreationRequest;
import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.CommentResponse;
import com.swp.bdss.repository.CommentRepository;
import com.swp.bdss.service.CommentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/comment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class CommentController {
    private final CommentRepository commentRepository;
    CommentService commentService;

    @PostMapping
    ApiResponse<CommentResponse> createComment(@RequestBody CommentCreationRequest request){
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .data(commentService.createComment(request))
                .message("Create comment successfully")
                .build();
    }

    @DeleteMapping("/delete")
     ApiResponse<CommentResponse> deleteOwnComment(@RequestParam Long comment_id) {
        commentService.deleteOwnComment(comment_id);
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .message("Delete comment successfully")
                .build();
    }

    @DeleteMapping("/admin/{comment_id}")
    ApiResponse<CommentResponse> deleteCommentByAdmin(@PathVariable Long comment_id) {
        commentService.deleteCommentByAdmin(comment_id);
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .message("Admin delete comment successfully")
                .build();
    }
}
