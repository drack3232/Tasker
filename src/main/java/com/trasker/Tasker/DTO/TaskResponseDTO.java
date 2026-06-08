package com.trasker.Tasker.DTO;

import jakarta.validation.constraints.*;


import java.time.LocalDateTime;

public record TaskResponseDTO(
        Long id,

        @NotBlank(message = "Here you can have title for task")
        @Size(min = 3, max = 25)
        String title,

        String description,
        @NotNull
        @Future(message = "Deadline can`t be in past")
        LocalDateTime deadline
) {
}
