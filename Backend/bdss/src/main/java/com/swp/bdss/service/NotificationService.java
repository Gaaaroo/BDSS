package com.swp.bdss.service;

import com.swp.bdss.dto.response.NotificationResponse;
import com.swp.bdss.entities.Notification;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.repository.NotificationRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepository notificationRepository;
    UserRepository userRepository;

    public List<NotificationResponse> getAllNotificationByUserId() {
        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedDateDesc(user);

        return notifications.stream()
                .map(n -> NotificationResponse.builder()
                        .noticeId(n.getNoticeId())
                        .content(n.getContent())
                        .createdDate(n.getCreatedDate())
                        .isRead(n.isRead())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void markNotificationAsRead(int noticeId) {
        Notification notification = notificationRepository.findById(noticeId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsAsRead() {
        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());

        if (!userRepository.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        notificationRepository.markAllAsReadByUserId(userId);
    }
}
