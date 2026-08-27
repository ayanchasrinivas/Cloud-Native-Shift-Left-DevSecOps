package com.devsecops.userservice.service;

import com.devsecops.userservice.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final ConcurrentHashMap<String, User> users = new ConcurrentHashMap<>();

    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    public Optional<User> getUserById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    public User createUser(User user) {
        users.put(user.getId(), user);
        return user;
    }

    public boolean deleteUser(String id) {
        return users.remove(id) != null;
    }
}

