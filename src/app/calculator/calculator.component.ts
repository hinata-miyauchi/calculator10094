import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  display: string = '';
  result: string = '';
  maxDigits: number = 10;  // 整数部最大10桁
  maxDecimalDigits: number = 8;  // 小数部最大8桁

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
    // 最初に「0」を入力した場合は、表示に「0」を出力する
    if (this.display === '' && char === '0') {
      this.display = '0'; // 最初の0は表示に加える
      return;
    }

    // 最初に0を入力した後は、小数点以外は入力できない
    if (this.display === '0' && char !== '.') {
      return; // 0の後には小数点以外は入力できない
    }

    // 最初に小数点、×、÷が入力された場合、無視
    if (this.display === '' && (char === '.' || char === '×' || char === '÷')) {
      return; // これらは最初に入力されても無視される
    }

    // 演算子が連続して入力されるのを防ぐ
    if (this.isOperator(char) && this.isOperator(this.display.slice(-1)) && !this.isMinusAfterOperator()) {
      return; // 演算子の連続を防止（ただし、×, ÷の後の-は許可）
    }

    // 演算子後に連続した0を無視する
    if (this.isOperator(this.display.slice(-1)) && char === '0' && this.display.slice(-2) === '0') {
      return; // 演算子後に連続する0を無視
    }

    // 演算子後に小数点が入力されるのを禁止
    if (this.isOperator(this.display.slice(-1)) && char === '.') {
      return; // 演算子直後の小数点を無視
    }

    // 演算子の後に同じ演算子（××や÷÷など）を入力させない
    if ((this.display.endsWith('×') && char === '×') || (this.display.endsWith('÷') && char === '÷')) {
      return; // ×の後に×、÷の後に÷を入力させない
    }

    // 演算子の後に別の演算子（+、-、×、÷）が入力されるのを禁止
    if (this.isOperator(this.display.slice(-1)) && this.isOperator(char)) {
      return; // 演算子直後に演算子（+、-、×、÷）を入力させない
    }

    // × または ÷ の後に負の数を入力できるようにする（ただし一度だけ許可）
    if ((this.display.endsWith('×') || this.display.endsWith('÷')) && char === '-') {
      this.display += char; // ×や÷の後に-を入力可能
      return;
    }

    // すでに「0」が表示されている場合、次に「0」を入力するのを防ぐ
    if (char === '0' && this.display === '0') {
      return; // 二重の「0」入力を無視
    }

    // 小数点が入力された場合の処理
    if (char === '.') {
      const lastSegment = this.display.split(/[\+\-\×\÷]/).pop() || '';
      if (lastSegment.includes('.')) {
        return; // 小数点がすでに含まれている場合、再度小数点を入力しない
      }

      // 小数点を最初に入力する場合、整数部が0でも問題ない
      if (this.display === '') {
        this.display = '0.';  // 「0.」という形式で始める
        return;
      }
    }

    // 演算子の場合はそのまま追加
    if (this.isOperator(char)) {
      this.display += char;
    } else {
      const lastSegment = this.display.split(/[\+\-\×\÷]/).pop() || '';

      // 小数点後の桁数チェック
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

    // 演算子の記号を修正
    this.display = this.display.replace(/\*/g, '×').replace(/\//g, '÷');
  }

  // 演算子の連続入力を許可する条件（× や ÷ の後に - を入力できる場合）
  isMinusAfterOperator(): boolean {
    return this.display.endsWith('×') || this.display.endsWith('÷');
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
    // ここで ÷ や × を対応する演算子に変換
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

    // 負の数を処理するために、`-`が続く場合、適切に処理
    expression = expression.replace(/(?<=\d)-/g, ' -'); // 数字の後に-が続くときにスペースを挿入

    // 文字列式を評価
    return eval(expression);  // 注意: eval を使用
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