package com.Liyah.Souk.repository;

import com.Liyah.Souk.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByMarketId(Long marketId);
}
