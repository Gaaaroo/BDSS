package com.swp.bdss.service;

import com.swp.bdss.dto.request.BloodReceiveFormCreationRequest;
import com.swp.bdss.dto.request.BloodReceiveFormUpdateStatusRequest;
import com.swp.bdss.dto.response.*;
import com.swp.bdss.entities.*;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.*;
import com.swp.bdss.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodReceiveFormService {
    UserRepository userRepository;
    BloodReceiveFormRepository bloodReceiveFormRepository;
    BloodReceiveFormMapper bloodReceiveFormMapper;
    UserMapper userMapper;
    BloodUnitRepository bloodUnitRepository;
    BloodComponentUnitRepository bloodComponentUnitRepository;
    BloodUnitMapper bloodUnitMapper;
    BloodComponentUnitMapper bloodComponentUnitMapper;
    NotificationRepository notificationRepository;
    EmailService emailService;

    private static final List<String> BLOOD_TYPES = Arrays.asList("A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-");
    private static final List<String> COMPONENT_TYPES = Arrays.asList("Whole", "Plasma", "Platelets", "RBC", "WBC");
    public static record SeekResponse(String bloodType, String componentType, LocalDate requestDate) {}

    public Page<BloodResponse> getAllSuitableBloodByReceiveId(int receiveId, int page, int size) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(receiveId)
                .orElseThrow(() -> new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM));
        String bloodType = bloodReceiveForm.getBloodType();
        String componentType = bloodReceiveForm.getComponentType();
        Pageable pageable = PageRequest.of(page, size);
        int volume = bloodReceiveForm.getVolume();

        if (componentType.equalsIgnoreCase("Whole")) {
            Page<BloodUnit> bloodUnits = bloodUnitRepository.findAllSuitableBloodUnitByType(bloodType, pageable);

            List<BloodResponse> content = bloodUnits.getContent().stream()
                    .filter(unit -> unit.getStatus().equalsIgnoreCase("Stored") && unit.getVolume() == volume)
                    .map(unit -> {
                        BloodUnitResponse response = bloodUnitMapper.toBloodUnitResponse(unit);
                        response.setUserResponse(userMapper.toUserResponse(unit.getBloodDonateForm().getUser()));
                        return (BloodResponse) response;
                    })
                    .toList();

            return new PageImpl<>(content, pageable, bloodUnits.getTotalElements());
        } else {
            Page<BloodComponentUnit> componentUnits = bloodComponentUnitRepository
                    .findAllSuitableBloodComponentUnitByType(bloodType, componentType, pageable);

            List<BloodResponse> content = componentUnits.getContent().stream()
                    .filter(unit -> unit.getStatus().equalsIgnoreCase("Stored") &&
                            unit.getComponentType().equalsIgnoreCase(componentType) &&
                            unit.getVolume() == volume)
                    .map(unit -> {
                        BloodComponentUnitResponse response = bloodComponentUnitMapper.toBloodComponentUnitResponse(unit);
                        response.setUserResponse(userMapper.toUserResponse(unit.getBloodUnit().getBloodDonateForm().getUser()));
                        return (BloodResponse) response;
                    })
                    .toList();

            return new PageImpl<>(content, pageable, componentUnits.getTotalElements());
        }
    }


    public BloodReceiveFormResponse createBloodReceiveForm(BloodReceiveFormCreationRequest request) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormMapper.toBloodReceiveForm(request);
        //Lay UserID từ token
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra điều kiện đăng ký
        if (!user.getBloodReceiveForms().isEmpty()) {
            BloodReceiveForm lastForm = user.getBloodReceiveForms().getLast();
            String status = lastForm.getStatus();
            if (!status.equalsIgnoreCase("REJECTED") && !status.equalsIgnoreCase("APPROVED")) {
                throw new AppException(ErrorCode.ALREADY_REGISTERED_PENDING_RECEIVE_FORM);
            }
        }

        //Ghi notification sau khi tạo form thành công
        Notification notification = Notification.builder()
                .user(user)
                .content("You have successfully registered to receive blood.")
                .createdDate(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);


        bloodReceiveForm.setBloodType(request.getBloodType());
        bloodReceiveForm.setUser(user);
        bloodReceiveForm.setRequestDate(LocalDateTime.now());
        bloodReceiveForm.setStatus("PENDING");
        UserResponse userResponse = userMapper.toUserResponse(user);

        BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper
                .toBloodReceiveFormResponse(bloodReceiveFormRepository.save(bloodReceiveForm));
        bloodReceiveFormResponse.setUser(userResponse);
        return bloodReceiveFormResponse;
    }

    public BloodReceiveFormResponse getBloodReceiveFormById(int id) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        BloodReceiveFormResponse response = bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveForm);
        response.setReceiveId(bloodReceiveForm.getReceiveId());

        User user = bloodReceiveForm.getUser();
        UserResponse userResponse = userMapper.toUserResponse(user);
        response.setUser(userResponse);

        List<BloodResponse> bloodResponses = new ArrayList<>();

        // Lấy danh sách BloodUnit
        List<BloodUnit> bloodUnits = bloodUnitRepository.findByReceiveForm_ReceiveId(id);
        if (bloodUnits != null && !bloodUnits.isEmpty()) {
            List<BloodUnitResponse> unitResponses = bloodUnits.stream()
                    .map(bloodUnit -> {
                        BloodUnitResponse unitResp = bloodUnitMapper.toBloodUnitResponse(bloodUnit);

                        if (bloodUnit.getBloodDonateForm() != null) {
                            unitResp.setUserResponse(
                                    userMapper.toUserResponse(bloodUnit.getBloodDonateForm().getUser())
                            );
                        }

                        unitResp.setReceiveUser(null);
                        return unitResp;
                    })
                    .collect(Collectors.toList());

            bloodResponses.addAll(unitResponses);
        }

        // Lấy danh sách BloodComponentUnit
        List<BloodComponentUnit> componentUnits = bloodComponentUnitRepository.findByBloodReceiveForm_ReceiveId(id);
        if (componentUnits != null && !componentUnits.isEmpty()) {
            List<BloodComponentUnitResponse> componentResponses = componentUnits.stream()
                    .map(unit -> {
                        BloodComponentUnitResponse componentResp = bloodComponentUnitMapper.toBloodComponentUnitResponse(unit);

                        if (unit.getBloodUnit().getBloodDonateForm() != null) {
                            componentResp.setUserResponse(
                                    userMapper.toUserResponse(unit.getBloodUnit().getBloodDonateForm().getUser())
                            );
                        }

                        componentResp.setReceiveUser(null);

                        return componentResp;
                    })
                    .collect(Collectors.toList());

            bloodResponses.addAll(componentResponses);
        }

        // Gán vào response
        if (bloodResponses.isEmpty()) {
            response.setBloodReceived(null);
        } else {
            response.setBloodReceived(bloodResponses);
        }

        return response;
    }



    public List<BloodReceiveFormResponse> getMyBloodReceiveForm() {
        var context = SecurityContextHolder.getContext();
        int userId = Integer.parseInt(context.getAuthentication().getName());

        List<BloodReceiveForm> list = bloodReceiveFormRepository.findAllByUserUserId(userId);
        return list.stream().map(bloodReceiveForm -> {
                    BloodReceiveFormResponse bloodReceiveFormResponse = bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveForm);
                    User user = bloodReceiveForm.getUser();
                    UserResponse userResponse = userMapper.toUserResponse(user);
                    bloodReceiveFormResponse.setUser(userResponse);
                    return bloodReceiveFormResponse;
                })
                .toList();
    }

    public BloodReceiveFormResponse updateBloodReceiveFormStatus(int receiveId, BloodReceiveFormUpdateStatusRequest request) {
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(receiveId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        bloodReceiveForm.setStatus(request.getStatus());
        BloodReceiveFormResponse bloodReceiveFormResponse =
                bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveFormRepository.save(bloodReceiveForm));
        UserResponse userResponse = userMapper.toUserResponse(bloodReceiveForm.getUser());
        bloodReceiveFormResponse.setUser(userResponse);
        return bloodReceiveFormResponse;
    }

    public Map<String, Long> countReceiveRequestsByStatus() {
        List<BloodReceiveForm> forms = bloodReceiveFormRepository.findAll();
        return forms.stream()
                .collect(Collectors.groupingBy(
                        BloodReceiveForm::getStatus,
                        Collectors.counting()
                ));
    }

    public Page<BloodReceiveFormResponse> getBloodReceiveForms(
            String keyword,
            String status,
            String priority,
            Pageable pageable
    ) {
        Page<BloodReceiveForm> page;

        if (keyword != null && !keyword.trim().isEmpty()) {
            // Search by keyword, status, and priority
            page = bloodReceiveFormRepository.searchByKeywordAndStatus(keyword, status, priority, pageable);
            if (page.isEmpty()) {
                throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM);
            }
        } else if (priority != null && !priority.trim().isEmpty()) {
            // Filter by priority and optional status
            page = bloodReceiveFormRepository.findAllByPriorityAndOptionalStatus(priority, status, pageable);
            if (page.isEmpty()) {
                throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM_WITH_PRIORITY);
            }
        } else if (status != null && !status.trim().isEmpty()) {
            // Filter by status
            page = bloodReceiveFormRepository.findAllByStatus(status, pageable);
            if (page.isEmpty()) {
                throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM);
            }
        } else {
            // Get all
            page = bloodReceiveFormRepository.findAll(pageable);
        }

        return page.map(bloodReceiveForm -> {
            BloodReceiveFormResponse response = bloodReceiveFormMapper.toBloodReceiveFormResponse(bloodReceiveForm);
            User user = bloodReceiveForm.getUser();
            UserResponse userResponse = userMapper.toUserResponse(user);
            response.setUser(userResponse);
            return response;
        });
    }

    public List<BloodReceiveFormResponse> getBloodReceiveFormByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType) {
        List<BloodReceiveFormResponse> list;
        if(componentType.equalsIgnoreCase("Whole")) {
            list = bloodReceiveFormRepository.findAllByBloodTypeAndComponentTypeAndStatus(bloodType, componentType, "PROCESSING")
                    .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                    .toList();
            log.info(list.toString());
        }else{
            componentType = "Whole";
            list = bloodReceiveFormRepository.findAllByBloodTypeAndComponentTypeNotAndStatus(bloodType, componentType, "PROCESSING")
                    .stream().map(bloodReceiveFormMapper::toBloodReceiveFormResponse)
                    .toList();
            log.info(list.toString());

        }

        if(list.isEmpty()){
            throw new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM);
        }
        return list;
    }

    public long countBloodReceiveFormByBloodTypeAndComponentTypeAndStatus(String bloodType, String componentType) {
        List<String> statuses = List.of("PROCESSING", "PENDING");
        long count;
        if (componentType.equalsIgnoreCase("Whole")) {
            count = bloodReceiveFormRepository.countByBloodTypeAndComponentTypeAndStatusIn(
                    bloodType, componentType, statuses
            );
            log.info("Whole count: " + count);
        } else {
            // Đếm những đơn có componentType khác "Whole"
            count = bloodReceiveFormRepository.countByBloodTypeAndComponentTypeNotAndStatusIn(
                    bloodType, "Whole", statuses
            );
            log.info("Not Whole count: " + count);
        }

        return count;
    }

    public Map<String, Map<String, Long>> countAllBloodReceiveFormByBloodTypeAndComponentType() {
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();

        for (String componentType : COMPONENT_TYPES) {
            Map<String, Long> componentCount = new LinkedHashMap<>();
            for (String bloodType : BLOOD_TYPES) {
                long count = bloodReceiveFormRepository.countByBloodTypeAndComponentType(bloodType, componentType);
                componentCount.put(bloodType, count);
            }
            result.put(componentType, componentCount);
        }

        return result;
    }

    public Long countAll() {
        return bloodReceiveFormRepository.count();
    }

    public Long countBloodReceiveFormByToday(){
        LocalDateTime today = LocalDateTime.now();

        LocalDateTime start = today.toLocalDate().atStartOfDay();
        LocalDateTime end = today.plusDays(1).minusNanos(1);

        return bloodReceiveFormRepository.countByRequestDateBetween(start, end);
    }

    public Map<String, Long> countBloodTypeToday(){
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime start = today.toLocalDate().atStartOfDay();
        LocalDateTime end = today.plusDays(1).minusNanos(1);

        HashMap<String, Long> bloodTypeCount = new LinkedHashMap<>();
        for (String bloodType : BLOOD_TYPES) {
            long count = bloodReceiveFormRepository.countByBloodTypeAndRequestDateBetween(bloodType, start, end);
            bloodTypeCount.put(bloodType, count);
        }

        return bloodTypeCount;
    }

    public Long countBloodReceiveFormByRequestDateBetween(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);
        return bloodReceiveFormRepository.countByRequestDateBetween(start, end);
    }

