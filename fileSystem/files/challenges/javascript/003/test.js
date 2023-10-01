const rot42 = require('./app');

test('Ciphers the whole alphabet to ROT42, equalling "NOPQRSTUVWXYZABCDEFGHIJKLM"', () => {
  expect(rot42('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('QRSTUVWXYZABCDEFGHIJKLMNOP')
})

test('Ciphers "ABCXYZ" to ROT13, equalling "NOPKLM"', () => {
  expect(rot42('ABCXYZ')).toBe('QRSNOP')
})

test('Ciphers "Lorem Ipsum Dolor Sit Amet" to "Yberz Vcfhz Qbybe Fvg Nzrg" on ROT42', () => {
  expect(rot42('Lorem Ipsum Dolor Sit Amet')).toBe('Behuc Yfikc Tebeh Iyj Qcuj')
})
