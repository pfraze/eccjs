
// API PROTOTYPE! NOT IMPLEMENTED

var alice = ECC.signer();
var bob = ECC.verifier(alice.key);
var text = "hello world!";
var sig = alice.sign(text);

bob.verify(sig, text);