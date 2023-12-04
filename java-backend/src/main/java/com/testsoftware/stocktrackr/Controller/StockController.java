package com.testsoftware.stocktrackr.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.testsoftware.stocktrackr.Models.*;
import com.testsoftware.stocktrackr.Service.StockService;

@RestController()
@RequestMapping("/stock")
@CrossOrigin(origins = "http://localhost:4200")
public class StockController {

    private final Stock stock;

    @Autowired
    public StockController(StockService stockService) {
        this.stock = stockService.getStockService();
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        try {
            List<Product> products = stock.getProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addProduct(@RequestBody Product request) {
        try {
            Product product = Product.createProduct(
                    request.getName(),
                    request.getDescription(),
                    request.getPrice(),
                    request.getQuantity(),
                    request.getTax());

            stock.addProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<Object> updateProduct(@RequestBody Product product) {
        try {
            var result = stock.updateProduct(product);
            if (result)
                return ResponseEntity.status(HttpStatus.OK).build();
            throw new Exception("Product not found!");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<Object> removeProduct(@RequestBody Product product) {
        try {
            var result = stock.removeProductFromStock(product);
            if (result)
                return ResponseEntity.status(HttpStatus.OK).build();
            throw new Exception("Product not found!");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
