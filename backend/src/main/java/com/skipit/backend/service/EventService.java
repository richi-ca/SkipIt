package com.skipit.backend.service;

import com.skipit.backend.dto.event.EventDto;
import com.skipit.backend.entity.Event;
import com.skipit.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Transactional(readOnly = true)
    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto> getUpcomingEvents() {
        // Obtener eventos desde hoy en adelante
        return eventRepository.findByIsoDateGreaterThanEqualOrderByIsoDateAsc(LocalDate.now()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto> getFeaturedEvents() {
        return eventRepository.findByIsFeaturedTrueOrderByCarouselOrderAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDto getEventById(Integer id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
        return mapToDto(event);
    }

    private EventDto mapToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .overlayTitle(event.getOverlayTitle())
                .isoDate(event.getIsoDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .price(event.getPrice())
                .rating(event.getRating())
                .type(event.getType())
                .isFeatured(event.isFeatured())
                .carouselOrder(event.getCarouselOrder())
                // Si el evento tiene menú, enviamos su ID
                .menuId(event.getMenu() != null ? event.getMenu().getId() : null)
                .build();
    }
}
