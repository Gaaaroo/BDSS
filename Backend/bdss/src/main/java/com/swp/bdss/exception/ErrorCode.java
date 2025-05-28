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
    INCORRECT_ROLE(1005, "The role must be 'ADMIN, STAFF, MEMBER'", HttpStatus.BAD_REQUEST)
    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
