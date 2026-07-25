package com.trasker.Tasker.handle_exeption;

import com.trasker.Tasker.DTO.ExeptionResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(TaskNotFoundExeption.class)
    ResponseEntity<ExeptionResponseDTO> handleTaskNotFound(TaskNotFoundExeption exeption){
       ExeptionResponseDTO errorResponse = new ExeptionResponseDTO(exeption.getMessage(), 404);
       return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}
