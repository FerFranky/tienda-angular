import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { tap } from 'rxjs';
import { Store } from 'src/app/shared/interfaces/store.interface';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  model = {
    name: '',
    store: '',
    shippingAddress: '',
    city: '',
  }


  isDelivery: boolean = false
  stores: Store[] = []

  constructor(private dataService: DataService){}
  onSubmit({value: formData}: NgForm):void{
    const data = {
      ...formData,
      date: this.getCurrencyDay(),
      pickup: this.isDelivery
    }
    this.dataService.saveOrder(formData).pipe(tap(res=> console.log(res))).subscribe()
  }
  ngOnInit():void{
    this.getStores()
  }
  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value
  }
  private getStores(): void {
    this.dataService.getStores()
    .pipe(tap((stores:Store[]) => this.stores = stores 
    ))
    .subscribe()
  }

  private getCurrencyDay(): string {
    return new Date().toLocaleDateString()
  }
}