//    public Map<String, Long> getRequestStatistics(String mode){
//        LocalDate today = LocalDate.now();
//
//        List<BloodReceiveForm> requests = bloodReceiveFormRepository.findAll();
//
//        switch (mode.toLowerCase()){
//            case "day":
//                return requests.stream()
//                        .filter(r -> r.getRequestDate().toLocalDate()
//                                .isAfter(today.minusDays(7)))
//                        .collect(Collectors.groupingBy(
//                                r -> r.getRequestDate().getDayOfWeek().toString(),
//                                Collectors.counting()
//                        ));
//            case "month":
//                return requests.stream()
//                        .filter(r -> r.getRequestDate().getMonth() == today.getMonth()
//                                && r.getRequestDate().getYear() == today.getYear())
//                        .collect(Collectors.groupingBy(
//                                r -> String.valueOf(r.getRequestDate().getDayOfMonth()),
//                                Collectors.counting()
//                        ));
//            case "year":
//                return requests.stream()
//                        .filter(r -> r.getRequestDate().getYear() == today.getYear())
//                        .collect(Collectors.groupingBy(
//                                r -> r.getRequestDate().getMonth().toString(),
//                                Collectors.counting()
//                        ));
//            default:
//                throw new AppException(ErrorCode.INVALID_MODE);
//        }
//    }

    public Map<String, Long> getRequestStatistics(String mode) {
        LocalDate today = LocalDate.now();
        List<BloodReceiveForm> requests = bloodReceiveFormRepository.findAll();

        Map<String, Long> resultMap;

        switch (mode.toLowerCase()) {
            case "day":
                // 7 ngày gần nhất, key: yyyy-MM-dd
                resultMap = requests.stream()
                        .filter(r -> !r.getRequestDate().toLocalDate().isBefore(today.minusDays(6)))
                        .collect(Collectors.groupingBy(
                                r -> r.getRequestDate().toLocalDate().toString(),
                                TreeMap::new,
                                Collectors.counting()
                        ));
                break;
            case "month":
                // Trong tháng hiện tại, key: dd/MM
                resultMap = requests.stream()
                        .filter(r -> r.getRequestDate().getMonth() == today.getMonth()
                                && r.getRequestDate().getYear() == today.getYear())
                        .collect(Collectors.groupingBy(
                                r -> String.format("%02d/%02d", r.getRequestDate().getDayOfMonth(), r.getRequestDate().getMonthValue()),
                                TreeMap::new,
                                Collectors.counting()
                        ));
                break;
            case "year":
                // Trong năm hiện tại, key: MM/yyyy
                resultMap = requests.stream()
                        .filter(r -> r.getRequestDate().getYear() == today.getYear())
                        .collect(Collectors.groupingBy(
                                r -> String.format("%02d/%d", r.getRequestDate().getMonthValue(), r.getRequestDate().getYear()),
                                TreeMap::new,
                                Collectors.counting()
                        ));
                break;
            default:
                throw new AppException(ErrorCode.INVALID_MODE);
        }
        return resultMap;
    }

    public Map<String, SeekResponse> listFormWithName(){
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);

        return bloodReceiveFormRepository.findAllByRequestDateBetween(sevenDaysAgo, now)
                .stream()
                .collect(Collectors.toMap(
                        form -> form.getUser().getFullName(),
                        form -> new SeekResponse(form.getBloodType(), form.getComponentType(), form.getRequestDate().toLocalDate()),
                        (existing, replacement) -> existing // Giữ nguyên nếu trùng tên
                ));
    }

    //@Scheduled(cron = "*/20 * * * * *") // Mỗi 20 giây
    @Scheduled(cron = "0 0 * * * *") // Mỗi giờ đúng (ví dụ: 00:00, 01:00, 02:00,...)
    public void autoRejectExpiredForms() {
        LocalDateTime now = LocalDateTime.now();

        List<BloodReceiveForm> expiredForms = bloodReceiveFormRepository
                .findAllByRequiredDateBeforeAndStatusNotIgnoreCase(now, "APPROVED");

        for (BloodReceiveForm form : expiredForms) {
            form.setStatus("REJECTED");


            emailService.sendNotiOverRequiredDate(form.getUser().getEmail(), form.getUser().getFullName());

            // Gửi thông báo cho user nếu muốn
            Notification notification = Notification.builder()
                    .user(form.getUser())
                    .content("Your blood receive request has been rejected due to expiration.")
                    .createdDate(now)
                    .isRead(false)
                    .build();

            notificationRepository.save(notification);
        }

        bloodReceiveFormRepository.saveAll(expiredForms);
    }



}
