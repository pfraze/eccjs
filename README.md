ecc.js
=====

Simple wrapper around SJCL's ECC Implementation `v0.1.0` (Beta)

## Download

#### Browser

* [ecc.js](https://raw.github.com/jpillora/eccjs/gh-pages/dist/0.1/ecc.js)
* [ecc.min.js](https://raw.github.com/jpillora/eccjs/gh-pages/dist/0.1/ecc.min.js)

#### Node

```
npm install eccjs
```

## Features

* Easy to use
* Includes [SJCL]() as `ecc.sjcl`


## Quick Usage

**Encryption and Decryption**

``` js
// Create alice and bob, generate a keypair for alice
var alice = ecc().keys({ generate: true });
var bob   = ecc();

// Give bob alice's encryption key
bob.addEncryptKey('alice', alice.encryptKey);

// A secret message
var plaintext = "hello world!";

// bob encrypts *for* alice
var ciphertext = bob.encrypt('alice', text);

// alice decrypts
var result = alice.decrypt(ciphertext);

console.log(plaintext === result); //=>true
```

**Sign and Verify**

``` js
// Continuing from above...

// Give bob alice's verify key
bob.addVerifyKey('alice', alice.verifyKey);

// An important message
var message = "hello world!";

// Alice creates digital signature
var sig = alice.sign(message, 'sha256');

// Bob verifies
var result = bob.verify('alice', message, sig, 'sha256');

console.log(result); // => trues
```

## API

Global

* `ecc()` - Creates an instance of the `ECC` class

* ecc.sjcl - Reference to `sjcl`

`ECC` Methods

* `keys(opts)` - Provide keys to this instance
  * `opts.curve` - (`384`) Curve to use
  * `opts.generate` (`false`) - Generate key-pairs.
  * `opts.encryptDecrypt` (`true`) - On generate, create a encrypt/decrypt key-pair.
  * `opts.signVerify` (`true`) - On generate, create a sign/verify key-pair.
  * `opts.encryptKey` (`null`) - Import an encryption hex key
  * `opts.decryptKey` (`null`) - Import an decryption hex key
  * `opts.signKey` (`null`) - Import an signing hex key
  * `opts.verifyKey` (`null`) - Import an verify hex key

When a key is generated or imported, it's hex representation will be avaliable as:

* `encryptKey` (`null`)
* `decryptKey` (`null`)
* `signKey` (`null`)
* `verifyKey` (`null`)

To encrypt or verify a message, you must first add the recipient's key first:

* `addEncryptKey(recipient, hex)`
* `addVerifyKey(recipient, hex)`

Once you've got the appropriate keys, you can then:

* `encrypt(recipient, text)` - Encrypts the `text` for `recipient`, producing a `cipher` object.
* `decrypt(cipher)` - Decrypts the `cipher` object, producing the `text`.
* `sign(message[, hash])` - Digitally signs the `message` string, producing the `sig`. `message` can optionally be hashed by setting `hash` to `"sha256"`.
* `verify(recipient, message, sig[, hash])` - Confirm a `message` came from `recipient` by verifying the `sig`. `message` can optionally be hashed by setting `hash` to `"sha256"`.

---

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