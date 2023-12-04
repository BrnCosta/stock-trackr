package com.testsoftware.stocktrackr.Models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Checkout {
    PaymentType paymentType;
    double paymentValue;
}
