package com.swp.bdss.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class LoginGoogleController {
    @RequestMapping("/")
    public String home() {
        return "Hello, World!";
    }
    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }
}
