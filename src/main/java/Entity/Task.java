package Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "task")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime deadline;

@Column(name = "user_id", nullable = false)
    private Long userId;

@Column(name = "create_at", nullable = false,unique = false)
    private LocalDateTime createAt;

@PrePersist
    protected void setTimeBeforeSave(){
    this.createAt = LocalDateTime.now();

}


}
