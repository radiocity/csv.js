var assert = require('assert'),
    test = require('./lib/test.js'),
    CSV = require('../dist/csv.js');

describe("Basic (without any enclosures)", function() {
    var csv = new CSV();
    test.multiple([
        {
            comment: "String contains separators",
            input: csv.parse("Lorem,ipsum,dolor"),
            expected: [["Lorem", "ipsum", "dolor"]],
            deep: true
        },
        {
            comment: "String contains multiple line",
            input: csv.parse("Lorem,ipsum,dolor\n ,sit,amen"),
            expected: [
                ["Lorem", "ipsum", "dolor"],
                [" ", "sit", "amen"]
            ],
            deep: true
        }
    ]);
});
