package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.Numberservice;
@RestController
@RequestMapping("/number")
public class Numbercontroller {
	    @Autowired
	    private Numberservice numbersService;

	    @GetMapping("/convert/{val}")
	    public String convertNumber(@PathVariable int val) {
	        return numbersService.numToString(val);
	    }

}
