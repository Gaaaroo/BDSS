package com.swp.bdss.service;

import com.swp.bdss.dto.request.UpdateReceivingProcessStepRequest;
import com.swp.bdss.dto.response.UpdateReceivingProcessStepResponse;
import com.swp.bdss.entities.BloodReceiveForm;
import com.swp.bdss.entities.ReceivingProcess;
import com.swp.bdss.entities.User;
import com.swp.bdss.exception.AppException;
import com.swp.bdss.exception.ErrorCode;
import com.swp.bdss.mapper.ReceivingProcessMapper;
import com.swp.bdss.repository.BloodReceiveFormRepository;
import com.swp.bdss.repository.ReceivingProcessRepository;
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
public class ReceivingProcessService {
    UserRepository userRepository;
    ReceivingProcessRepository receivingProcessRepository;
    BloodReceiveFormRepository bloodReceiveFormRepository;
    ReceivingProcessMapper receivingProcessMapper;
    NotificationService notificationService;

    //updateReceivingProcessStep
    public UpdateReceivingProcessStepResponse updateReceivingStep(UpdateReceivingProcessStepRequest request){
        if(request.getStepNumber() > 3 || request.getStepNumber() <= 0) {
            throw new AppException(ErrorCode.INVALID_STEP_NUMBER2);
        }

        int userId = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());

        //ktra form có tồn tại không
        BloodReceiveForm bloodReceiveForm = bloodReceiveFormRepository.findById(request.getReceiveId())
                .orElseThrow(() -> new AppException(ErrorCode.NO_BLOOD_RECEIVE_FORM));

        List<ReceivingProcess> steps = receivingProcessRepository.findAllByBloodReceiveFormReceiveId(bloodReceiveForm.getReceiveId());

        if("PENDING".equalsIgnoreCase(bloodReceiveForm.getStatus()) && steps.isEmpty()){
            for(int i = 1; i <= 3; i++) {
                ReceivingProcess step = new ReceivingProcess();
                step.setBloodReceiveForm(bloodReceiveForm);
                step.setStepNumber(i);
                step.setStatus("PENDING");
                step.setUpdatedAt(LocalDateTime.now());
                receivingProcessRepository.save(step);
            }
            //reload lại danh sách các bước
            steps = receivingProcessRepository.findAllByBloodReceiveFormReceiveId(bloodReceiveForm.getReceiveId());

            //cập nhật trạng thái từ PENDING sáng PROCESSING
            bloodReceiveForm.setStatus("PROCESSING");
            bloodReceiveFormRepository.save(bloodReceiveForm);
        }

        // Kiểm tra nếu không phải bước đầu tiên thì bước trước phải done
        if(request.getStepNumber() > 1) {
            ReceivingProcess previousStep = receivingProcessRepository.findByBloodReceiveFormReceiveIdAndStepNumber(
                    bloodReceiveForm.getReceiveId(), request.getStepNumber() - 1)
                    .orElseThrow(() -> new AppException(ErrorCode.STEP_NOT_FOUND));
            if(!"DONE".equalsIgnoreCase(previousStep.getStatus())) {
                throw new AppException(ErrorCode.PREVIOUS_STEP_NOT_DONE);
            }
        }

        ReceivingProcess currentStep = receivingProcessRepository.findByBloodReceiveFormReceiveIdAndStepNumber(request.getReceiveId(), request.getStepNumber())
                .orElseThrow(() -> new AppException(ErrorCode.STEP_NOT_FOUND));

        currentStep.setStatus(request.getStatus());
        currentStep.setUpdatedAt(LocalDateTime.now());
        currentStep.setNote(request.getNote());

        User staff = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        currentStep.setUpdatedBy(staff);
        receivingProcessRepository.save(currentStep);

        // Send notification about step update
        int receiverId = bloodReceiveForm.getUser().getUserId();
        String message = String.format(
                "Your receiving process (ID: %d) has been updated to step %d: %s.",
                bloodReceiveForm.getReceiveId(),
                currentStep.getStepNumber(),
                currentStep.getStatus()
        );
        notificationService.createNotificationByUserId(receiverId, message);


        // nếu các bước trước là DONE thì cập nhật trạng thái của đơn hiến máu
        steps = receivingProcessRepository.findAllByBloodReceiveFormReceiveId(bloodReceiveForm.getReceiveId());
        boolean allPreviousStepsDone = steps.stream()
                .allMatch(step -> "DONE".equalsIgnoreCase(step.getStatus()));

        if(allPreviousStepsDone) {
            bloodReceiveForm.setStatus("APPROVED");
            bloodReceiveFormRepository.save(bloodReceiveForm);

            String messageA = String.format(
                    "Your blood receiving form (ID: %d) has been %s.",
                    bloodReceiveForm.getReceiveId(),
                    bloodReceiveForm.getStatus()
            );
            notificationService.createNotificationByUserId(receiverId, messageA);
        }else {
            bloodReceiveForm.setStatus("PROCESSING");
            bloodReceiveFormRepository.save(bloodReceiveForm);
        }

        //nếu có bước nào là FAILED thì cập nhật trạng thái của đơn hiến máu
        boolean anyStepFailed = steps.stream()
                .anyMatch(step -> "FAILED".equalsIgnoreCase(step.getStatus()));
        if(anyStepFailed) {
            bloodReceiveForm.setStatus("REJECTED");
            bloodReceiveFormRepository.save(bloodReceiveForm);

            String messageR = String.format(
                    "Your blood receiving form (ID: %d) has been %s.",
                    bloodReceiveForm.getReceiveId(),
                    bloodReceiveForm.getStatus()
            );
            notificationService.createNotificationByUserId(receiverId, messageR);
        }

        UpdateReceivingProcessStepResponse response = receivingProcessMapper.toUpdateReceivingProcessStepResponse(currentStep);
        response.setUpdatedBy(staff.getFullName());
        return response;
    }
}
