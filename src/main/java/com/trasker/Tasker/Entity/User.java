package com.trasker.Tasker.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email",unique = true ,columnDefinition = "TEXT")
    private String email;

    @Column(nullable = false)
    private String password;

}
