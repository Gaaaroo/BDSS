package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodDonateFormCreationRequest;
import com.swp.bdss.dto.request.BloodDonateFormUpdateStatusRequest;
import com.swp.bdss.dto.response.BloodDonateFormResponse;
import com.swp.bdss.dto.response.UserResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.BloodUnit;
import com.swp.bdss.entities.Notification;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.BloodDonateFormMapper;
import com.swp.bdss.mapper.UserMapper;
import com.swp.bdss.repository.BloodDonateFormRepository;
import com.swp.bdss.repository.NotificationRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class BloodDonateFormService {
    UserRepository userRepository;
    BloodDonateFormRepository bloodDonateFormRepository;
    BloodDonateFormMapper bloodDonateFormMapper;
    UserMapper userMapper;
    NotificationRepository notificationRepository;

    private static final List<String> BLOOD_TYPES = Arrays.asList("A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-");

    public static record DonorInfo(String bloodType, LocalDate requestDate) {}


    //create blood donate form (USER)
    public BloodDonateFormResponse createBloodDonateForm(BloodDonateFormCreationRequest request){
        //convert request to entity
        BloodDonateForm bloodDonateForm = bloodDonateFormMapper.toBloodDonateForm(request);

        //lấy user_id từ token
        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        //ktra xem authentication có phải là Jwt không để lấy userId
        if (!(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof Jwt)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean canRegister = false;

        if (user.getBloodDonateForms().isEmpty()) {
            canRegister = true;
        } else {
            BloodDonateForm lastForm = user.getBloodDonateForms().getLast();

            if (lastForm.getStatus().equalsIgnoreCase("REJECTED")) {
                canRegister = true;
            } else {
                BloodUnit bloodUnit = lastForm.getBloodUnit();
                if (bloodUnit == null || bloodUnit.getDonatedDate() == null) {
                    throw new AppException(ErrorCode.BLOOD_UNIT_NOT_EXIST);
                }
                LocalDateTime lastDonateDate = bloodUnit.getDonatedDate();
                long daysSinceLastDonate = ChronoUnit.DAYS.between(lastDonateDate.toLocalDate(), LocalDate.now());

                if (daysSinceLastDonate > 84) {
                    canRegister = true;
                }
            }
        }

        if (!canRegister) {
            throw new AppException(ErrorCode.NOT_ELIGIBLE_TO_REGISTER_RECEIVE);
        }

        UserResponse userResponse = userMapper.toUserResponse(user);
        bloodDonateForm.setUser(user);
        bloodDonateForm.setRequestDate(LocalDateTime.now());
        bloodDonateForm.setStatus("PENDING");

        BloodDonateFormResponse bloodDonateFormResponse = bloodDonateFormMapper
                .toBloodDonateFormResponse(bloodDonateFormRepository.save(bloodDonateForm));

//        //set user cho response tại vì user nằm ở user và mapstruct ko lấy trường này -> null hoặc sai
         bloodDonateFormResponse.setUserResponse(userResponse);
        // Ghi notification sau khi tạo form thành công
        Notification notification = Notification.builder()
                .user(user)
                .content("You have successfully registered to donate blood.")
                .createdDate(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);
        return bloodDonateFormResponse;
    }



    //get all donate form of all user and form details (ADMIN)
    public Page<BloodDonateFormResponse> getAllUserBloodDonateForm(Pageable pageable) {
        Page<BloodDonateForm> page = bloodDonateFormRepository.findAll(pageable);
        if (page.isEmpty()) {
            throw new AppException(ErrorCode.NO_BLOOD_DONATE_FORM);
        }
        return page.map(bloodDonateForm -> {
            BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);
            User user = bloodDonateForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(user);
            response.setUserResponse(userResponse);
            return response;
        });
    }

    //get all donate form of 1 user and form details (USER)
    public List<BloodDonateFormResponse> getUserBloodDonateForm(){
        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String username = user.getUsername();
        List<BloodDonateForm> list = bloodDonateFormRepository.findAllBloodDonateFormByUserUsername(username);

        return list.stream().map(bloodDonateForm -> {
            BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);

            User savedUser = bloodDonateForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(savedUser);

            response.setUserResponse(userResponse);
            return response;
        }).toList();
    }

    //get blood donate form by id (ADMIN, USER)
    public BloodDonateFormResponse getBloodDonateFormByDonateId(String donate_id){
        int id = Integer.parseInt(donate_id);
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood donate form with id " + id + " does not exist."));
        BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);

        User user = bloodDonateForm.getUser();
        UserResponse userResponse = userMapper.toUserResponse(user);
        response.setUserResponse(userResponse);
        return response;
    }

    //delete blood donate form (ADMIN, USER)
    public void deleteBloodDonateForm(String donate_id){
        int id = Integer.parseInt(donate_id);
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_DONATE_FORM_NOT_EXISTED));
        bloodDonateFormRepository.deleteById(id);
    }

    //update form status (ADMIN)
    public BloodDonateFormResponse updateBloodDonateFormStatus(int donate_id, BloodDonateFormUpdateStatusRequest request){
        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(donate_id)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_DONATE_FORM_NOT_EXISTED));

        //check status
        bloodDonateForm.setStatus(request.getStatus());
        return bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateFormRepository.save(bloodDonateForm));
    }

    public Page<BloodDonateFormResponse> searchBloodDonateFormByKeyWord(String keyword, Pageable pageable, String status) {

        log.info(keyword);
        if (keyword == null || keyword.trim().isEmpty()) {
            log.info("Keyword is null or empty");
        }
        Page<BloodDonateForm> page = bloodDonateFormRepository.searchByKeywordAndStatus(keyword, status, pageable);

        if(page.isEmpty()){
            throw new AppException(ErrorCode.NO_BLOOD_DONATE_FORM);
        }

        return page.map(bloodDonateForm -> {
            BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);
            User user = bloodDonateForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(user);
            response.setUserResponse(userResponse);
            return response;
        });
    }

    public Map<String, Long> countDonateRequestsByStatus() {
        List<BloodDonateForm> forms = bloodDonateFormRepository.findAll();
        return forms.stream()
                .collect(Collectors.groupingBy(
                        BloodDonateForm::getStatus,
                        Collectors.counting()
                ));
    }

    public Page<BloodDonateFormResponse> getBloodDonateFormByStatus(String status, Pageable pageable){
        Page<BloodDonateForm> page = bloodDonateFormRepository.findAllByStatus(status, pageable);
        if (page.isEmpty()) {
            throw new AppException(ErrorCode.NO_BLOOD_DONATE_FORM);
        }
        return page.map(bloodDonateForm -> {
            BloodDonateFormResponse response = bloodDonateFormMapper.toBloodDonateFormResponse(bloodDonateForm);
            User user = bloodDonateForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(user);
            response.setUserResponse(userResponse);
            return response;
        });
    }

    public Long countBloodDonateFormByBloodType(String bloodType) {
        return bloodDonateFormRepository.countByUserBloodTypeAndStatus(bloodType, "PROCESSING") +
               bloodDonateFormRepository.countByUserBloodTypeAndStatus(bloodType, "PENDING");
    }

    public Long countAllBloodDonateForm(){
        return bloodDonateFormRepository.count();
    }

    public Long countBloodDonateFormByRequestDate() {
        LocalDateTime today = LocalDateTime.now();

        LocalDateTime start = today.toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusNanos(1);

        return bloodDonateFormRepository.countByRequestDateBetween(start, end);
    }

    public Map<String, Long> getRequestStatistics(String mode){
        LocalDate today = LocalDate.now();

        List<BloodDonateForm> requests = bloodDonateFormRepository.findAll();

        switch (mode.toLowerCase()){
            case "day":
                return requests.stream()
                        .filter(r -> r.getRequestDate().toLocalDate()
                                .isAfter(today.minusDays(7)))
                        .collect(Collectors.groupingBy(
                                r -> r.getRequestDate().getDayOfWeek().toString(),
                                Collectors.counting()
                        ));
            case "month":
                return requests.stream()
                        .filter(r -> r.getRequestDate().getMonth() == today.getMonth()
                        && r.getRequestDate().getYear() == today.getYear())
                        .collect(Collectors.groupingBy(
                                r -> String.valueOf(r.getRequestDate().getDayOfMonth()),
                                Collectors.counting()
                        ));
            case "year":
                return requests.stream()
                        .filter(r -> r.getRequestDate().getYear() == today.getYear())
                        .collect(Collectors.groupingBy(
                                r -> r.getRequestDate().getMonth().toString(),
                                Collectors.counting()
                        ));
            default:
                throw new AppException(ErrorCode.INVALID_MODE);
        }
    }

    public Long countBloodDonateFormByRequestDateBetween(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        return bloodDonateFormRepository.countByRequestDateBetween(start, end);
    }

    public Map<String, Long> countByBloodType() {
        Map<String, Long> result = new LinkedHashMap<>();
        for (String bloodType : BLOOD_TYPES) {
            Long count = bloodDonateFormRepository.countByUserBloodType(bloodType);
            result.put(bloodType, count);
        }
        return result;
    }

    public Map<String, Long> countByBloodTypeByToday() {
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime start = today.toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusNanos(1);

        Map<String, Long> result = new LinkedHashMap<>();
        for(String type : BLOOD_TYPES) {
            Long count = bloodDonateFormRepository.countByUserBloodTypeAndRequestDateBetween(type, start, end);
            result.put(type, count);
        }

        return result;
    }

    public Map<String, DonorInfo> getBloodDonateFormWithFullName(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);

        Map<String, String> result = new LinkedHashMap<>();

        return bloodDonateFormRepository.findAllByRequestDateBetween(sevenDaysAgo, now)
                .stream()
                .collect(Collectors.toMap(
                        form -> form.getUser().getFullName(),
                        form -> new DonorInfo(form.getUser().getBloodType(), form.getRequestDate().toLocalDate()),
                        (existing, replacement) -> existing, // Handle duplicates by keeping the first one
                        LinkedHashMap::new // Maintain insertion order
                ));
    }


}
