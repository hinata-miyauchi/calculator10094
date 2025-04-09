import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
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
    if (this.display === '' && char === '0') {
      this.display = '0';
      return;
    }

    if (this.display === '0' && (char !== '.' && char !== '×' && char !== '÷' && char !== '+' && char !== '-')) {
      return;
    }

    if (this.display === '' && (char === '.' || char === '×' || char === '÷' || char === '+')) {
      return;
    }

    if ((this.display.slice(-1) === '×' || this.display.slice(-1) === '÷'|| this.display.slice(-1) === '+' || this.display.slice(-1) === '-') && (char === '×' || char === '÷' || char === '+')) {
      return;
    } else if ((this.display.slice(-1) === '×' || this.display.slice(-1) === '÷'|| this.display.slice(-1) === '+') && (char === '-')) {
      this.display += char;
    } else if ((this.display.slice(-1) === '-') && (char === '-' || char === '.')) {
      return;
    } else if ((this.display.slice(-1) === '.') && (char === '-')) {
        return;
    }

    if (this.isOperator(this.display.slice(-1)) && char === '0' && this.display.slice(-2) === '0') {
      return;
    }

    if (this.isOperator(this.display.slice(-1)) && char === '.') {
      return;
    }

    if ((this.display.endsWith('×') && char === '×') || (this.display.endsWith('÷') && char === '÷') || (this.display.endsWith('+') && char === '+') || (this.display.endsWith('-') && char === '-')) {
      return;
    }

    if (this.isOperator(this.display.slice(-1)) && (char === '×' || char === '÷' || char === '+')) {
      return;
    }

    if ((this.display.slice(-1) === '×' || this.display.slice(-1) === '÷' ) && char === '-') {
      this.display += char; 
    }

    if ((this.display.slice(-2,-1) === '×' || this.display.slice(-2,-1) === '÷'  || this.display.slice(-2,-1) === '+' || this.display.slice(-2,-1) === '-') 
      && (this.display.slice(-1) === '0') && ((!this.isOperator(char)) && char !== '.')) {
      return;
    }

    if (char === '.') {
      const lastSegment = this.display.split(/[\+\-\×\÷]/).pop() || '';
      if (lastSegment.includes('.')) {
        return;
      }

      if (this.display === '') {
        this.display = '0.';
        return;
      }
    }

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

    expression = expression.replace(/(?<=\d)-/g, ' -');

    return eval(expression);
  }

  formatResult(result: number): string {
    if (Math.abs(result) >= 10000000000) {
      throw new Error('Result exceeds 10 billion');
    }
    const roundedResult = result.toFixed(8);
    return Number(roundedResult).toString();
  }

  deleteLastCharacter(): void {
    if (this.display.length > 1) {
      this.display = this.display.slice(0, -1);
      this.result = '';
    } else {
      this.display = '';
      this.result = '';
    }
  }

  isDigit(char: string): boolean {
    return /^\d$/.test(char);
  }

  isOperator(char: string): boolean {
    return /^[+\-×÷.]$/.test(char);
  }
}