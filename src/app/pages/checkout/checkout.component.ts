import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { delay, switchMap, tap } from 'rxjs';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { NgForm } from '@angular/forms';
import { Details } from 'src/app/shared/interfaces/order.interface';
import { Product } from '../products/product/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: '',
  };

  isDelivery: boolean = true;
  stores: Store[] = [];
  cart: Product[] = [];

  constructor(
    private dataService: DataService,
    private shoppingCartService: ShoppingCartService,
    private router:Router
  ) {}
  onSubmit({ value: formData }: NgForm): void {
    const data = {
      ...formData,
      date: this.getCurrencyDay(),
      isDelivery: this.isDelivery,
    };
    this.dataService
      .saveOrder(data)
      .pipe(
        tap((res) => console.log('res =>', res)),
        switchMap(({id: orderId}) => {
          const details = this.prepareDetails();
          return this.dataService.saveDetailsOrder({ details, orderId });
        }),
        tap(() => this.router.navigate(['/checkout/thank-you'])),
        delay(500),
        tap(() => this.shoppingCartService.resetCart())
      )
      .subscribe();
  }
  ngOnInit(): void {
    this.getStores()
    this.getDataCart()
    this.prepareDetails()
  }
  onPickupOrDelivery(value: boolean): void {
    console.log(value);
    
    this.isDelivery = value;
  }
  private getStores(): void {
    this.dataService
      .getStores()
      .pipe(tap((stores: Store[]) => (this.stores = stores)))
      .subscribe();
  }

  private getCurrencyDay(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails() {
    const details: Details[] = [];
    this.cart.forEach((product: Product )=> {
      const {id: productId, name: productName, quantity, stock} = product
      details.push({productId, productName, quantity})
    })
    return details
  }

  private getDataCart(): void {
    this.shoppingCartService.cartAction$
      .pipe(tap((products: Product[]) => (this.cart = products)))
      .subscribe();
  }
}
