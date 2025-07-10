package com.swp.bdss.service;


import com.swp.bdss.dto.request.CommentCreationRequest;
import com.swp.bdss.dto.response.CommentResponse;
import com.swp.bdss.entities.Comment;
import com.swp.bdss.entities.ForumPost;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.CommentMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.CommentRepository;
import com.swp.bdss.repository.ForumPostRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CommentService {

    CommentRepository commentRepository;
    UserRepository userRepository;
    ForumPostRepository forumPostRepository;
    CommentMapper commentMapper;
    UserMapper userMapper;

    public CommentResponse createComment(CommentCreationRequest request) {
        //convert
        Comment comment = commentMapper.toComment(request);

        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        ForumPost post = forumPostRepository.findById(request.getPostId())
                .orElseThrow(() -> new AppException(ErrorCode.FORUM_POST_NOT_EXISTED));

        comment.setUser(user);
        comment.setForumPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        log.info("User in comment: {}", comment.getUser());
        log.info("User in comment: {}", comment.getUser().getUsername());
        log.info("comment created: {}", commentMapper.toCommentResponse(comment));
        //save comment
        Comment savedComment = commentRepository.save(comment);

        log.info("comment created: {}", commentMapper.toCommentResponse(comment));

        return commentMapper.toCommentResponse(savedComment);

    }

    //delete comment by id

    //@PreAuthorize("hasRole('USER')")
    public void deleteOwnComment(Long comment_id) {
        Comment comment = commentRepository.findById(comment_id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        int userId = Integer.parseInt(SecurityContextHolder.getContext()
                .getAuthentication().getName());

        if (comment.getUser().getUserId() != userId) {
            throw new AppException(ErrorCode.COMMENT_CANNOT_DELETE);
        }

        commentRepository.deleteById(comment_id);
    }

    //@PreAuthorize("hasRole('ADMIN')")
    public void deleteCommentByAdmin(Long comment_id) {
        Comment comment = commentRepository.findById(comment_id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));

        commentRepository.deleteById(comment_id);
        log.info("comment deleted: {}", comment.getContent());
    }

    public Long countAllComments(){
        return commentRepository.count();
    }

}
