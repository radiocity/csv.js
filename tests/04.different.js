var assert = require('assert'),
    test = require('./lib/test.js'),
    CSV = require('../dist/csv.js');

describe("Enclosure character is different from escape", function() {
    var csv = new CSV({escape: "\\", enclosure: "\'", separator: "\,"});
    test.multiple([
        {
            comment: "Simple string without duplicate enclosures",
            input: csv.parse("'Lorem','ipsum',dolor"),
            expected: [["Lorem", "ipsum", "dolor"]],
            deep: true
        },
        {
            comment: "Multiline column",
            input: csv.parse("'Lorem','ip\rsum',dolor"),
            expected: [["Lorem", "ip\r\nsum", "dolor"]],
            deep: true
        },
        {
            comment: "Unclosed multiline column",
            input: csv.parse("'Lorem','ip\rsum, dolor"),
            expected: [["Lorem", "ip\r\nsum, dolor"]],
            deep: true
        },
        {
            comment: "Escape enclosure",
            input: csv.parse("'\\'', Lorem"),
            expected: [["\\'", " Lorem"]],
            deep: true
        },
        {
            comment: "Escape enclosure near duplicated enclosures",
            input: csv.parse("'\\'''', Lorem"),
            expected: [["\\''", " Lorem"]],
            deep: true
        }
    ]);
});
