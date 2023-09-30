
    export const files: any = 
        {"javascript":{"directory":{"001":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\n"}},"challenge.txt":{"file":{"contents":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim porro atque temporibus quasi mollitia laborum eaque, quo exercitationem, ut itaque rerum optio fuga illum, labore consequatur totam facere magnam consequuntur."}},"data.json":{"file":{"contents":"{\n    \"name\": \"sum\"\n}"}}}},"002":{"directory":{"test.js":{"file":{"contents":"// const rot42 = require('./app');\n\ntest('Ciphers the whole alphabet to ROT42, equalling \"NOPQRSTUVWXYZABCDEFGHIJKLM\"', () => {\n  expect(rot42('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('QRSTUVWXYZABCDEFGHIJKLMNOP')\n})\n\ntest('Ciphers \"ABCXYZ\" to ROT13, equalling \"NOPKLM\"', () => {\n  expect(rot42('ABCXYZ')).toBe('QRSNOP')\n})\n\ntest('Ciphers \"Lorem Ipsum Dolor Sit Amet\" to \"Yberz Vcfhz Qbybe Fvg Nzrg\" on ROT42', () => {\n  expect(rot42('Lorem Ipsum Dolor Sit Amet')).toBe('Behuc Yfikc Tebeh Iyj Qcuj')\n})\n"}},"challenge.txt":{"file":{"contents":"**ROT42**\n\nROT42 (\"rotate by 42 places\") is a simple letter substitution cipher that replaces a letter with the 42th letter after it in the latin alphabet. ROT42 is a special case of the Caesar cipher which was developed in ancient Rome.\n\nFunction prototype:\n```javascript\nfunction rot42(str) { }\n```"}},"data.json":{"file":{"contents":"{\n    \"name\": \"ROT42\"\n}"}}}},"003":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\ntest('adds 1 + -2 to equal -1', () => {\n  expect(sum(1, -2)).toBe(-1);\n});"}},"challenge.txt":{"file":{"contents":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim porro atque temporibus quasi mollitia laborum eaque, quo exercitationem, ut itaque rerum optio fuga illum, labore consequatur totam facere magnam consequuntur."}},"data.json":{"file":{"contents":""}}}},"004":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\ntest('adds 1 + -2 to equal -1', () => {\n  expect(sum(1, -2)).toBe(-1);\n});\ntest('adds 0 + 1 to equal 1', () => {\n  expect(sum(0, 1)).toBe(1);\n});"}},"challenge.txt":{"file":{"contents":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim porro atque temporibus quasi mollitia laborum eaque, quo exercitationem, ut itaque rerum optio fuga illum, labore consequatur totam facere magnam consequuntur."}},"data.json":{"file":{"contents":""}}}}}},"python":{"directory":{"001":{"directory":{"test.py":{"file":{"contents":"import unittest\nfrom app import sum\n\ndef test_sum():\n    assertEqual(Maths(1, 2).sum(), 3)\n    assertEqual(Maths(1, -1).sum(), 0)\n    assertEqual(Maths(0, 0).sum(), 0)\n    assertEqual(Maths(0, 1).sum(), 1)\n    assertEqual(Maths(0, -1).sum(), -1)\n    assertEqual(Maths(-1, 0).sum(), -1)\n    assertEqual(Maths(-1, 10).sum(), 9)"}},"challenge.txt":{"file":{"contents":""}},"data.json":{"file":{"contents":""}}}}}},"package.json":{"file":{"contents":"{\n    \"name\": \"example-app\",\n    \"type\": \"module\",\n    \"dependencies\": {\n        \"express\": \"latest\",\n        \"nodemon\": \"latest\",\n        \"jest\": \"latest\",\n        \"@jest/globals\": \"latest\",\n        \"python-shell\": \"latest\"\n    },\n    \"scripts\": {\n        \"start\": \"nodemon --watch './' index.js\",\n        \"jest\": \"jest\"\n    }\n}"}}}
    ;
        