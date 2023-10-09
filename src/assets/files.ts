
    export const files: any = 
        {"javascript":{"directory":{"001":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\ntest('adds 1 + -2 to equal -1', () => {\n  expect(sum(1, -2)).toBe(-1);\n});\ntest('adds 0 + 1 to equal 1', () => {\n  expect(sum(0, 1)).toBe(1);\n});"}},"challenge.txt":{"file":{"contents":"**SUM**\n\nExample of function call:\n```javascript\nsum(4, 2);\n// => 6\n```"}},"data.json":{"file":{"contents":"{\n    \"name\": \"Sum\",\n    \"function\": {\n        \"name\": \"sum\"\n    },\n    \"completionPoints\": 20,\n    \"tests\": {\n        \"adds 1 + 2 to equal 3\": 10,\n        \"adds 2 + 2 to equal 4\": 10,\n        \"adds 1 + -2 to equal -1\": 10,\n        \"adds 0 + 1 to equal 1\": 10\n    }\n}"}}}},"002":{"directory":{"test.js":{"file":{"contents":"const divide = require('./app');\n\ntest('divide 4 / 4 to equal 1', () => {\n  expect(divide(4, 4)).toBe(1);\n});\ntest('divide 6 / 2 to equal 3', () => {\n  expect(divide(6, 2)).toBe(3);\n});\ntest('divide 3 / -1 to equal -3', () => {\n  expect(divide(3, -1)).toBe(-3);\n});\ntest('divide 42 / 0 to equal Infinity', () => {\n  expect(divide(42, 0)).toBe(Infinity);\n});"}},"challenge.txt":{"file":{"contents":"**Division**\n\nA function that divide 2 numbers\n\nExample of function call:\n```javascript\ndivide(4, 2);\n// => 2\n```"}},"data.json":{"file":{"contents":"{\n    \"name\": \"Division\",\n    \"function\": {\n        \"name\": \"divide\"\n    }\n}"}}}},"003":{"directory":{"test.js":{"file":{"contents":"const rot42 = require('./app');\n\ntest('Ciphers the whole alphabet to ROT42, equalling \"NOPQRSTUVWXYZABCDEFGHIJKLM\"', () => {\n  expect(rot42('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('QRSTUVWXYZABCDEFGHIJKLMNOP')\n})\n\ntest('Ciphers \"ABCXYZ\" to ROT13, equalling \"NOPKLM\"', () => {\n  expect(rot42('ABCXYZ')).toBe('QRSNOP')\n})\n\ntest('Ciphers \"Lorem Ipsum Dolor Sit Amet\" to \"Yberz Vcfhz Qbybe Fvg Nzrg\" on ROT42', () => {\n  expect(rot42('Lorem Ipsum Dolor Sit Amet')).toBe('Behuc Yfikc Tebeh Iyj Qcuj')\n})\n"}},"challenge.txt":{"file":{"contents":"**ROT42**\n\nROT42 (\"rotate by 42 places\") is a simple letter substitution cipher that replaces a letter with the 42th letter after it in the latin alphabet. ROT42 is a special case of the Caesar cipher which was developed in ancient Rome.\n\nExample of function call:\n```javascript\nrot42(\"HELLO\");\n// => XUBBE\n```\n\nSource: <a href=\"https://en.wikipedia.org/wiki/Caesar_cipher\" target=\"_blank\">Caesar Cypher wikipedia</a>"}},"data.json":{"file":{"contents":"{\n    \"name\": \"ROT42\",\n    \"function\": {\n        \"name\": \"rot42\"\n    }\n}"}}}},"004":{"directory":{"test.js":{"file":{"contents":"const pal = require('./app');\n\ntest('madam is a palindrome', () => {\n  expect(pal('madam')).toBe(true)\n})\n\ntest('12/21/33 12:21 is a palindrome', () => {\n  expect(pal('12/21/33 12:21')).toBe(true)\n})\n\ntest('coucou is not a palindrome', () => {\n  expect(pal('coucou')).toBe(false)\n})\n\n"}},"challenge.txt":{"file":{"contents":"**PALINDROME**\n\nA **palindrome** is a word, number, phrase, or other sequence of symbols that reads the same backwards as forwards, such as *madam* or *racecar*, the date and time *12/21/33 12:21*.\n\nExample of function call:\n```javascript\npal(\"madam\");\n// => true\n```\n\nSource: <a href=\"https://en.wikipedia.org/wiki/Palindrome\" target=\"_blank\">wikipedia</a>"}},"data.json":{"file":{"contents":"{\n    \"name\": \"Palindrome\",\n    \"function\": {\n        \"name\": \"pal\"\n    },\n    \"completionPoints\": 60, \n    \"tests\": {\n        \"madam is a palindrome\": 20,\n        \"coucou is not a palindrome\": 20,\n        \"12/21/33 12:21 is a palindrome\": 40 \n    }\n}"}}}},"XXX":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\ntest('adds 1 + -2 to equal -1', () => {\n  expect(sum(1, -2)).toBe(4);\n});\ntest('adds 0 + 1 to equal 1', () => {\n  expect(sum(0, 1)).toBe(1);\n});"}},"challenge.txt":{"file":{"contents":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim porro atque temporibus quasi mollitia laborum eaque, quo exercitationem, ut itaque rerum optio fuga illum, labore consequatur totam facere magnam consequuntur."}},"data.json":{"file":{"contents":"{\n    \"name\": \"Test\",\n    \"function\": {\n        \"name\": \"sum\"\n    }\n}"}}}}}},"python":{"directory":{"001":{"directory":{"test.py":{"file":{"contents":"import unittest\nfrom app import sum\n\ndef test_sum():\n    assertEqual(Maths(1, 2).sum(), 3)\n    assertEqual(Maths(1, -1).sum(), 0)\n    assertEqual(Maths(0, 0).sum(), 0)\n    assertEqual(Maths(0, 1).sum(), 1)\n    assertEqual(Maths(0, -1).sum(), -1)\n    assertEqual(Maths(-1, 0).sum(), -1)\n    assertEqual(Maths(-1, 10).sum(), 9)"}},"challenge.txt":{"file":{"contents":""}},"data.json":{"file":{"contents":"{}"}}}}}},"package.json":{"file":{"contents":"{\n    \"name\": \"example-app\",\n    \"type\": \"module\",\n    \"dependencies\": {\n        \"express\": \"latest\",\n        \"nodemon\": \"latest\",\n        \"jest\": \"latest\",\n        \"@jest/globals\": \"latest\",\n        \"python-shell\": \"latest\"\n    },\n    \"scripts\": {\n        \"start\": \"nodemon --watch './' index.js\",\n        \"jest\": \"jest\"\n    }\n}"}}}
    ;
        