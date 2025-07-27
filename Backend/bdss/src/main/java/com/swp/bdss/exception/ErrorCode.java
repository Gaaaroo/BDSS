package com.swp.bdss.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    UNCATEGORIZE_EXCEPTION(9999, "Uncategorize exception", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1001, "User already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED( 1002, "User not existed", HttpStatus.BAD_REQUEST ),
    UNAUTHENTICATED( 1003, "Unauthenticated", HttpStatus.NOT_FOUND ),
    INCORRECT_PASSWORD(1004, "The password you entered is incorrect", HttpStatus.BAD_REQUEST),
    INCORRECT_TOKEN(1005, "Your Token is INVALID", HttpStatus.UNAUTHORIZED),
    OTP_NOT_EXISTED(1006, "OTP code does not exist", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1007, "Email already existed", HttpStatus.BAD_REQUEST),
    USER_IS_NOT_ACTIVE(1008, "User is not active", HttpStatus.BAD_REQUEST),
    OTP_CODE_EXPIRED(1009, "OTP code has expired", HttpStatus.BAD_REQUEST),
    OTP_CODE_INVALID(1010, "OTP code is invalid", HttpStatus.BAD_REQUEST),
    BLOOD_DONATE_FORM_NOT_EXISTED(1011, "Blood donate form not existed", HttpStatus.BAD_REQUEST),
    BLOG_NOT_EXISTED(1012, "Blog not existed", HttpStatus.BAD_REQUEST),
    FORUM_POST_NOT_EXISTED(1013, "Forum post not existed", HttpStatus.BAD_REQUEST),
    FORUM_POST_CANNOT_DELETE(1014, "You cannot delete this post", HttpStatus.BAD_REQUEST),
    NO_FORUM_POST(1015, "No forum post found", HttpStatus.BAD_REQUEST),
    COMMENT_NOT_EXISTED(1016, "Comment not existed", HttpStatus.BAD_REQUEST),
    COMMENT_CANNOT_DELETE(1017, "You cannot delete this comment", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN_TYPE(1018, "Invalid token type, token type must be refresh", HttpStatus.BAD_REQUEST),
    NO_BLOOD_DONATE_FORM(1019, "No blood donate form found", HttpStatus.BAD_REQUEST),
    PREVIOUS_STEP_NOT_DONE(1020, "Previous step is not done", HttpStatus.BAD_REQUEST),
    NO_BLOOD_RECEIVE_FORM_WITH_PRIORITY(1021, "There's no blood receive form with this priority", HttpStatus.BAD_REQUEST),
    STEP_NOT_FINISHED(1022, "Step 5 has not been completed yet", HttpStatus.BAD_REQUEST),
    STEP_NOT_DONE(1023, "Step 5 has not been done yet", HttpStatus.BAD_REQUEST),
    BLOOD_UNIT_NOT_EXIST(1024, "Blood unit not exist", HttpStatus.BAD_REQUEST),
    INVALID_STEP_NUMBER1(1025, "Step number must between 1 and 5", HttpStatus.BAD_REQUEST),
    INVALID_STEP_NUMBER2(1026, "Step number must between 1 and 3", HttpStatus.BAD_REQUEST),
    NO_BLOOD_RECEIVE_FORM(1027, "There's no blood receive form", HttpStatus.BAD_REQUEST),
    STEP_NOT_FOUND(1028, "Step not found for donation ID and step number", HttpStatus.BAD_REQUEST),
    NOT_ELIGIBLE_TO_REGISTER_RECEIVE(1029, "User is not eligible to register blood receive form", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1030, "Username already existed", HttpStatus.BAD_REQUEST),
    INVALID_MODE(1031, "Mode must be one of: day, month, year", HttpStatus.BAD_REQUEST),
    RECEIVE_FORM_NOT_EXISTED(1032, "Receive form not existed", HttpStatus.BAD_REQUEST),
    BLOOD_UNIT_ALREADY_USED_OR_INVALID(1033, "Blood unit already used or invalid", HttpStatus.BAD_REQUEST),
    BLOOD_COMPONENT_ALREADY_USED_OR_INVALID(1033, "Blood component unit already used or invalid", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NOT_FOUND(1034, "Notification not exist", HttpStatus.BAD_REQUEST),
    FORUM_POST_BY_STAFF(1035, "You cannot delete forum post that created by another staff", HttpStatus.BAD_REQUEST),
    COMMENT_POST_BY_STAFF(1036, "You cannot delete a comment that created by another staff", HttpStatus.BAD_REQUEST),

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
