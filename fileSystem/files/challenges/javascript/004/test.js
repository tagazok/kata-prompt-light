const pal = require('./app');

test('madam is a palindrome"', () => {
  expect(pal('madam')).toBe(true)
})

test('12/21/33 12:21 is a palindrome"', () => {
  expect(pal('12/21/33 12:21')).toBe(true)
})

test('coucou is not a palindrome"', () => {
  expect(pal('coucou')).toBe(false)
})

