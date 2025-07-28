package com.swp.bdss.service;

import com.swp.bdss.dto.request.UserUpdateRequest;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodUnit;
import com.swp.bdss.entities.Notification;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.NotificationRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserMapper userMapper;
    UserRepository userRepository;
    NotificationRepository notificationRepository;
    NotificationService notificationService;
    EmailService emailService;


    public UserResponse createUserForLoginGoogle(String email, String username, String image_link) {

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setRole("MEMBER");
        user.setStatus("ACTIVE");
        user.setActive(true);
        user.setImageLink(image_link);

        User savedUser = userRepository.save(user);
        return userMapper.toUserResponse(savedUser);
    }

    public Page<UserResponse> getUsers(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            if (!pageable.getSort().isSorted()) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "userId"));
            }

            return userRepository
                    .findByUsernameNot("admin", pageable)
                    .map(userMapper::toUserResponse);
        }

        return userRepository
                .searchUsersExcludingAdmin("admin", keyword.trim(), pageable)
                .map(userMapper::toUserResponse);
    }

    public UserResponse getUserById(int userId){
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    public UserResponse getUserProfile(){
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateProfile(UserUpdateRequest request){
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userRepository.findByEmail(request.getEmail())
                .filter(u -> u.getUserId() != userId)
                .ifPresent(u -> { throw new AppException(ErrorCode.EMAIL_EXISTED); });

        userRepository.findByUsername(request.getUsername())
                .filter(u -> u.getUserId() != userId)
                .ifPresent(u -> { throw new AppException(ErrorCode.USERNAME_EXISTED); });

        userMapper.updateUser(user, request);

        if (request.getBloodType() == null) {
            user.setBloodType("Unknown");
        } else {
            user.setBloodType(request.getBloodType());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse updateUser(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(Integer.parseInt(userId))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        var role = request.getRole();
        user.setRole(role);

        if (request.getBloodType() == null) {
            request.setBloodType("Unknown");
        } else {
            user.setBloodType(request.getBloodType());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }


    public void banUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus("BANNED");
        userRepository.save(user);

        Notification notification = Notification.builder()
                .user(user)
                .content("Your account has been banned. Please contact the system administrator for more information.")
                .createdDate(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<UserResponse> findUserNearby(double lat, double lng, double radiusKm) {
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        return userRepository.findAll().stream()
                .filter(user -> user.getLat() != null && user.getLng() != null)
                .filter(user -> user.getUserId() != userId)
                .filter(user -> haversine(lat, lng, user.getLat(), user.getLng()) <= radiusKm)
                .map(userMapper::toUserResponse)
                .toList();
    }

    public List<UserResponse> findUserNearbyWithBloodType(double lat, double lng, double radiusKm, String bloodType) {
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        return userRepository.findAll().stream()
                .filter(user -> user.getLat() != null && user.getLng() != null)
                .filter(user -> user.getUserId() != userId)
                .filter(user -> haversine(lat, lng, user.getLat(), user.getLng()) <= radiusKm)
                .filter(user -> bloodType == null || user.getBloodType() != null &&
                        user.getBloodType().equalsIgnoreCase(bloodType))
                .map(userMapper::toUserResponse)
                .toList();
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // đây là bán kính trái đất
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a =  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Long countAll(){
        return userRepository.count();
    }

    public void sendNotiToUser(int userId) {
        notificationService.createNotificationByUserId(userId, "We urgently need your help for a blood donation. If you have time, please come and donate as soon as possible. Your contribution can save lives!");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        emailService.sendNeedBloodUrgently(user.getEmail());
    }

    @Async
    public void processEncouragementEmails(String bloodType) {
        sendEncouragementToEligibleUsersByBloodType(bloodType);
    }

    public void sendEncouragementToEligibleUsersByBloodType(String bloodType) {
        List<User> users = userRepository.findByBloodTypeAndIsActiveTrue(bloodType);

        for (User user : users) {
            if (user.getEmail() == null || user.getEmail().isEmpty()) continue;

            List<BloodDonateForm> donateForms = user.getBloodDonateForms();
            boolean shouldEncourage = false;

            if (donateForms == null || donateForms.isEmpty()) {
                shouldEncourage = true;
            } else {
                BloodDonateForm lastForm = donateForms.get(donateForms.size() - 1);
                String status = lastForm.getStatus();

                if ("REJECTED".equalsIgnoreCase(status)) {
                    shouldEncourage = true;
                } else if ("APPROVED".equalsIgnoreCase(status)) {
                    BloodUnit bloodUnit = lastForm.getBloodUnit();
                    if (bloodUnit != null && bloodUnit.getDonatedDate() != null) {
                        long daysSinceLastDonate = ChronoUnit.DAYS.between(
                                bloodUnit.getDonatedDate().toLocalDate(), LocalDate.now());

                        if (daysSinceLastDonate > 84) {
                            shouldEncourage = true;
                        }
                    }
                }
            }

            if (shouldEncourage) {
                // Gửi email
                emailService.sendEncourageBloodDonationEmail(user.getEmail());

                // Gửi thông báo
                Notification notification = Notification.builder()
                        .user(user)
                        .content("We encourage you to donate blood. Your contribution can save lives!")
                        .createdDate(LocalDateTime.now())
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);
            }
        }
    }


}
