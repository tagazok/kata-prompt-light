const addBinary = require('./app');

test('11 + 1 equals 100', () => {
  expect(addBinary("11", "1")).toBe("100")
})

test('1010 + 1011 equals 10101', () => {
  expect(addBinary("1010", "1011")).toBe("10101")
})