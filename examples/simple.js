
//Browser || Node
var ECC = ECC || require('../');

var ecc = new ECC({ encryptDecrypt: true, generate: true });

var plaintext = "hello world";
var ciphertext = ecc.encrypt(plaintext);
var result = ecc.decrypt(ciphertext);
console.log(plaintext === result);