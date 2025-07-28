package com.swp.bdss.service;

import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.Reminder;
import com.swp.bdss.repository.BloodDonateFormRepository;
import com.swp.bdss.repository.ReminderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ReminderService {
    BloodDonateFormRepository bloodDonateFormRepository;
    ReminderRepository reminderRepository;
    EmailService emailService;

    @Scheduled(cron = "0 0 8 * * ?") // chạy mỗi ngày lúc 8h sáng
//    @Scheduled(cron = "0 * * * * ?") // mỗi phút chạy 1 lần
    public void sendRecoveryReminders() {
        log.info("=== Scheduler sendRecoveryReminders is running ===");
        List<BloodDonateForm> forms = bloodDonateFormRepository.findAllWithUser();
        LocalDate today = LocalDate.now();

        for (BloodDonateForm form : forms) {
            if (form.getReadyDate() == null || form.getUser() == null) continue;
            if (!"APPROVED".equalsIgnoreCase(form.getStatus())) continue;

            long days = ChronoUnit.DAYS.between(form.getReadyDate().toLocalDate(), today);

            // 4 mốc: 21, 42, 63, 84 ngày
            for (int i = 1; i <= 4; i++) {
                int milestone = i * 21;
                String reminderType = "DAY_" + milestone;
                boolean alreadySent = reminderRepository.existsByBloodDonateFormAndReminderType(form, reminderType);
                if (days == milestone && !alreadySent) {
                    emailService.sendRecoveryReminderEmail(form.getUser().getEmail(), i);

                    // Lưu lại reminder đã gửi
                    Reminder reminder = new Reminder();
                    reminder.setBloodDonateForm(form);
                    reminder.setReminderType(reminderType);
                    reminder.setSentAt(java.time.LocalDateTime.now());
                    reminderRepository.save(reminder);
                }
            }

        }
        log.info("=== Scheduler sendRecoveryReminders is doned ===");

    }
}
