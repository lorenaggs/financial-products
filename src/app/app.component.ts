import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ProductsComponent} from './presentation/products/products.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductsComponent],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'financial-products';
}
