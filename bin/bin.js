#!/usr/bin/env node
var DummyData = require('../src/DummyData.js');

// process.stdout.write(process.argv);

try {
  var output = DummyData.degenerate(process.argv[2]);
  process.stdout.write(JSON.stringify(output));
} catch(e) {
  process.stdout.write("Invalid arguments or unresolvable path.\n");
}
