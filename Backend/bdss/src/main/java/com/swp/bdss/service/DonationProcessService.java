package com.swp.bdss.service;

import com.swp.bdss.dto.request.UpdateDonationProcessStepRequest;
import com.swp.bdss.dto.response.UpdateDonationProcessStepResponse;
import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.DonationProcess;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.DonationProcessMapper;
import com.swp.bdss.repository.BloodDonateFormRepository;
import com.swp.bdss.repository.DonationProcessRepository;
import com.swp.bdss.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DonationProcessService {
    UserRepository userRepository;
    DonationProcessRepository donationProcessRepository;
    BloodDonateFormRepository bloodDonateFormRepository;
    DonationProcessMapper donationProcessMapper;
    NotificationService notificationService;


    // updateDonationProcessStep
    public UpdateDonationProcessStepResponse updateDonationStep(UpdateDonationProcessStepRequest request){
        if(request.getStepNumber() >= 6 || request.getStepNumber() <= 0) {
            throw new AppException(ErrorCode.INVALID_STEP_NUMBER1);
        }

        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());

        BloodDonateForm bloodDonateForm = bloodDonateFormRepository.findById(request.getDonateId())
                .orElseThrow(() -> new AppException(ErrorCode.NO_BLOOD_DONATE_FORM));

        // Nếu đơn đang trạng thái PENDING và chưa có bước nào, thì tạo đủ 5 bước
        List<DonationProcess> steps = donationProcessRepository.findAllByBloodDonateFormDonateId(bloodDonateForm.getDonateId());

        if("PENDING".equalsIgnoreCase(bloodDonateForm.getStatus()) && steps.isEmpty()){
            for(int i = 1; i <= 5; i++) {
                DonationProcess step = new DonationProcess();
                step.setBloodDonateForm(bloodDonateForm);
                step.setStepNumber(i);
                step.setStatus("PENDING");
                step.setUpdatedAt(LocalDateTime.now());
                donationProcessRepository.save(step);
            }

            //reload lại danh sách các bước
            steps = donationProcessRepository.findAllByBloodDonateFormDonateId(bloodDonateForm.getDonateId());

            // cập nhật trạng thái của đơn hiến máu từ PENDING sang PROCESSING
            bloodDonateForm.setStatus("PROCESSING");
            bloodDonateFormRepository.save(bloodDonateForm);
        }

        // Kiểm tra nếu không phải bước đầu tiên thì bước trước phải done
        if (request.getStepNumber() > 1) {
            DonationProcess prevStep = donationProcessRepository
                    .findByBloodDonateFormDonateIdAndStepNumber(request.getDonateId(), request.getStepNumber() - 1)
                    .orElseThrow(() -> new AppException(ErrorCode.STEP_NOT_FOUND));
            if (!"DONE".equalsIgnoreCase(prevStep.getStatus())) {
                throw new AppException(ErrorCode.PREVIOUS_STEP_NOT_DONE);
            }
        }


        // tìm bước cần cập nhật
        DonationProcess stepToUpdate = donationProcessRepository.findByBloodDonateFormDonateIdAndStepNumber(request.getDonateId(), request.getStepNumber())
                .orElseThrow(() -> new AppException(ErrorCode.STEP_NOT_FOUND));

        System.out.println(stepToUpdate.getStatus());
        System.out.println(request.getStatus());

        stepToUpdate.setStatus(request.getStatus());
        stepToUpdate.setUpdatedAt(LocalDateTime.now());
        stepToUpdate.setNote(request.getNote());

        if (request.getStepNumber() == 5 && "DONE".equalsIgnoreCase(request.getStatus())) {
            bloodDonateForm.setReadyDate(LocalDateTime.now()); // hoặc donatedAt nếu bạn dùng tên khác
            bloodDonateFormRepository.save(bloodDonateForm);
        }

        User staff = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        stepToUpdate.setUpdatedBy(staff);
        donationProcessRepository.save(stepToUpdate);

        int donorId = bloodDonateForm.getUser().getUserId();
        String message = String.format(
                "Your donation process (ID: %d) has been updated to step %d: %s.",
                bloodDonateForm.getDonateId(),
                stepToUpdate.getStepNumber(),
                stepToUpdate.getStatus()
        );
        notificationService.createNotificationByUserId(donorId, message);

        // nếu các bước trước là DONE thì cập nhật trạng thái của đơn hiến máu
        steps = donationProcessRepository.findAllByBloodDonateFormDonateId(bloodDonateForm.getDonateId());
        boolean allStepsDone = steps.stream().allMatch(step -> "DONE".equalsIgnoreCase(step.getStatus()));
        if(allStepsDone){
            bloodDonateForm.setStatus("APPROVED");
            bloodDonateFormRepository.save(bloodDonateForm);
            String messageD = String.format(
                    "Your blood donation form (ID: %d) has been %s.",
                    bloodDonateForm.getDonateId(),
                    bloodDonateForm.getStatus()
            );
            notificationService.createNotificationByUserId(donorId, messageD);
        }else{
            bloodDonateForm.setStatus("PROCESSING");
            bloodDonateFormRepository.save(bloodDonateForm);
        }

        //nếu có bước nào là FAILED thì cập nhật trạng thái của đơn hiến máu
        boolean anyStepFailed = steps.stream()
                .anyMatch(step -> "FAILED".equalsIgnoreCase(step.getStatus()));
        if(anyStepFailed) {
            bloodDonateForm.setStatus("REJECTED");
            bloodDonateFormRepository.save(bloodDonateForm);
            String messageD = String.format(
                    "Your blood donation form (ID: %d) has been %s.",
                    bloodDonateForm.getDonateId(),
                    bloodDonateForm.getStatus()
            );
            notificationService.createNotificationByUserId(donorId, messageD);
        }

        UpdateDonationProcessStepResponse response = donationProcessMapper.toUpdateDonationProcessStepResponse(stepToUpdate);
        response.setUpdatedBy(staff.getFullName());
        return response;

    }

}
