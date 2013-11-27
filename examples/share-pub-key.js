
//Browser || Node
var ECC = ECC || require('../');

// alice
var aliceEcc = new ECC({ encryptDecrypt: true });
var aliceKey = aliceEcc.getPublicKey();


var bobEcc = new ECC({ encryptDecrypt: true });

var aliceTag = bobEcc.addPublicKey('alice', aliceKey);

var plaintext = "hello world";
var ciphertext = bobEcc.encrypt('alice', plaintext);


aliceEcc.addPublicTag('bob', aliceTag);
var result = aliceEcc.decrypt('bob', ciphertext);
console.log(plaintext === result);
