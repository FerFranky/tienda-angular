import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { Subscription, delay, switchMap, tap } from 'rxjs';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { NgForm } from '@angular/forms';
import { Details } from 'src/app/shared/interfaces/order.interface';
import { Product } from '../products/product/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  private cartSubscription: Subscription  | undefined;
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
    private router:Router,
    private productService: ProductsService
  ) {
    this.checkIfCartIsEmpty()
  }
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
        delay(2000),
        tap(() => this.shoppingCartService.resetCart())
      )
      .subscribe();
  }
  ngOnInit(): void {
    this.getStores()
    this.getDataCart()
    this.prepareDetails()
  }
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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
      const updateStock = stock - quantity
      this.productService.updateStock(productId, updateStock).pipe(
        tap(() => details.push({productId, productName, quantity}))
      ).subscribe()
      details.push({productId, productName, quantity})
    })
    return details
  }

  private getDataCart(): void {
    this.shoppingCartService.cartAction$
      .pipe(tap((products: Product[]) => (this.cart = products)))
      .subscribe();
  }

  private checkIfCartIsEmpty(): void {
    this.cartSubscription = this.shoppingCartService.cartAction$
      .pipe(
        tap((products: Product[]) => {
          if (Array.isArray(products) && !products.length) {
            this.router.navigate(['/products']);
          }
        })
      )
      .subscribe()
  }
}
