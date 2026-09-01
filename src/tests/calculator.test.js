'use strict';

const { add, subtract, multiply, divide, calculate, parseArgs, formatResult } = require('../calculator');

describe('calculator arithmetic functions', () => {
  test('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-2, 5)).toBe(3);
  });

  test('subtracts the second number from the first', () => {
    expect(subtract(10, 4)).toBe(6);
    expect(subtract(3, 9)).toBe(-6);
  });

  test('multiplies two numbers', () => {
    expect(multiply(45, 2)).toBe(90);
    expect(multiply(-4, 3)).toBe(-12);
  });

  test('divides the first number by the second', () => {
    expect(divide(20, 5)).toBe(4);
    expect(divide(9, 3)).toBe(3);
    expect(divide(7, 2)).toBe(3.5);
  });

  test('throws when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero is not allowed.');
  });

  test('calculates by operation name', () => {
    expect(calculate('add', 2, 3)).toBe(5);
    expect(calculate('subtract', 10, 4)).toBe(6);
    expect(calculate('multiply', 45, 2)).toBe(90);
    expect(calculate('divide', 20, 5)).toBe(4);
  });

  test('formats integer and fractional results', () => {
    expect(formatResult(15)).toBe('15');
    expect(formatResult(3.5)).toBe('3.5');
    expect(formatResult(1 / 3)).toBe('0.3333333333');
  });
});

describe('calculator CLI argument parsing', () => {
  test('parses positional arithmetic expressions', () => {
    expect(parseArgs(['2', '+', '3'])).toEqual({ operation: 'add', left: 2, right: 3 });
    expect(parseArgs(['10', '-', '4'])).toEqual({ operation: 'subtract', left: 10, right: 4 });
    expect(parseArgs(['45', '*', '2'])).toEqual({ operation: 'multiply', left: 45, right: 2 });
    expect(parseArgs(['20', '/', '5'])).toEqual({ operation: 'divide', left: 20, right: 5 });
  });

  test('parses named option arguments', () => {
    expect(parseArgs(['--operation', 'add', '--left', '2', '--right', '3'])).toEqual({ operation: 'add', left: 2, right: 3 });
    expect(parseArgs(['-o', 'subtract', '-a', '10', '-b', '4'])).toEqual({ operation: 'subtract', left: 10, right: 4 });
  });

  test('throws for invalid or incomplete inputs', () => {
    expect(() => parseArgs(['2', 'plus', '3'])).toThrow('Usage: node src/calculator.js <number> <operator> <number>');
    expect(() => parseArgs(['2', '+'])).toThrow('Usage: node src/calculator.js <number> <operator> <number>');
    expect(() => parseArgs(['abc', '+', '3'])).toThrow('Invalid number: abc');
  });
});
