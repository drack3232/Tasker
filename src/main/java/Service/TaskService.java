package Service;

import DTO.TaskCreateDTO;
import DTO.TaskResponseDTO;
import Entity.Task;
import Reposetorys.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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




}
