var assert = require('assert'),
    test = require('./lib/test.js'),
    CSV = require('../dist/csv.js');

describe("Convert to json", function() {
    var csv = new CSV();
    test.multiple([
        {
            comment: "Empty",
            input: function() {
                var csv = new CSV({header: true}),
                    data = csv.parse("");
                return csv.json(data);
            },
            expected: "[]"
        },
        {
            comment: "Single line, no headers",
            input: csv.json("Lorem,ipsum,dolor\n\nsit,amen,"),
            expected: "[[\"Lorem\",\"ipsum\",\"dolor\"],[\"sit\",\"amen\",\"\"]]"
        },
        {
            comment: "Multiple lines, has headers",
            input: function() {
                var csv = new CSV({header: true});
                return csv.json("id,color,hex\n1,red,#0FF\n2,green,#F0F\n3,blue,#FF0");
            },
            expected: "[{\"id\":\"1\",\"color\":\"red\",\"hex\":\"#0FF\"},{\"id\":\"2\",\"color\":\"green\",\"hex\":\"#F0F\"},{\"id\":\"3\",\"color\":\"blue\",\"hex\":\"#FF0\"}]"
        },
        {
            comment: "Array, has headers",
            input: function() {
                var csv = new CSV({header: true}),
                    data = csv.parse("id,color,hex\n1,red,#0FF\n2,green,#F0F\n3,blue,#FF0");
                return csv.json(data);
            },
            expected: "[{\"id\":\"1\",\"color\":\"red\",\"hex\":\"#0FF\"},{\"id\":\"2\",\"color\":\"green\",\"hex\":\"#F0F\"},{\"id\":\"3\",\"color\":\"blue\",\"hex\":\"#FF0\"}]"
        }
    ]);
});
