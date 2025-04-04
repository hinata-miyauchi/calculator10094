//こめんと
import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  display: string = '';
  result: string = '';

  onButtonClick(buttonValue: string): void {
    if (buttonValue === '=') {
      try {
        this.result = 'Answer:  ' + this.calculate(this.display);
      } catch (error) {
        this.result = 'Error'; 
      }
    } else if (buttonValue === 'AC') {
      this.display = '';
      this.result = '';
    } else if (buttonValue === 'DEL') {
      this.deleteLastCharacter();
    } else {
      this.display += buttonValue;
      this.display = this.display.replace(/\*/g, '×');
      this.display = this.display.replace(/\//g, '÷');
    }
  }

  calculate(expression: string): string {
    try {
      const result = this.evaluateExpression(expression);
      return this.formatResult(result);
    } catch (e) {
      throw new Error('Invalid expression');
    }
  }

  evaluateExpression(expression: string): number {
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    return new Function('return ' + expression)();
  }

  formatResult(result: number): string {
    if (Math.abs(result) >= 10000000000) {
      throw new Error('Result exceeds 10 billion');
    }
    const roundedResult = result.toFixed(8);
    return parseFloat(roundedResult).toString(); 
  }

  deleteLastCharacter() {
    this.display = this.display.slice(0, -1);
  }
}
