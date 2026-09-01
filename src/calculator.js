#!/usr/bin/env node
'use strict';

/**
 * Simple CLI calculator for the supported arithmetic operations:
 * - addition (+)
 * - subtraction (-)
 * - multiplication (×)
 * - division (÷)
 * - modulo (%)
 * - exponentiation (^ or power)
 * - square root (sqrt)
 *
 * Usage examples:
 *   node src/calculator.js 10 + 5
 *   node src/calculator.js add 10 5
 *   node src/calculator.js 12 3 /
 *   node src/calculator.js 10 % 3
 *   node src/calculator.js power 2 3
 *   node src/calculator.js sqrt 9
 */

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }

  return a / b;
}

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Modulo by zero is not allowed.');
  }

  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Square root of a negative number is not allowed.');
  }

  return Math.sqrt(n);
}

function normalizeOperator(value) {
  if (!value) {
    return null;
  }

  const op = String(value).trim().toLowerCase();

  if (['add', 'addition', '+'].includes(op)) {
    return 'add';
  }

  if (['subtract', 'subtraction', '-'].includes(op)) {
    return 'subtract';
  }

  if (['multiply', 'multiplication', '*', 'x'].includes(op)) {
    return 'multiply';
  }

  if (['divide', 'division', '/', '÷'].includes(op)) {
    return 'divide';
  }

  if (['mod', 'modulo', '%'].includes(op)) {
    return 'modulo';
  }

  if (['power', '^', '**', 'exponent', 'exponentiation'].includes(op)) {
    return 'power';
  }

  if (['sqrt', 'square-root', 'squareroot', 'root'].includes(op)) {
    return 'sqrt';
  }

  return null;
}

function parseNumber(value) {
  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number: ${value}`);
  }

  return parsed;
}

function parseArgs(argv) {
  const args = argv.slice();

  if (args.length === 2) {
    const [operationValue, numberValue] = args;
    const operation = normalizeOperator(operationValue);

    if (operation === 'sqrt') {
      return {
        operation,
        left: parseNumber(numberValue),
        right: null,
      };
    }
  }

  if (args.length === 3) {
    const [firstValue, secondValue, thirdValue] = args;
    const firstOp = normalizeOperator(firstValue);
    const secondOp = normalizeOperator(secondValue);
    const thirdOp = normalizeOperator(thirdValue);

    if (firstOp && secondValue && thirdValue) {
      return {
        operation: firstOp,
        left: parseNumber(secondValue),
        right: parseNumber(thirdValue),
      };
    }

    if (secondOp) {
      return {
        operation: secondOp,
        left: parseNumber(firstValue),
        right: parseNumber(thirdValue),
      };
    }

    if (thirdOp) {
      return {
        operation: thirdOp,
        left: parseNumber(firstValue),
        right: parseNumber(secondValue),
      };
    }
  }

  const optionMap = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];

    if (!key || typeof value === 'undefined') {
      continue;
    }

    optionMap[key] = value;
  }

  const operation = normalizeOperator(optionMap['--operation'] || optionMap['-o'] || optionMap['operation']);
  const left = optionMap['--left'] || optionMap['-a'] || optionMap['left'];
  const right = optionMap['--right'] || optionMap['-b'] || optionMap['right'];

  if (operation === 'sqrt' && typeof left !== 'undefined') {
    return {
      operation,
      left: parseNumber(left),
      right: null,
    };
  }

  if (operation && typeof left !== 'undefined' && typeof right !== 'undefined') {
    return {
      operation,
      left: parseNumber(left),
      right: parseNumber(right),
    };
  }

  throw new Error('Usage: node src/calculator.js <number> <operator> <number>');
}

function calculate(operation, left, right) {
  switch (operation) {
    case 'add':
      return add(left, right);
    case 'subtract':
      return subtract(left, right);
    case 'multiply':
      return multiply(left, right);
    case 'divide':
      return divide(left, right);
    case 'modulo':
      return modulo(left, right);
    case 'power':
      return power(left, right);
    case 'sqrt':
      return squareRoot(left);
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

function formatResult(value) {
  return Number.isInteger(value) ? String(value) : Number(value.toFixed(10)).toString();
}

function main() {
  try {
    const { operation, left, right } = parseArgs(process.argv.slice(2));
    const result = calculate(operation, left, right);
    console.log(`Result: ${formatResult(result)}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Supported operations: addition (+), subtraction (-), multiplication (×), division (÷), modulo (%), exponentiation (^), square root (sqrt)');
    console.error('Examples:');
    console.error('  node src/calculator.js 10 + 5');
    console.error('  node src/calculator.js add 10 5');
    console.error('  node src/calculator.js --operation divide --left 20 --right 4');
    console.error('  node src/calculator.js 10 % 3');
    console.error('  node src/calculator.js power 2 3');
    console.error('  node src/calculator.js sqrt 9');
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
  calculate,
  parseArgs,
  formatResult,
};
