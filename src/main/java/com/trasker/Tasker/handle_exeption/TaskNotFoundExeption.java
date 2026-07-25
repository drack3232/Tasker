package com.trasker.Tasker.handle_exeption;

public class TaskNotFoundExeption extends RuntimeException {
public TaskNotFoundExeption(String message){
    super(message);
}
}
