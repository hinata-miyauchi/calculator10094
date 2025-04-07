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
  maxDigits: number = 10;
  maxDecimalDigits: number = 8;

  onButtonClick(buttonValue: string): void {
    if (buttonValue === '=') {
      try {
        this.result = 'Answer: ' + this.calculate(this.display);
      } catch (error) {
        this.result = 'Error';
      }
    } else if (buttonValue === 'AC') {
      this.display = '';
      this.result = '';
    } else if (buttonValue === 'DEL') {
      this.deleteLastCharacter();
    } else {
      this.handleInput(buttonValue);
    }
  }

  handleInput(char: string): void {
    if (this.isOperator(char)) {
      this.display += char;
    } else {
      const lastSegment = this.display.split(/[\+\-\×\÷]/).pop() || '';

      if (lastSegment.includes('.')) {
        const decimalPart = lastSegment.split('.')[1] || '';
        if (decimalPart.length >= this.maxDecimalDigits) {
          throw new Error('Decimal places exceed 8 digits');
        }
      } else if (lastSegment.length >= this.maxDigits) {
        throw new Error('Input exceeds 10 digits');
      }

      this.display += char;
    }
    this.display = this.display.replace(/\*/g, '×').replace(/\//g, '÷');
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
    return Number(roundedResult).toString();
  }

  deleteLastCharacter(): void {
    this.display = this.display.slice(0, -1);
  }

  isDigit(char: string): boolean {
    return /^\d$/.test(char);
  }

  isOperator(char: string): boolean {
    return /^[+\-×÷.]$/.test(char);
  }
}
