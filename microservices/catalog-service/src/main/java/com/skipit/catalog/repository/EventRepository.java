package com.skipit.catalog.repository;

import com.skipit.catalog.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    
    // Encontrar eventos destacados para el carrusel, ordenados por carouselOrder
    List<Event> findByIsFeaturedTrueOrderByCarouselOrderAsc();

    // Encontrar eventos futuros (isoDate >= hoy)
    List<Event> findByIsoDateGreaterThanEqualOrderByIsoDateAsc(LocalDate date);
}
