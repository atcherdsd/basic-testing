// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 2, b: 5, action: Action.Add, expected: 7 },
  { a: 2, b: 5, action: Action.Subtract, expected: -3 },
  { a: 2, b: 5, action: Action.Multiply, expected: 10 },
  { a: 20, b: 5, action: Action.Divide, expected: 4 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 2, b: 5, action: 'x', expected: null },
  { a: '2', b: 5, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  it.each(testCases)(
    'pattern1: simpleCalculator(%s) = %s',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
