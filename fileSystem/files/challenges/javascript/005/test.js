const intToRoman = require('./app');

test('3 is III', () => {
  expect(intToRoman(3)).toBe('III')
})

test('58 is LVIII', () => {
  expect(intToRoman(58)).toBe('LVIII')
})

test('1994 is MCMXCIV', () => {
  expect(intToRoman(1994)).toBe('MCMXCIV')
})
