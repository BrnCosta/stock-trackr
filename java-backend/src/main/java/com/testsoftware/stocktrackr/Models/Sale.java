package com.testsoftware.stocktrackr.Models;

import java.util.*;

import lombok.*;

@Getter
@Setter
public class Sale {
    List<String> products = new ArrayList<String>();
    List<Integer> quantity = new ArrayList<Integer>();
    double totalAmount = 0.0;
    Date date;
    boolean sold = false;
    double change = 0.0;

    private Stock stock;

    public Sale() {
    }

    public Sale(Stock stock) {
        this.stock = stock;
    }

    public void addSaleProduct(String productName, int quantity) throws Exception {
        if (productName.isEmpty())
            throw new Exception("Product not valid!");

        Product product = stock.getProductByName(productName);
        if (product == null)
            throw new Exception(String.format("Product %s not exist in stock!", productName));

        boolean isQuantityEnough = stock.checkIfProductQuantityIsEnough(productName, quantity);
        if (!isQuantityEnough)
            throw new Exception(String.format("Quantity of %s in stock is not enough!", productName));

        this.products.add(product.getName());
        this.quantity.add(quantity);

        this.totalAmount += product.calculatePriceWithTax() * quantity;
    }

    public double calculateChange(double paymentValue, PaymentType paymentType) throws Exception {
        if (isCreditOrPix(paymentType))
            return 0;

        if (paymentValue <= 0)
            throw new Exception("Payment value cannot be zero/negative!");

        return paymentValue - this.totalAmount;
    }

    private boolean isCreditOrPix(PaymentType paymentType) {
        return paymentType == PaymentType.CREDIT_CARD || paymentType == PaymentType.PIX;
    }

    public boolean checkoutPayment(double paymentValue, PaymentType paymentType) throws Exception {
        if (paymentValue < this.totalAmount)
            throw new Exception("Payment denied!");

        if (paymentValue > this.totalAmount && isCreditOrPix(paymentType))
            throw new Exception("Payment should be the same value of total!");

        this.change = calculateChange(paymentValue, paymentType);
        this.date = new Date();

        for (int i = 0; i < this.products.size(); i++) {
            Product product = stock.getProductByName(this.products.get(i));
            int newQuantity = product.getQuantity() - this.quantity.get(i);
            stock.updateProductQuantity(this.products.get(i), newQuantity);
        }

        return this.sold = true;
    }
}
