package com.testsoftware.stocktrackr.Controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.testsoftware.stocktrackr.Models.*;
import com.testsoftware.stocktrackr.Service.StockService;

@RestController()
@RequestMapping("/sale")
@CrossOrigin(origins = "http://localhost:4200")
public class SaleController {

    private final Stock stock;
    private Sale sale;

    @Autowired
    public SaleController(StockService stockService) {
        this.stock = stockService.getStockService();
        this.sale = new Sale(this.stock);
    }

    @PostMapping
    public ResponseEntity<Object> createSale(@RequestBody Sale saleRequest) {

        this.sale = new Sale(this.stock);

        List<String> productNames = saleRequest.getProducts();

        try {
            for (int i = 0; i < productNames.size(); i++) {
                this.sale.addSaleProduct(productNames.get(i), saleRequest.getQuantity().get(i));
            }

            System.out.println(this.sale.getTotalAmount());

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<Object> checkoutSale(@RequestBody Checkout checkout) {
        try {
            this.sale.checkoutPayment(checkout.getPaymentValue(), checkout.getPaymentType());
            return ResponseEntity.status(HttpStatus.OK).body(this.sale);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
