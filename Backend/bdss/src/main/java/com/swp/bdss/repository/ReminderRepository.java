package com.swp.bdss.repository;

import com.swp.bdss.entities.BloodDonateForm;
import com.swp.bdss.entities.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    boolean existsByBloodDonateFormAndReminderType(BloodDonateForm bloodDonateForm, String reminderType);
}
