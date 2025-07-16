package com.swp.bdss.service;

import com.swp.bdss.dto.request.BlogCreationRequest;
import com.swp.bdss.dto.request.BlogSectionCreationRequest;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogServiceTest {

    @Mock
    private BlogRepository blogRepository;

    @Mock
    private BlogMapper blogMapper;

    @Mock
    private BlogSectionMapper blogSectionMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BlogService blogService;

    private BlogCreationRequest request;
    private Blog blog;
    private BlogResponse response;
    private User user;
    private BlogSection section;
    private BlogSectionCreationRequest sectionRequest;

    @BeforeEach
    void setUp() {
        // Giả lập user đang login
        user = new User();
        user.setUserId(1);
        user.setUsername("john");

        sectionRequest = BlogSectionCreationRequest.builder()
                .content("Section 1")
                .imageLink("img1.jpg")
                .build();

        request = BlogCreationRequest.builder()
                .title("My Blog")
                .imageLink("main.jpg")
                .sections(List.of(sectionRequest))
                .build();

        blog = new Blog();
        blog.setBlogId(1);
        blog.setTitle("My Blog");
        blog.setUser(user);
        blog.setCreatedDate(LocalDate.now());
        blog.setImageLink("main.jpg");
        blog.setStatus(true);

        section = new BlogSection();
        section.setContent("Section 1");
        section.setImageLink("img1.jpg");
        section.setBlog(blog);

        response = BlogResponse.builder()
                .blogId(1)
                .title("My Blog")
                .userCreate("john")
                .createdDate(LocalDate.now())
                .imageLink("main.jpg")
                .status(true)
                .sections(List.of(sectionRequest))
                .build();
    }

    // create blog

    //UTCID01
    /**
     * Test: Tạo blog thành công
     */
    @Test
    void createBlog_success() {
        // Giả lập SecurityContext trả về userId = 1
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("1");

        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);

        SecurityContextHolder.setContext(context);

        // Giả lập các bước trong logic
        when(blogMapper.toBlog(request)).thenReturn(blog);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(blogSectionMapper.toBlogSection(sectionRequest)).thenReturn(section);
        when(blogMapper.toBlogResponse(blog)).thenReturn(response);

        BlogResponse result = blogService.createBlog(request);

        assertEquals("Wrong Title", result.getTitle());
        assertEquals("john", result.getUserCreate());
        assertEquals("main.jpg", result.getImageLink());
        assertEquals(1, result.getSections().size());

        verify(blogMapper).toBlog(request);
        verify(userRepository).findById(1);
        verify(blogSectionMapper).toBlogSection(sectionRequest);
        verify(blogRepository).save(blog);
        verify(blogMapper).toBlogResponse(blog);
    }


    //UTCID03
    /**
     * Test: Tạo blog thất bại nếu user không tồn tại
     */
    @Test
    void createBlog_userNotFound_throwException() {
        // Giả lập SecurityContext trả về userId = 1
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("1");

        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);

        SecurityContextHolder.setContext(context);

        // Giả lập không tìm thấy user
        when(blogMapper.toBlog(request)).thenReturn(blog);
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> {
            blogService.createBlog(request);
        });

        assertEquals(ErrorCode.USER_NOT_EXISTED, ex.getErrorCode());

        verify(userRepository).findById(1);
        verify(blogRepository, never()).save(any());
    }

    // updateBlog

    //UTCID02
    /**
     * Test: Cập nhật blog thành công
     */
    @Test
    void updateBlog_success() {
        // Giả lập blog có sẵn trong DB
        when(blogRepository.findById(1)).thenReturn(Optional.of(blog));

        // Giả lập mapper cho section
        when(blogSectionMapper.toBlogSection(sectionRequest)).thenReturn(section);

        // Giả lập SecurityContext trả về userId = 1
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("1");

        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);

        SecurityContextHolder.setContext(context);

        // Giả lập tìm thấy user cập nhật
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        // Giả lập mapper chuyển từ blog sang response
        when(blogRepository.save(blog)).thenReturn(blog);
        when(blogMapper.toBlogResponse(blog)).thenReturn(response);

        // Gọi hàm updateBlog
        BlogResponse result = blogService.updateBlog(1, request);

        // Kiểm tra dữ liệu kết quả
        assertEquals("My Blog", result.getTitle());
        assertEquals("john", result.getUserCreate());
        assertEquals("john", result.getUserUpdate());
        assertEquals("main.jpg", result.getImageLink());

        // Xác minh các method được gọi đúng
        verify(blogRepository).findById(1);
        verify(blogSectionMapper).toBlogSection(sectionRequest);
        verify(userRepository).findById(1);
        verify(blogRepository).save(blog);
        verify(blogMapper).toBlogResponse(blog);
    }


    //UTCID03
    /**
     * Test: Cập nhật blog thất bại khi blogId không tồn tại
     */
    @Test
    void updateBlog_blogNotFound_throwException() {
        when(blogRepository.findById(999)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> {
            blogService.updateBlog(99, request);
        });

        assertEquals(ErrorCode.BLOG_NOT_EXISTED, ex.getErrorCode());

        verify(blogRepository).findById(999);
        verify(blogRepository, never()).save(any());
    }


}
