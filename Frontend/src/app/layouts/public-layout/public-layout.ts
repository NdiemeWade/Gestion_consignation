import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet], //  Obligatoire pour faire fonctionner <router-outlet>
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss'
})
export class PublicLayoutComponent {}