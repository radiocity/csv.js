var assert = require('assert'),
    fs = require('fs'),
    CSV = require('../dist/csv.js');

describe("Stress test", function() {
    var csv = new CSV(),
        input = fs.readFileSync('./tests/demo.csv', 'utf8'),
        expected = require('./demo.csv.js');

    it("#01 (Check demo data)", function() {
        var parsed = csv.parse(input);
        assert.deepEqual(parsed, expected);
    });

    var start = Date.now();
    for (var j = 0; j < 10000; j++) {
        csv.parse(input);
    }
    it("#02 Time spend to parse: ~" + (Date.now() - start) +"ms", function() {
        return true;
    });
});
