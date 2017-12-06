var assert = require('assert'),
    test = require('./lib/test.js'),
    CSV = require('../dist/csv.js');

describe("Enclosure character is the same as escape", function() {
    var csv = new CSV();
    test.multiple([
        {
            comment: "Simple string without duplicate enclosures",
            input: csv.parse("\"Lorem\",\"ipsum\",dolor"),
            expected: [["Lorem", "ipsum", "dolor"]],
            deep: true
        },
        {
            comment: "Multiline column",
            input: csv.parse("\"Lorem\",\"ip\rsum\",dolor"),
            expected: [["Lorem", "ip\r\nsum", "dolor"]],
            deep: true
        },
        {
            comment: "Unclosed multiline column",
            input: csv.parse("\"Lorem\",\"ip\rsum, dolor"),
            expected: [["Lorem", "ip\r\nsum, dolor"]],
            deep: true
        },
        {
            comment: "Closed column with escaped enclosure inside",
            input: csv.parse("Lorem,\"\"\"ipsum\",dolor"),
            expected: [["Lorem", "\"ipsum", "dolor"]],
            deep: true
        },
        {
            comment: "Column with mixed content",
            input: csv.parse("Lorem,\"Sit amen \"ipsum,dolor"),
            expected: [["Lorem", "Sit amen ipsum", "dolor"]],
            deep: true
        },
        {
            comment: "Column with mixed content and unescaped closures",
            input: csv.parse("Lorem,\"Sit amen \"ipsum\"\",dolor"),
            expected: [["Lorem", "Sit amen ipsum\"\"", "dolor"]],
            deep: true
        },
        {
            comment: "Column with mixed content and empty closed part",
            input: csv.parse("Lorem,\"\"ipsum,\"\"dolor\"\""),
            expected: [["Lorem", "ipsum", "dolor\"\""]],
            deep: true
        },
        {
            comment: "Column with mixed content and repeated enclosures in closed part",
            input: csv.parse("Lorem,\"\"\"\"\"\"ipsum,\"\"\"dolor\"\""),
            expected: [["Lorem", "\"\"ipsum", "\"dolor\""]],
            deep: true
        }
    ]);
});
