/**
 * EightBitNoise: v12.07.15
 * 8bit Noise Generator
 * v12.07.12: first version
 * v12.07.15: add args ".mul"
 */
"use strict";

var timbre = require("../timbre");
// __BEGIN__

var EightBitNoise = (function() {
    var EightBitNoise = function() {
        initialize.apply(this, arguments);
    }, $this = timbre.fn.buildPrototype(EightBitNoise, {
        base: "ar-kr",
        properties: {
            freq: {
                set: function(value) {
                    this._.freq = timbre(value);
                },
                get: function() { return this._.freq; }
            }
        } // properties
    });
    
    var initialize = function(_args) {
        var _ = this._ = {};
        
        _.x = 0;
        _.y = 1;
        
        var i = 0;
        if (typeof _args[i] !== "undefined") {
            this.freq = _args[i++];
        } else {
            this.freq = 440;
        }
        if (typeof _args[i] === "number") {
            _.mul = _args[i++];
        }
    };
    
    $this.clone = function(deep) {
        var _ = this._;
        var newone = timbre("8bitnoise");
        if (deep) {
            newone._.freq = _.freq.clone(true);
        } else {
            newone._.freq = _.freq;
        }
        return timbre.fn.copyBaseArguments(this, newone, deep);
    };
    
    $this.bang = function() {
        var _ = this._;
        _.x = 0; _.y = 1;
        timbre.fn.doEvent(this, "bang");
        return this;
    };
    
    $this.seq = function(seq_id) {
        var _ = this._;
        
        if (!_.ison) return timbre._.none;
        
        var cell = this.cell;
        if (seq_id !== this.seq_id) {
            this.seq_id = seq_id;
            
            var freq = _.freq.seq(seq_id)[0];
            var x = _.x, y = _.y;
            var mul = _.mul, add = _.add;
            var dx = freq / timbre.samplerate;
            var r  = Math.random;
            
            for (var i = 0, imax = cell.length; i < imax; ++i) {
                if (x >= 0.25) y = r() < 0.5 ? -1 : +1;
                cell[i] = y * mul + add;
                x += dx;
                while (x > 1) x -= 1;
            }
            _.x = x; _.y = y;
            
            if (!_.ar) { // kr-mode
                for (i = imax; i--; ) cell[i] = cell[0];
            }
        }
        
        return cell;
    };
    
    return EightBitNoise;
}());
timbre.fn.register("8bitnoise", EightBitNoise);


// __END__
if (module.parent && !module.parent.parent) {
    describe("8bitnoise", function() {
        object_test(EightBitNoise, "8bitnoise");
    });
}
