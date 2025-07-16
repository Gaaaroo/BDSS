package com.swp.bdss.controller;

import com.swp.bdss.dto.response.ApiResponse;
import com.swp.bdss.dto.response.NotificationResponse;
import com.swp.bdss.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/notification")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RestController
public class NotificationController {
    NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getAllByUser() {
        List<NotificationResponse> notifications = notificationService.getAllNotificationByUserId();
        return ApiResponse.<List<NotificationResponse>>builder()
                .code(1000)
                .data(notifications)
                .build();
    }

    @PostMapping("/mark-all-read")
    public ApiResponse<String> markAllAsRead() {
        notificationService.markAllNotificationsAsRead();
        return ApiResponse.<String>builder()
                .code(1000)
                .data("done")
                .build();

    }

    @PostMapping("/mark-read")
    public ApiResponse<String> markAsRead(@RequestParam int noticeId) {
        notificationService.markNotificationAsRead(noticeId);

        return ApiResponse.<String>builder()
                .code(1000)
                .message("Notification marked as read")
                .data("done")
                .build();
    }

}
