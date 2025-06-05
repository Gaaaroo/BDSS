package com.swp.bdss.service;

import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.request.UserCreationRequest;
import com.swp.bdss.dto.response.BlogResponse;
import com.swp.bdss.dto.response.BloodReceiveFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.Blog;
import com.swp.bdss.entities.BloodReceiveForm;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BlogMapper;
import com.swp.bdss.repository.BlogRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BlogService {
    private final BlogRepository blogRepository;
    UserRepository userRepository;
    BlogMapper blogMapper;

    public BlogResponse createBlog(BlogCreationRequest request) {
        Blog blog = blogMapper.toBlog(request);

        blog.setStatus(true);
        blog.setCreated_date(LocalDate.now());

        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        blog.setUser(user);

        blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    public List<BlogResponse> getAllBlogs() {
        List<BlogResponse> list = blogRepository.findAll().stream()
                .map(blogMapper::toBlogResponse)
                .toList();
        return list;
    }

    public BlogResponse getBlogById(int blogId){
        return blogMapper.toBlogResponse(blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED)));
    }

    public List<BlogResponse> getMyBlog() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        List<Blog> list = blogRepository.findAllByUserUsername(username);
        return list.stream().map(blogMapper::toBlogResponse).toList();
    }

    public BlogResponse updateBlog(int blogId, BlogCreationRequest request) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED));
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setImage_link(request.getImage_link());
        return blogMapper.toBlogResponse(blogRepository.save(blog));
    }

    public void deleteBlog(int blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED));
        blog.setStatus(false);
        blogRepository.save(blog);
    }

}
