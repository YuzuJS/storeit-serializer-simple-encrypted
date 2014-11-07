"use strict"; // TODO use https://www.npmjs.org/package/crypto-js instead?

var base64 = require("base64it");
var base64Encode = base64.urlSafeEncode;
var base64Decode = base64.urlSafeDecode;

function stringToHash(string) {
    var hash = {};
    [].forEach.call(string, function (char, index) {
        hash[char] = index;
    });
    return hash;
}
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var alphabetLength = alphabet.length;
var alphabetHash = stringToHash(alphabet); // { A:0, B:1 ... }

module.exports = function SimpleEncryptedSerializer(key) {
    var that = this;
    var keyLength = key.length;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function encode(value) {
        value = value.replace(/=*$/, ""); // Drop base64 padding.
        var result = [alphabet[getRandomInt(0, alphabetLength - 1)]];
        var keyIdx = 0;
        var abcIndex = alphabetHash[result] % alphabetLength;
        for (var i = 0; i < value.length; i++) {
            var keyInc = key[keyIdx].charCodeAt(0);
            keyIdx = (keyIdx + 1) % keyLength;
            abcIndex = (abcIndex + keyInc + alphabetHash[value[i]]) % alphabetLength;
            result.push(alphabet[abcIndex]);
        }
        return result.join("");
    }

    function mod(x, y) {
        return ((x % y) + y) % y;
    }

    function decode(value) {
        var result = [];
        var keyIdx = 0;
        for (var i = 1; i < value.length; i++) {
            var keyInc = key[keyIdx].charCodeAt(0);
            keyIdx = (keyIdx + 1) % keyLength;
            var abcIndex = mod(alphabetHash[value[i-1]], alphabetLength);
            var x = -(abcIndex + keyInc - alphabetHash[value[i]]);
            abcIndex = mod(x, alphabetLength);
            result.push(alphabet[abcIndex]);
        }
        return result.join("");
    }

    Object.defineProperty(that, "name", {
        value: "EncryptedSerializer",
        enumerable: true
    });

    that.serialize = function (value) {
        return encode(base64Encode(encodeURIComponent(JSON.stringify(value))));
    };

    that.deserialize = function (value) {
        return value ? JSON.parse(decodeURIComponent(base64Decode(decode(value)))) : null;
    };
};
