var assert = require('assert'),
    CSV = require('../dist/csv.js');

describe("Configurations", function() {
    var csv = new CSV();

    it("#01 (Set up custom configuration)", function() {
        var separator = "\;",
            escape = "\\";
        csv.config({separator: separator, escape: escape});
        assert.equal(csv.separator, separator);
        assert.equal(csv.escape, escape);
    });

    it("#02 (Reset configuration)", function() {
        csv.config(CSV.defaults());
        assert.equal(csv.escape, CSV.defaults().escape);
    });

    it("#03 (Get current configuration)", function() {
        var config = csv.config(CSV.defaults());
        assert.equal(config.escape, CSV.defaults().escape);
    });
});
