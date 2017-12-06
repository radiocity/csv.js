var assert = require('assert');

module.exports =  {
    single: function(input, expected, comment) {
        return it(comment, function() {
            expected = typeof expected == "function" ? expected() : expected;                        
            switch (typeof input) {
                case "function":
                    assert.deepEqual(input(), expected);
                    break;
                case "object":
                    assert.deepEqual(input, expected);
                    break;
                default:
                    assert.equal(input, expected);
            }
        });
    },

    multiple: function(list) {
        var i = 1;
        for (var key in list) {
            if (list.hasOwnProperty(key)) {
                var test = list[key],
                    caption =
                        "#" +
                        (i++).toString().padStart(2, "0") +
                        (" (" + test.comment + ")" || "");
                this.single(
                    test.input,
                    test.expected,
                    caption
                );
            }
        }
    }
};
