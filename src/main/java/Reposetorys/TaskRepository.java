package Reposetorys;

import Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
List<Task> findByUserId(Long userId);
List<Task> findByUserIdAndDeadlineAfter(Long userId, LocalDateTime dedlineAfter);
boolean existsByUserIdAndTitle(Long userId, String title);
}
