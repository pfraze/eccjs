ecc.js
=====

nodey ecc lib based on [SJCL](http://bitwiseshiftleft.github.io/sjcl/)'s [ECC](http://en.wikipedia.org/wiki/Elliptic_curve_cryptography) Implementation `v0.3.0` (Beta)

## Example

``` js
var crypto = require('crypto')
var ecc = require('eccjs')

// Generate (or load) encryption/decryption keys 
var curve = ecc.curves.k256
var keys = ecc.generate(curve);
// => { public: <Buffer...>, private: <Buffer ...>}

// sign a message
var plaintext = "hello world!";
//the hash, as a buffer
var hash = crypto.createHash('sha256').update(plaintext, 'utf8').digest()

var sig = ecc.sign(curve, keys.private, hash)
var valid = ecc.verify(curve, keys.public, hash, sig)
console.log(valid)
// => true 
```

## API

* `ecc.generate(type[, curve = 192])`
* `ecc.sign(curve, key, hash)`
* `ecc.verify(curve, key, signature, hash)`
* `ecc.kem(curve, key, paranoia)`
* `ecc.unkem(curve, key)`

#### MIT License

Copyright © 2013 Jaime Pillora &lt;dev@jpillora.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
