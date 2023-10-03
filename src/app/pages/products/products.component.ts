import { Component } from '@angular/core';
import { ProductsService } from './services/product.service';
import { tap } from 'rxjs';
import { Product } from './product/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products!: Product[]
  constructor(private productoService: ProductsService, private shoppingCartService: ShoppingCartService){}

  ngOnInit(): void {
    this.productoService.getProducts()
    .pipe(
      tap((products: Product[]) => this.products = products)
    )
    .subscribe()
  }

  addToCart(product: Product): void{
    this.shoppingCartService.updateCart(product)
    
  }
}
