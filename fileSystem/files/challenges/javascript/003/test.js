const sum = require('./app');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
test('adds 2 + 2 to equal 4', () => {
  expect(sum(2, 2)).toBe(4);
});
test('adds 1 + -2 to equal -1', () => {
  expect(sum(1, -2)).toBe(-1);
});