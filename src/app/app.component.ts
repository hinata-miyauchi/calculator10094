//こめんと
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from '../app/calculator/calculator.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CalculatorComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cal-app';
}