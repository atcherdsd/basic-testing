// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 5, action: Action.Add });
    expect(result).toBe(7);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 5, action: Action.Subtract });
    expect(result).toBe(-3);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 2, b: 5, action: Action.Multiply });
    expect(result).toBe(10);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 20, b: 5, action: Action.Divide });
    expect(result).toBe(4);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 5,
      b: 2,
      action: Action.Exponentiate,
    });
    expect(result).toBe(25);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 2, b: 5, action: 'x' });
    expect(result).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({ a: '2', b: 5, action: Action.Add });
    expect(result).toBe(null);
  });
});
