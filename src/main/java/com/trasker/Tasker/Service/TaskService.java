package com.trasker.Tasker.Service;

import com.trasker.Tasker.DTO.TaskCreateDTO;
import com.trasker.Tasker.DTO.TaskResponseDTO;
import com.trasker.Tasker.Entity.Status;
import com.trasker.Tasker.Entity.Task;
import com.trasker.Tasker.Reposetorys.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    private TaskResponseDTO convertTask(Task task){
        return new TaskResponseDTO(
                task.getId(),
                task.getStatus(),
                task.getTitle(),
                task.getDescription(),
                task.getDeadline()
        );
    }

    @Transactional
    public TaskResponseDTO createTask(long userId, TaskCreateDTO taskCreateDTO) {
        if(taskRepository.existsByUserIdAndTitle(userId, taskCreateDTO.title())){
            throw new IllegalArgumentException("Task already exists");
        }
        Task task = new Task();
        task.setTitle(taskCreateDTO.title());
        task.setStatus(taskCreateDTO.status());
        task.setDescription(taskCreateDTO.description());
        task.setDeadline(taskCreateDTO.deadline());
        task.setUserId(userId);

        Task savedTask = taskRepository.save(task);

        return convertTask(savedTask);

    }

@Transactional(readOnly = true)
    public List<TaskResponseDTO> findAllTasks(Long userId) {
        List<Task> userTasks = taskRepository.findAllByUserId(userId);

        return userTasks.stream()
                .map(this::convertTask
                )
                .toList();
    }

    @Transactional
    public TaskResponseDTO updateTask(Long taskId,Long userId, TaskCreateDTO taskCreateDTO) {
        Task existingTask = taskRepository.findByIdAndUserId(taskId,userId )
                .orElseThrow(() -> new IllegalArgumentException("Task with UsertId: " + taskId + "dont found!"));

        existingTask.setTitle(taskCreateDTO.title());
        existingTask.setDescription(taskCreateDTO.description());
        existingTask.setDeadline(taskCreateDTO.deadline());

        Task savedTask = taskRepository.save(existingTask);
        return convertTask(existingTask);

    }

    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public List<TaskResponseDTO> getTasksByStatus(Status status, Long userId) {
        List<Task> userTasks = taskRepository.findAllByStatusAndUserId(status,userId);
        return userTasks.stream()
                .map(this::convertTask)
                .toList();
    }

    @Transactional(readOnly = true)
    public String generateIcs(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Task with UsertId: " + taskId + " dont found!"));

        LocalDateTime timeFormat = task.getDeadline();
        if(timeFormat ==null){
            timeFormat = LocalDateTime.now().plusDays(1);
        }

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
        String formattedDate = timeFormat.format(formatter);
        StringBuilder icsBuilder = new StringBuilder();
        icsBuilder.append("BEGIN:VCALENDAR\n")
                .append("VERSION:2.0\n")
                .append("PRODID:-//TaskerApp//Task//UK\n")
                .append("BEGIN:VEVENT\n")

                .append("SUMMARY:").append(task.getTitle()).append("\n")
                .append("DESCRIPTION:").append(task.getDescription() != null ? task.getDescription() : "Without description").append("\n")


                .append("DTSTART:").append(formattedDate).append("\n")
                .append("DTEND:").append(formattedDate).append("\n")


                .append("BEGIN:VALARM\n")
                .append("TRIGGER:-PT1H\n")
                .append("ACTION:DISPLAY\n")
                .append("DESCRIPTION").append(task.getTitle()).append("\n")
                .append("END:VALARM\n")

                .append("END:VEVENT\n")
                .append("END:VCALENDAR\n");

        return icsBuilder.toString();
    }



}
