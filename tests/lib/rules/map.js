/**
 * @fileoverview Suggest replace _.map to native Array.map
 * @author Ilya Chudin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/map");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

const errors = [
  {
    messageId: "useNativeMap",
    type: "CallExpression"
  }
];

ruleTester.run("map", rule, {
  valid: [
    "const mapped = Array.isArray(a) ? a.map(fn) : _.map(a, fn);",
    "const mapped = Array.isArray(a) ? undefined : _.map(a, fn);",
    "function map(a, fn) { return Array.isArray(a) ? a.map(fn) : _.map(a,fn); }",
    `let result;
     if (Array.isArray(a)){
       result = a.map(fn);
     } else {
       result = _.map(a,fn);
     }`,
    `function map(a, fn) {
       if (Array.isArray(a)){
         return a.map(fn);
       } else {
         return _.map(a,fn);
       }
    }`
  ],

  invalid: [
    {
      code: "const mapped = _.map(a, fn);",
      output: "const mapped = Array.isArray(a) ? a.map(fn) : _.map(a, fn);",
      errors
    },
    {
      code: "const map = (a, fn) => _.map(a, fn);",
      output: "const map = (a, fn) => Array.isArray(a) ? a.map(fn) : _.map(a, fn);",
      errors
    },
    {
      code: "function map (a, fn) { return _.map(a, fn); }",
      output: "function map (a, fn) { return Array.isArray(a) ? a.map(fn) : _.map(a, fn); }",
      errors
    },
    {
      code: "const mapped = undefined || _.map(a, fn);",
      output: "const mapped = undefined || (Array.isArray(a) ? a.map(fn) : _.map(a, fn));",
      errors
    },
    {
      code: "const reduced = _.map(a, fn).reduce(fnn);",
      output: "const reduced = (Array.isArray(a) ? a.map(fn) : _.map(a, fn)).reduce(fnn);",
      errors
    }
  ]
});
