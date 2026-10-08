/* node tests/run.js — the same self-check without a browser.
   A stub DOM is enough: the money and the lifecycle never touch layout. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const noop = () => {};
const fakeEl = () => ({
  style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  setAttribute: noop, getAttribute: () => null, appendChild: noop, remove: noop,
  querySelector: () => null, querySelectorAll: () => [], addEventListener: noop,
  closest: () => null, textContent: '', innerHTML: '', hidden: false
});

const sandbox = {
  console,
  Intl,
  Math,
  Date,
  JSON,
  Promise,
  Set,
  Map,
  Array,
  Object,
  Number,
  String,
  Error,
  TypeError,
  setTimeout,
  clearTimeout,
  setInterval: () => 0,
  clearInterval: noop
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.document = {
  addEventListener: noop,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: fakeEl,
  createDocumentFragment: () => ({ firstElementChild: null }),
  head: { appendChild: noop },
  body: { setAttribute: noop, appendChild: noop },
  dispatchEvent: noop
};
sandbox.CustomEvent = function CustomEvent(type, init) { this.type = type; this.detail = (init || {}).detail; };
sandbox.AudioContext = function AudioContext() { this.currentTime = 0; this.state = 'running'; this.destination = {}; };
sandbox.AudioContext.prototype.createOscillator = () => ({
  frequency: { setValueAtTime: noop }, connect: () => ({ connect: noop }), start: noop, stop: noop
});
sandbox.AudioContext.prototype.createGain = () => ({
  gain: { setValueAtTime: noop, exponentialRampToValueAtTime: noop },
  connect: () => ({})
});
/* Deliberately absent: localStorage. store.js must survive that. */
vm.createContext(sandbox);

const root = path.resolve(__dirname, '..');
['src/dom.js', 'src/store.js', 'src/data.js', 'src/products.js', 'src/bills.js',
 'src/orders.js', 'src/connector.js', 'src/printer.js', 'src/notifications.js',
 'tests/checks.js'].forEach((rel) => {
  vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), sandbox, { filename: rel });
});

const results = sandbox.SV.selfCheck.run();
let failed = 0;
results.forEach((r) => {
  if (!r.pass) failed += 1;
  process.stdout.write((r.pass ? '  ok   ' : '  FAIL ') + r.name + (r.pass ? '' : '  — ' + r.detail) + '\n');
});
process.stdout.write('\n' + (results.length - failed) + '/' + results.length + ' checks passed\n');
process.exit(failed ? 1 : 0);