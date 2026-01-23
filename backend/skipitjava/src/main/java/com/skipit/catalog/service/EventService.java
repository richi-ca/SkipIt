package com.skipit.catalog.service;

import com.skipit.catalog.dto.event.EventDto;
import com.skipit.catalog.dto.menu.MenuDto;
import com.skipit.catalog.entity.Event;
import com.skipit.catalog.repository.EventRepository;
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

    @Autowired
    private MenuService menuService;

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

    @Transactional(readOnly = true)
    public MenuDto getMenuByEventId(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
        
        if (event.getMenu() == null) {
            throw new RuntimeException("Menu not found for event ID: " + eventId);
        }

        return menuService.getMenuById(event.getMenu().getId());
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
