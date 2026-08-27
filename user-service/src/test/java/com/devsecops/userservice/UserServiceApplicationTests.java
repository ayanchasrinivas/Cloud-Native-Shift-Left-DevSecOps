package com.devsecops.userservice;

import com.devsecops.userservice.model.User;
import com.devsecops.userservice.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceApplicationTests {

    @Test
    void contextLoads() {}

    @Test
    void testCreateAndGetUser() {
        UserService service = new UserService();
        User user = new User("Test User", "test@example.com");
        service.createUser(user);
        assertTrue(service.getUserById(user.getId()).isPresent());
        assertEquals("Test User", service.getUserById(user.getId()).get().getName());
    }

    @Test
    void testDeleteUser() {
        UserService service = new UserService();
        User user = new User("Delete Me", "delete@example.com");
        service.createUser(user);
        assertTrue(service.deleteUser(user.getId()));
        assertFalse(service.getUserById(user.getId()).isPresent());
    }
}

