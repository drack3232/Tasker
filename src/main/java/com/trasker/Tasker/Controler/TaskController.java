package com.trasker.Tasker.Controler;

import com.trasker.Tasker.DTO.TaskCreateDTO;
import com.trasker.Tasker.DTO.TaskResponseDTO;
import com.trasker.Tasker.Service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;

    }

  @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> findAll() {
      long userId = 1L;
      List<TaskResponseDTO> tasks = taskService.findAllTasks(userId);
        return ResponseEntity.ok(tasks);
  }

  @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(  @Valid @RequestBody TaskCreateDTO taskCreateDTO  ){
        long userId = 1L;
   TaskResponseDTO savedTask = taskService.createTask(userId, taskCreateDTO);

   return ResponseEntity.status(HttpStatus.CREATED).body((savedTask));
  }

@PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskCreateDTO taskCreateDTO) {
    Long userId = 1L;

        TaskResponseDTO updateTask = taskService.updateTask( id,userId, taskCreateDTO);
        return ResponseEntity.ok(updateTask);
}

@DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return  ResponseEntity.noContent().build();
}

@GetMapping("/{id}/export")
    public ResponseEntity<String> exportTask(@PathVariable Long id) {
        Long userId = 1L;
        String icsContent = taskService.generateIcs(id,userId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/calendar; charset=utf-8")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Task-" + id + ".ics\"")
                .body(icsContent);
}

}
