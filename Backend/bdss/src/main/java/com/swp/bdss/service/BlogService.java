package com.swp.bdss.service;

import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.response.BlogResponse;
import com.swp.bdss.entities.Blog;
import com.swp.bdss.entities.BlogSection;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BlogMapper;
import com.swp.bdss.mapper.BlogSectionMapper;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BlogService {
    private final BlogRepository blogRepository;
    UserRepository userRepository;
    BlogMapper blogMapper;
    BlogSectionMapper blogSectionMapper;

    public BlogResponse createBlog(BlogCreationRequest request) {
        Blog blog = blogMapper.toBlog(request);

        blog.setStatus(true);
        blog.setCreated_date(LocalDate.now());

        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        blog.setUser(user);
        List<BlogSection> sections = request.getSections().stream()
                        .map(sectionReq -> {
                            BlogSection section = blogSectionMapper.toBlogSection(sectionReq);
                            section.setBlog(blog);
                            return section;
                        }).toList();
        blog.setSections(sections);


        blogRepository.save(blog);
        return blogMapper.toBlogResponse(blog);
    }

    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll().stream()
                .map(blogMapper::toBlogResponse)
                .toList();
    }

    public BlogResponse getBlogById(int blogId){
        return blogMapper.toBlogResponse(blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED)));
    }

    public List<BlogResponse> getMyBlog() {
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        List<Blog> list = blogRepository.findAllByUserUserId(userId);
        return list.stream().map(blogMapper::toBlogResponse).toList();
    }

    public BlogResponse updateBlog(int blogId, BlogCreationRequest request) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED));
        blog.setTitle(request.getTitle());
        List<BlogSection> sections = request.getSections().stream()
                .map(sectionReq -> {
                    BlogSection section = blogSectionMapper.toBlogSection(sectionReq);
                    section.setBlog(blog);
                    return section;
                }).collect(Collectors.toList());
        blog.getSections().clear();
        blog.getSections().addAll(sections);
        blog.setImage_link(request.getImage_link());
        return blogMapper.toBlogResponse(blogRepository.save(blog));
    }


    public void deleteBlog(int blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new AppException(ErrorCode.BLOG_NOT_EXISTED));
        blog.setStatus(false);
        blogRepository.save(blog);
    }

}
