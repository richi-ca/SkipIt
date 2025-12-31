package com.skipit.backend.repository;

import com.skipit.backend.entity.SiteConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteConfigurationRepository extends JpaRepository<SiteConfiguration, String> {
}
