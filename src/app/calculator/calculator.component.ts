import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

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

  @ViewChild('displayBox') displayBox!: ElementRef;
  @ViewChild('resultBox') resultBox!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollDisplayToRight();
    this.scrollResultToRight();
  }

  scrollDisplayToRight(): void {
    if (this.displayBox && this.displayBox.nativeElement) {
      const el = this.displayBox.nativeElement;
      el.scrollLeft = el.scrollWidth;
    }
  }

  scrollResultToRight(): void {
    if (this.resultBox && this.resultBox.nativeElement) {
      const el = this.resultBox.nativeElement;
      el.scrollLeft = el.scrollWidth;
    }
  }

  isButtonDisabled(buttonValue: string): boolean {
    const lastSegment = this.display.split(/[\+\-\×\÷]/).pop() || '';
    const hasDecimal = lastSegment.includes('.');
    const [integerPart, decimalPart = ''] = lastSegment.split('.');
    if (this.result.includes("Error") && (buttonValue !== 'DEL' && buttonValue !== 'AC' && buttonValue !== 'CE')) {
      return true;
    }
    if (this.result.includes("Answer:") && this.disabledNumberButtons.includes(buttonValue)) {
      return true;
    }
    if (this.isOperator(this.display.slice(-1)) && this.disabledButtons.includes(buttonValue)) {
      return true;
    }
    if ((this.display.slice(-1) === '-' || this.display.slice(-1) === '.') && buttonValue === '-') {
      return true;
    }
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
    if ((this.display.slice(-2,-1) === '×' || this.display.slice(-2,-1) === '÷' || this.display.slice(-2,-1) === '+' || this.display.slice(-2,-1) === '-') && this.display.slice(-1) === '0' && buttonValue === '0' && this.result === '') {
      return true;
    }
    if (this.display.slice(-1) === '0' && (this.display.slice(-2,-1) === '×' || this.display.slice(-2,-1) === '÷' || this.display.slice(-2,-1) === '+' || this.display.slice(-2,-1) === '-') && this.disabledNumberButtons.includes(buttonValue)) {
      return true;
    }
    if (!hasDecimal && integerPart.length >= this.maxDigits && this.disabledNumberButtons.includes(buttonValue)) {
      return true;
    }
    if (hasDecimal && decimalPart.length >= this.maxDecimalDigits && this.disabledNumberButtons.includes(buttonValue)) {
      return true;
    }
    return false;
  }

  onButtonClick(buttonValue: string): void {
    if (buttonValue === '=') {
      if (this.display.slice(-1) !== '×' && this.display.slice(-1) !== '÷' && this.display.slice(-1) !== '+' && this.display.slice(-1) !== '-' && this.display.slice(-1) !== '.') {
        try {
          this.result = 'Answer: ' + this.calculate(this.display);
        } catch (error: any) {
          this.result = 'Error: ' + (error.message || 'Invalid expression');
        }
      } else {
        return;
      }
    } else if (buttonValue === 'AC') {
      this.display = '';
      this.result = '';
    } else if (buttonValue === 'DEL') {
      this.deleteLastCharacter();
    } else if (buttonValue === 'CE') {
      const tokens = this.display.match(/([+\-×÷])|(\d*\.\d+|\d+)/g);
      if (!tokens) return;
      const last = tokens[tokens.length - 1];

      if (last && /^[\d.]+$/.test(last)) {
        const prev = tokens[tokens.length - 2];
        const prevPrev = tokens[tokens.length - 3];

        if (tokens.length === 2 && (prev === '-')) {
          tokens.splice(-2, 2);
        }
        if ((prev === '-') && (prevPrev === '+' || prevPrev === '×' || prevPrev === '÷')) {
          tokens.splice(-2, 2);
        } else {
          tokens.pop();
        }
      this.display = tokens.join('');

      } else if (/^[+\-×÷]$/.test(last)) {
        tokens.pop();
        this.display = tokens.join('');
      } 
      this.result = '';
    } else {
      try {
      this.handleInput(buttonValue);
    } catch (error: any) {
      this.result = 'Error: ' + (error.message || 'Invalid input');
      }
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
          throw new Error('小数点は最大8桁まで');
        }
      } else if (lastSegment.length >= this.maxDigits) {
        throw new Error('最大10億の桁まで');
      }

      this.display += char;
    }

    this.display = this.display.replace(/\*/g, '×').replace(/\//g, '÷');
  }

  calculate(expression: string): string {
    try {
      const result = this.evaluateExpression(expression);
      return this.formatResult(result);
    } catch (e: any) {
      if (e.message === 'Result exceeds 10 billion') {
        throw new Error('±100億未満までしか表示不可');
      } else if (e.message === 'Cannot divide by zero') {
        throw new Error('0では割れない');
      } else {
        throw new Error('Invalid expression');
      }
    }
  }

  evaluateExpression(expression: string): number {
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

    if (this.hasZeroDivision(expression)) {
      throw new Error('Cannot divide by zero');
  }

    expression = expression.replace(/(?<=\d)-/g, ' -');

    return eval(expression);
  }

  hasZeroDivision(expression: string): boolean {
    const safeExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    const divisions = safeExpression.split('/').slice(1);
  
    for (let part of divisions) {
      const match = part.trim().match(/^([-+]?[\d.]+)/);
      if (match) {
        const value = parseFloat(match[1]);
        if (value === 0) {
          return true;
        }
      }
    }
    return false;
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
