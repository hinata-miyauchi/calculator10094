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
  disabledButtons: string[] = ['+', '×', '÷', '=', '.'];
  disabledNumberButtons: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  isButtonDisabled(buttonValue: string): boolean {
    if (this.result.includes("Error") && this.disabledButtons.includes(buttonValue)) {
      return true;
    }
    if (this.isOperator(this.display.slice(-1)) && this.disabledButtons.includes(buttonValue)) {
      return true;
    }
    if ((this.display.slice(-1) === '-' || this.display.slice(-1) === '.') && buttonValue === '-') {
      return true;
    }
    const lastSegment = this.display.split(/[\+\-\×\÷]/).pop() || '';
    if (lastSegment.includes('.') && buttonValue === '.') {
    return true;
    }
    if (this.display =='0' && this.disabledNumberButtons.includes(buttonValue)) {
      return true;
    }
    if (this.result.includes("Answer:") && (buttonValue === '.' || buttonValue === '=')) {
      return true;
    }
    if ((this.display === '' && this.result === '') && this.disabledButtons.includes(buttonValue)){
      return true;
    }
    return false;
  }

  onButtonClick(buttonValue: string): void {
    if (buttonValue === '=') {
      if (this.display.slice(-1) !== '×' && this.display.slice(-1) !== '÷' && this.display.slice(-1) !== '+' && this.display.slice(-1) !== '-' && this.display.slice(-1) !== '.') {
        try {
          this.result = 'Answer: ' + this.calculate(this.display);
        } catch (error) {
          this.result = 'Error';
        }
      } else {
        return;
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

    if (this.result.includes("Answer:")) {
      let match = this.result.match(/Answer:\s*(-?[\d.]+)/);
      if (match && !isNaN(Number(match[1]))) {
        if (this.isOperator(char)) {
            this.display = match[1];
            this.result = '';
        } else {
            this.display = '';
            this.result = '';
        }
      }
　　}

    if (this.result.includes("Error")) {
        if (!this.isOperator(char) && char !== '.') {
            this.result = '';
            this.display = '';
        } else if (char === '-') {
            this.display = '';
            this.result = ''; 
        } else if (this.isOperator(char)) {
            return;
        }
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