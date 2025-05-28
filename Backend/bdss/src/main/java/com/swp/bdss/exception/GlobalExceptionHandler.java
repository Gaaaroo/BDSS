package com.swp.bdss.exception;

import com.swp.bdss.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = SQLException.class)
    ResponseEntity<ApiResponse> handlingSQLException(SQLException exception) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.INCORRECT_ROLE.getCode());
        apiResponse.setMessage(ErrorCode.INCORRECT_ROLE.getMessage());
        return ResponseEntity.status(ErrorCode.INCORRECT_ROLE.getHttpStatus()).body(apiResponse);
    }
}
