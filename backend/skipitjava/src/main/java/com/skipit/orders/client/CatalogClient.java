package com.skipit.orders.client;

import com.skipit.orders.dto.external.EventDto;
import com.skipit.orders.dto.external.ProductVariationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class CatalogClient {

    @Autowired
    private RestTemplate restTemplate;

    private final String CATALOG_URL = "http://localhost:8082/api";

    public EventDto getEventById(Integer id) {
        return restTemplate.getForObject(CATALOG_URL + "/events/" + id, EventDto.class);
    }

    public ProductVariationDto getVariationById(Integer id) {
        return restTemplate.getForObject(CATALOG_URL + "/products/variations/" + id, ProductVariationDto.class);
    }
}
