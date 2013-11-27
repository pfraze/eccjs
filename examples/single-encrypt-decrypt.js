
// API PROTOTYPE! NOT IMPLEMENTED

var alice = ECC.decrypter();

var bob = ECC.encrypter(decrypter.key);

alice.encrypter(bob.tags);

var text = "hello world!";
var cipher = bob.encrypt(text);
var result = alice.decrypt(cipher);
