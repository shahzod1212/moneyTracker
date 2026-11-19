package com.example.money_manager.controller;

import com.example.money_manager.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboardInformation(){
        Map<String, Object> result = dashboardService.dashboardInformation();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/dashboard/team/{teamId}")
    public ResponseEntity<Map<String, Object>> teamDashboardInformation(
            @PathVariable("teamId") Long teamId){
        Map<String, Object> result = dashboardService.teamDashboardInformation(teamId);
        return ResponseEntity.ok(result);
    }
}