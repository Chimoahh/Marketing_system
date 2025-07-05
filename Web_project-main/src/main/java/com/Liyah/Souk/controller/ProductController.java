package com.Liyah.Souk.controller;

import com.Liyah.Souk.model.Market;
import com.Liyah.Souk.model.Product;
import com.Liyah.Souk.repository.MarketRepository;
import com.Liyah.Souk.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MarketRepository marketRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getMarket() == null || product.getMarket().getId() == null) {
            return ResponseEntity.badRequest().body("Market must be selected.");
        }

        Optional<Market> marketOpt = marketRepository.findById(product.getMarket().getId());
        if (marketOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Market with ID " + product.getMarket().getId() + " not found.");
        }

        product.setMarket(marketOpt.get());
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> existingProductOpt = productRepository.findById(id);
        if (existingProductOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (productDetails.getMarket() == null || productDetails.getMarket().getId() == null) {
            return ResponseEntity.badRequest().body("Market must be selected.");
        }

        Optional<Market> marketOpt = marketRepository.findById(productDetails.getMarket().getId());
        if (marketOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Market with ID " + productDetails.getMarket().getId() + " not found.");
        }

        Product existingProduct = existingProductOpt.get();
        existingProduct.setName(productDetails.getName());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setMarket(marketOpt.get());

        Product updated = productRepository.save(existingProduct);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        productRepository.delete(productOpt.get());
        return ResponseEntity.ok().build();
    }
}
