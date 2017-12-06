var assert = require('assert'),
    test = require('./lib/test.js'),
    CSV = require('../dist/csv.js');

describe("Custom linebreak", function() {
    var csv = new CSV();
    test.multiple([
        {
            comment: "Remove last empty line",
            input: csv.parse("Lorem,ipsum,dolor\n"),
            expected: [["Lorem", "ipsum", "dolor"]],
            deep: true
        },
        {
            comment: "Remove empty lines",
            input: function() {
                var csv = new CSV(),
                    data = csv.parse("Lorem,ipsum,dolor\n\nsit,amen,");
                return data;
            },
            expected: [["Lorem", "ipsum", "dolor"], ["sit", "amen", ""]],
            deep: true
        },
        {
            comment: "Keep empty lines",
            input: function() {
                var csv = new CSV({empty: true}),
                    data = csv.parse("Lorem,ipsum,dolor\n\n\r\n");
                return data;
            },
            expected: [["Lorem", "ipsum", "dolor"],[""],[""]],
            deep: true
        },
        {
            comment: "Custom linebreak character",
            input: function() {
                var csv = new CSV({linebreak: "+"}),
                    data = csv.parse("Lorem,ipsum,dolor++sit,amen,+++");
                return data;
            },
            expected: [["Lorem", "ipsum", "dolor"], ["sit", "amen", ""]],
            deep: true
        }
    ]);


});
