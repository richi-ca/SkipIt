package com.skipit.backend.controller;

import com.skipit.backend.dto.event.EventDto;
import com.skipit.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<EventDto>> getFeaturedEvents() {
        return ResponseEntity.ok(eventService.getFeaturedEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Integer id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}
