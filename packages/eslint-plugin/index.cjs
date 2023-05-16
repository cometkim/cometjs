const auto = require('./configs/auto.cjs');
const base = require('./configs/base.cjs');
const test = require('./configs/test.cjs');
const flow = require('./configs/flow.cjs');
const typescript = require('./configs/typescript.cjs');
const react = require('./configs/react.cjs');

module.exports = {
  configs: {
    auto,
    base,
    test,
    flow,
    typescript,
    react,
  },
};
