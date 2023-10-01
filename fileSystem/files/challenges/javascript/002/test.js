const divide = require('./app');

test('divide 4 / 4 to equal 1', () => {
  expect(divide(4, 4)).toBe(1);
});
test('divide 6 / 2 to equal 3', () => {
  expect(divide(6, 2)).toBe(3);
});
test('divide 3 / -1 to equal -3', () => {
  expect(divide(3, -1)).toBe(-3);
});
test('divide 42 / 0 to equal Infinity', () => {
  expect(divide(42, 0)).toBe(Infinity);
});