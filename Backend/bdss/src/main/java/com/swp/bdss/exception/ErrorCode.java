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
    USER_IS_ACTIVE(1008, "User is active", HttpStatus.BAD_REQUEST),
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
    INVALID_STEP_NUMBER(1021, "Step number must between 1 and 5", HttpStatus.BAD_REQUEST),
    STEP_NOT_FINISHED(1022, "Step 5 has not been completed yet", HttpStatus.BAD_REQUEST),
    STEP_NOT_DONE(1023, "Step 5 has not been done yet", HttpStatus.BAD_REQUEST),
    BLOODUNIT_NOT_EXIST(1024, "Blood unit not exist", HttpStatus.BAD_REQUEST),
    INVALID_STEP_NUMBER1(1025, "Step number must between 1 and 5", HttpStatus.BAD_REQUEST),
    INVALID_STEP_NUMBER2(1026, "Step number must between 1 and 3", HttpStatus.BAD_REQUEST),
    NO_BLOOD_RECEIVE_FORM(1027, "Blood receive form with this id is not existed", HttpStatus.BAD_REQUEST),
    STEP_NOT_FOUND(1028, "Step not found for donation ID and step number", HttpStatus.BAD_REQUEST),
    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
