import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
      <a [routerLink]="['/']"><span>Store</span></a>
      <span class="spacer">
        <app-cart class="mouseHover" (click)="goToCheckout()"></app-cart>
      </span>
    </mat-toolbar>
    <!-- <header>
		<nav class="navegacion">
			<ul class="menu">
				<li><a href="#">Inicio</a></li>
				<li><a href="#">Nosotros</a></li>
				<li><a href="#">Servicios</a>
					<ul class="submenu">
						<li><a href="#">Servicio #1</a></li>
						<li><a href="#">Servicio #2</a></li>
						<li><a href="#">Servicio #3</a></li>
					</ul>
				</li>
				<li><a href="#">Contacto</a></li>
			</ul>
		</nav>
	</header> -->
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router){}
  goToCheckout(): void {
    this.router.navigate(['/checkout'])
  }
}
