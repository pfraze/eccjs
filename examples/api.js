
// CONSTRUCTORS

var alice = ecc().keys({ generate: true });
var bob   = ecc().keys({ generate: false });
var carl  = ecc().keys({ generate: false });


// ENCRYPTION / DECRYPTION

bob.addEncryptKey('alice', alice.encryptKey);
carl.addEncryptKey('alice', alice.encryptKey);

var text = "hello world!";

var bobcipher = bob.encrypt('alice', text);
var carlcipher = carl.encrypt('alice' ,text);

// bob and carl produce different ciphertexts
// bobcipher !== carlcipher

var bobresult = alice.decrypt(bobcipher);
var carlresult = alice.decrypt(carlcipher);

// though alice produces the same plaintexts
// text === bobresult === carlresult

console.log(bobresult, carlresult);


// SIGN / VERIFY

bob.addVerifyKey('alice', alice.verifyKey);

var text = "hello world!";

var sig = alice.sign(text, 'sha256');

var bobresult = bob.verify('alice', text, sig, 'sha256');

console.log(bobresult);

// => trues
