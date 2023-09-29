// /** @satisfies {import('@webcontainer/api').FileSystemTree} */

// export const files: any = {
//     'app.js': {
//         file: {
//             contents: `
// function sum(a, b) {
//   return a + b;
// }
// module.exports = sum;
//             `
//         }
//     },
//     'test.js': {
//         file: {
//             contents: `
// const sum = require('./app');

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });
// test('adds 2 + 2 to equal 4', () => {
//   expect(sum(2, 2)).toBe(4);
// });
// test('adds 1 + -2 to equal -1', () => {
//   expect(sum(1, -2)).toBe(-1);
// });
// test('adds 0 + 1 to equal 1', () => {
//   expect(sum(0, 1)).toBe(1);
// });
// `,
//         },
//     },
//     'app.py': {
//       file: {
//         contents: `
// def inc(x):
//   return x + 1
//         `
//       }
//     },
//     'package.json': {
//       file: {
//         contents: `
// {
//             "name": "example-app",
//             "type": "module",
//             "dependencies": {
//                 "express": "latest",
//                 "nodemon": "latest",
//                 "jest": "latest",
//                 "@jest/globals": "latest",
//                 "python-shell": "latest"
//             },
//             "scripts": {
//                 "start": "nodemon --watch './' index.js",
//                 "jest": "jest"
//             }
//         }`
//     }
//     },
// };





export const files: any = 
        {"javascript":{"directory":{"001":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\n"}},"challenge.txt":{"file":{"contents":"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim porro atque temporibus quasi mollitia laborum eaque, quo exercitationem, ut itaque rerum optio fuga illum, labore consequatur totam facere magnam consequuntur."}}}},"002":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\n"}},"challenge.txt":{"file":{"contents":""}}}},"003":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\ntest('adds 1 + -2 to equal -1', () => {\n  expect(sum(1, -2)).toBe(-1);\n});"}},"challenge.txt":{"file":{"contents":""}}}},"004":{"directory":{"test.js":{"file":{"contents":"const sum = require('./app');\n\ntest('adds 1 + 2 to equal 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\ntest('adds 2 + 2 to equal 4', () => {\n  expect(sum(2, 2)).toBe(4);\n});\ntest('adds 1 + -2 to equal -1', () => {\n  expect(sum(1, -2)).toBe(-1);\n});\ntest('adds 0 + 1 to equal 1', () => {\n  expect(sum(0, 1)).toBe(1);\n});"}},"challenge.txt":{"file":{"contents":""}}}}}},"python":{"directory":{"001":{"directory":{"test.py":{"file":{"contents":"import unittest\nfrom app import sum\n\ndef test_sum():\n    assertEqual(Maths(1, 2).sum(), 3)\n    assertEqual(Maths(1, -1).sum(), 0)\n    assertEqual(Maths(0, 0).sum(), 0)\n    assertEqual(Maths(0, 1).sum(), 1)\n    assertEqual(Maths(0, -1).sum(), -1)\n    assertEqual(Maths(-1, 0).sum(), -1)\n    assertEqual(Maths(-1, 10).sum(), 9)"}},"challenge.txt":{"file":{"contents":""}}}}}},"package.json":{"file":{"contents":"{\n    \"name\": \"example-app\",\n    \"type\": \"module\",\n    \"dependencies\": {\n        \"express\": \"latest\",\n        \"nodemon\": \"latest\",\n        \"jest\": \"latest\",\n        \"@jest/globals\": \"latest\",\n        \"python-shell\": \"latest\"\n    },\n    \"scripts\": {\n        \"start\": \"nodemon --watch './' index.js\",\n        \"jest\": \"jest\"\n    }\n}"}}}
    ;

