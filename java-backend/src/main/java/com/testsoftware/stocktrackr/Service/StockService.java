package com.testsoftware.stocktrackr.Service;

import org.springframework.stereotype.Service;

import com.testsoftware.stocktrackr.Models.Stock;

@Service
public class StockService {
    private final Stock stock = new Stock();

    public Stock getStockService() {
        return stock;
    }
}
