package com.Liyah.Souk.controller;

import com.Liyah.Souk.model.Market;
import com.Liyah.Souk.model.Product;
import com.Liyah.Souk.repository.MarketRepository;
import com.Liyah.Souk.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
@CrossOrigin(origins = "http://localhost:3000")
public class MarketController {

    @Autowired
    private MarketRepository marketRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Market> getAllMarkets() {
        return marketRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Market> getMarketById(@PathVariable Long id) {
        return marketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Market createMarket(@RequestBody Market market) {
        return marketRepository.save(market);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Market> updateMarket(@PathVariable Long id, @RequestBody Market marketDetails) {
        return marketRepository.findById(id).map(market -> {
            market.setName(marketDetails.getName());
            market.setLocation(marketDetails.getLocation());
            Market updated = marketRepository.save(market);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarket(@PathVariable Long id) {
        return marketRepository.findById(id).map(market -> {
            marketRepository.delete(market);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Endpoint to get products by market id
    @GetMapping("/{marketId}/products")
    public ResponseEntity<List<Product>> getProductsByMarket(@PathVariable Long marketId) {
        if (!marketRepository.existsById(marketId)) {
            return ResponseEntity.notFound().build();
        }
        List<Product> products = productRepository.findByMarketId(marketId);
        return ResponseEntity.ok(products);
    }
}
