package Service;

import DTO.TaskCreateDTO;
import DTO.TaskResponseDTO;
import Entity.Task;
import Reposetorys.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional
    public TaskResponseDTO createTask(long userId, TaskCreateDTO taskCreateDTO) {
        if(taskRepository.existsByUserIdAndTitle(userId, taskCreateDTO.title())){
            throw new IllegalArgumentException("Task already exists");
        }
        Task task = new Task();
        task.setTitle(taskCreateDTO.title());
        task.setDescription(taskCreateDTO.description());
        task.setDeadline(taskCreateDTO.deadline());
        task.setUserId(userId);

        Task savedTask = taskRepository.save(task);

        return new TaskResponseDTO(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getDeadline()
        );

    }

@Transactional(readOnly = true)
    public List<TaskResponseDTO> findAllTasks(Long userId) {
        List<Task> userTasks = taskRepository.findAllByUserId(userId);

        return userTasks.stream()
                .map(task -> new TaskResponseDTO(
                   task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getDeadline()
                ))
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
        return new TaskResponseDTO(savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getDeadline());

    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        taskRepository.deleteById(taskId);
    }



}
