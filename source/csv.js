(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.CSV = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

    var CSV = function(config) {
        if (!(this instanceof CSV)) {
            throw new TypeError("Couldn`t call a class as a function");
        }
        this.config(config);
    };

    CSV.defaults = function() {
        return {
            separator: ",",
            enclosure: "\"",
            escape: "\"",
            linebreak: "\r\n",
            empty: false,
            header: false
        };
    };

    CSV.error = function(data) {
        throw data;
    };

    CSV.prototype.config = function(config) {
        var defaults = CSV.defaults(),
            current = defaults;
        for (var key in defaults) {
            if (defaults.hasOwnProperty(key)) {
                var value = defaults[key];
                if (config && config.hasOwnProperty(key)) {
                    value = config[key];
                }
                this[key] = current[key] = value || "";
            }
        }
        return current;
    };

    CSV.prototype.trimEnclosures = function(string) {
        var begin = (string[0] === this.enclosure) ? 1 : 0,
            end = (string[string.length - 1] === this.enclosure) ?
                string.length - 2:
                string.length;
        return string.substr(begin, end);
    };

    // TODO: Refactoring
    CSV.prototype.parse = function(csv) {
        var opened = false,
            CL = "\r",
            RF = "\n",
            CLRF = CL+RF,
            line = 0,
            column = 0,
            linebreak = this.linebreak,
            result = new Array(new Array());
        result[line][column] = "";
        if (this.linebreak == CLRF || this.linebreak == CL || this.linebreak == RF) {
            linebreak = RF;
        }
        for (var i = 0; i < csv.length; i++) {
            if (csv[i] == CL && csv[i+1] === RF) {
                continue;
            }
            if (opened) {
                switch (csv[i]) {
                    case CL:
                    case RF:
                        result[line][column] += CLRF;
                        break;
                    case this.escape:
                        if (this.escape !== this.enclosure) {
                            result[line][column] += this.escape; // Dunno why php adds escape character
                            if (csv[i+1] === this.enclosure) {
                                result[line][column] += this.enclosure;
                                ++i;
                            }
                            break;
                        }
                    case this.enclosure:
                        var next = csv[i+1];
                        if (next == this.enclosure) {
                            result[line][column] += this.enclosure;
                            ++i;
                        } else {
                            opened = false;
                        }
                        break;
                    default:
                        result[line][column] += csv[i];
                }
            } else {
                switch (csv[i]) {
                    case CL:
                    case RF:
                        if (linebreak !== RF) {
                            result[line][column] += CLRF;
                            break;
                        }
                    case linebreak:
                        var last = (i == csv.length),
                            skip =
                                !this.empty &&
                                result[line].length == 1 &&
                                result[line][0] == "";
                        if (skip || last) {
                            break;
                        }
                        column = 0;
                        if (!this.empty) {
                            var blank = new RegExp("^[\\s"+ this.separator +"]+$", "g");
                            if (result[line].join(this.separator).match(blank)) {
                                --line;
                            }
                        }
                        result[++line] = new Array("");
                        break;
                    case this.separator:
                        result[line][++column] = "";
                        break;
                    case this.enclosure:
                        if (result[line][column].length == 0) {
                            opened = true;
                            break;
                        }
                    default:
                        result[line][column] += csv[i];
                }
            }
        }
        var blank = new RegExp("^([\\s"+ this.separator +"]+)?$", "g");
        if (result[line].join(this.separator).match(blank)) {
            result.splice(line, 1);
        }
        return result;
    };

    CSV.prototype.json = function(csv) {
        if (typeof csv === "string") {
            csv = this.parse(csv);
        }
        if (this.header) {
            var caption = csv.shift();
            for (var line = 0; line < csv.length; line++) {
                var current = {},
                    key = 0;
                for (var column = 0; column < csv[line].length; column++) {
                    key = caption[column] || column;
                    current[key] = csv[line][column] ||  "";
                }
                csv[line] = current;
            }
        }
        return JSON.stringify(csv);
    }

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return CSV;
}));
