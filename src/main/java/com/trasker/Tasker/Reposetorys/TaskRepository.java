package com.trasker.Tasker.Reposetorys;

import com.trasker.Tasker.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
List<Task> findByUserId(Long userId);
List<Task> findByUserIdAndDeadlineAfter(Long userId, LocalDateTime dedlineAfter);
List<Task> findAllByUserId(Long userId);
boolean existsByUserIdAndTitle(Long userId, String title);
Optional<Task> findByIdAndUserId(Long id, Long userId);
}
