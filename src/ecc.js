
var DEFAULTS = {
  curve: 384,
  signVerify: false,
  encryptDecrypt: false,
  publicKey: null,
  secretKey: null
};

// var ECC = {
//   encryptDecrypt: function() {


//   },
//   signVerify: function() {

//   }
// };

function ECC(opts) {
  //grab opts
  for(var k in DEFAULTS)
    this[k] = opts[k] || DEFAULTS[k];

  //choose a mode
  if(!(this.signVerify ^ this.encryptDecrypt))
    throw new Error("You must enable either 'signVerify' OR 'encryptDecrypt'");

  //get correct algorithm
  if(this.signVerify) {
    this.algo = sjcl.ecc.ecdsa;
    this.sign = sign;
    this.verify = verify;
  } else if(this.encryptDecrypt) {
    this.algo = sjcl.ecc.elGamal;
    this.encrypt = encrypt;
    this.decrypt = decrypt;
  }

  //generate keys
  if(!this.publicKey && !this.secretKey) {
    this.keys = this.algo.generateKeys(this.curve, 1);
  } else {
    this.keys = {};
  }

  //import public key hex
  if(this.publicKey) {
    var publicKeyBits = sjcl.codec.hex.toBits(this.publicKey);
    this.keys.pub = new this.algo.publicKey(sjcl.ecc.curves['c'+this.curve], publicKeyBits);
  }

  //import private key hex
  if(this.secretKey) {
    if(!this.keys.pub)
      throw new Error("You must provide 'publicKey' AND 'secretKey'");
    var secretKeyBits = new sjcl.bn(this.secretKey);
    this.keys.sec = new this.algo.secretKey(sjcl.ecc.curves['c'+this.curve], secretKeyBits);
  }

  //extract actual keys
  if(this.keys.pub) {
    this.keys.pubKem = this.keys.pub.kem();
    this.keys.pubKey = this.keys.pubKem.key;
    this.keys.pubTag = this.keys.pubKem.key;
  }
}

ECC.prototype.hasPublicKey = function() {
  if(!this.keys.pub) throw new Error("You have no public key");
};

ECC.prototype.hasSecretKey = function() {
  if(!this.keys.sec) throw new Error("You have no secret key");
};

ECC.prototype.addPublicTag = function(tag) {

};

ECC.prototype.getPublicTag = function(tag) {

};

ECC.prototype.getPublicKey = function() {
  this.hasPublicKey();
  var pubKeyObj = this.keys.pub.get();
  var pubKeyHex = sjcl.codec.hex.fromBits(pubKeyObj.x) + sjcl.codec.hex.fromBits(pubKeyObj.y);
  return pubKeyHex;
};

ECC.prototype.getSecretKey = function() {
  this.hasSecretKey();
  var secKeyObj = this.keys.sec.get();
  var secKeyHex = sjcl.codec.hex.fromBits(secKeyObj);
  return secKeyHex;
};


//these four are dynamically attached
function encrypt(plaintext) {
  this.hasPublicKey();
  return sjcl.encrypt(this.keys.pubKey, plaintext);
}

function decrypt(ciphertext) {

  // this.keys.sec.unkem(this.keys.pubKem.tag);

  this.hasSecretKey();
  return sjcl.decrypt(this.keys.secKey, ciphertext);
}

function sign(text) {
  this.hasPublicKey();
}

function verify(signature, text) {
  this.hasSecretKey();
}

ECC.sjcl = sjcl;

if(typeof module !== 'undefined' && module.exports)
  module.exports = ECC;
else
  window.ECC = ECC;
