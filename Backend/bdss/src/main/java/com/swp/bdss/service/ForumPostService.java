package com.swp.bdss.service;

import com.swp.bdss.dto.request.ForumPostCreationRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.ForumPostResponse;
import com.swp.bdss.entities.ForumPost;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.ForumPostMapper;
import com.swp.bdss.repository.ForumPostRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ForumPostService {
    ForumPostRepository forumPostRepository;
    ForumPostMapper forumPostMapper;
    UserRepository userRepository;

    public ForumPostResponse createForumPost(ForumPostCreationRequest request){
        //convert
        ForumPost forumPost = forumPostMapper.toForumPost(request);

        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        forumPost.setUser(user);
        forumPost.setCreated_at(LocalDateTime.now());
        //save forum post
        forumPostRepository.save(forumPost);
        log.info("forum post created: {}", forumPostMapper.toForumPostResponse(forumPost));

        return forumPostMapper.toForumPostResponse(forumPost);
    }

    //delete forum post by id

    //@PreAuthorize("hasRole('USER')")
    public void deleteOwnPost(Long post_id) {
        ForumPost forumPost = forumPostRepository.findById(post_id)
                .orElseThrow(() -> new AppException(ErrorCode.FORUM_POST_NOT_EXISTED));

        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        if(!forumPost.getUser().getUsername().equals(username)){
            throw new AppException(ErrorCode.FORUM_POST_CANNOT_DELETE);
        }

        forumPostRepository.deleteById(post_id);
    }

    //@PreAuthorize("hasRole('ADMIN')")
    public void deletePostByAdmin(Long post_id) {
        ForumPost forumPost = forumPostRepository.findById(post_id)
                .orElseThrow(() -> new AppException(ErrorCode.FORUM_POST_NOT_EXISTED));

        forumPostRepository.deleteById(post_id);
        log.info("forum post deleted: {}", forumPost.getTitle());
    }

    //@PreAuthorize("hasRole('USER' , 'ADMIN')")
    //get all forum posts
    public List<ForumPostResponse> getAllForumPosts() {
        List<ForumPostResponse> list = forumPostRepository.findAll().stream()
                .map(forumPostMapper::toForumPostResponse)
                .toList();
        return list;
    }

    //@PreAuthorize("hasRole('USER' , 'ADMIN')")
    //get forum post by id
    public ForumPostResponse getForumPostById(Long post_id) {
        ForumPost forumPost = forumPostRepository.findById(post_id)
                .orElseThrow(() -> new AppException(ErrorCode.FORUM_POST_NOT_EXISTED));
        return forumPostMapper.toForumPostResponse(forumPost);
    }

    //@PreAuthorize("hasRole('USER' , 'ADMIN')")
    //search forum post by title or content
    public List<ForumPostResponse> searchForumPost(String search) {
        List<ForumPostResponse> list = forumPostRepository.findByTitleContainingOrContentContaining(search, search).stream()
                .map(forumPostMapper::toForumPostResponse)
                .toList();
        if (list.isEmpty()) {
            throw new AppException(ErrorCode.NO_FORUM_POST);
        }
        return list;
    }

    //get all forum posts by user
    public List<ForumPostResponse> getAllMyForumPostsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<ForumPostResponse> list = forumPostRepository.findByUser(user).stream()
                .map(forumPostMapper::toForumPostResponse)
                .toList();
        return list;
    }

    //update forum post by id
    public ForumPostResponse updateForumPost(Long post_id, ForumPostCreationRequest request) {
        ForumPost forumPost = forumPostRepository.findById(post_id)
                .orElseThrow(() -> new AppException(ErrorCode.FORUM_POST_NOT_EXISTED));

        forumPost.setTitle(request.getTitle());
        forumPost.setContent(request.getContent());
        forumPost.setUpdated_at(LocalDateTime.now());
        forumPostRepository.save(forumPost);

        return forumPostMapper.toForumPostResponse(forumPost);
    }

}
