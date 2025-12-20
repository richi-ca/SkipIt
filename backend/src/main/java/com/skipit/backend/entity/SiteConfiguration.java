package com.skipit.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "site_configuration")
public class SiteConfiguration {

    @Id
    @Column(name = "section_key", nullable = false)
    private String sectionKey;

    @Column(name = "content_json", columnDefinition = "JSON", nullable = false)
    private String contentJson;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
