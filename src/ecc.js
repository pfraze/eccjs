
var DEFAULTS = {
  curve: 384,
  generate: false,
  signVerify: true,
  encryptDecrypt: true,
  encryptKey: null,
  decryptKey: null,
  verifyKey: null,
  signKey: null
};

var ecc = function ecc() {
  return new ECC();
};

ecc.sjcl = sjcl;

//ecc algorithm helpers
function eccAPI(algoName) {
  var algo = sjcl.ecc[algoName];
  if(!algo)
    throw new Error("Missing ECC algorithm: " + algoName);
  return {
    generate: function(curve) {
      return algo.generateKeys(curve, 1);
    },
    importPublicHex: function(curve, hex) {
      curve = sjcl.ecc.curves['c'+curve];
      return new algo.publicKey(curve, sjcl.codec.hex.toBits(hex));
    },
    importSecretHex: function(curve, hex) {
      curve = sjcl.ecc.curves['c'+curve];
      return new algo.secretKey(curve, new sjcl.bn(hex));
    }
  };
}

//hash algorithm helpers
function hashAPI(algoName) {
  var algo = sjcl.hash[algoName];
  if(!algo)
    throw new Error("Missing hash algorithm: " + algoName);
  return {
    hash: function(input) {
      return algo.hash(input);
    }
  };
}

var algo = {
  elg: eccAPI('elGamal'),
  dsa: eccAPI('ecdsa'),
  exportPublic: function(key) {
    var obj = key.get();
    return sjcl.codec.hex.fromBits(obj.x) +
           sjcl.codec.hex.fromBits(obj.y);
  },
  exportSecret: function(key) {
    return sjcl.codec.hex.fromBits(key.get());
  },
  sha256: hashAPI('sha256')
};

//ECC Class
function ECC() {
  this.k = {};
  this.enck = {};
  this.verk = {};
}

ECC.prototype.keys = function(opts) {
  //grab defaults
  for(var k in DEFAULTS)
    if(!opts.hasOwnProperty(k))
      opts[k] =  DEFAULTS[k];

  //store curve
  this.curve = opts.curve;

  //generate keys
  if(opts.generate && opts.encryptDecrypt) {
    if(opts.encryptKey || opts.decryptKey)
      throw new Error("Keys 'encryptKey' and 'decryptKey' will be overridden");
    var encdec = algo.elg.generate(this.curve);
    this.k.encrypt = encdec.pub;
    this.k.decrypt = encdec.sec;
  }

  if(opts.generate && opts.signVerify) {
    if(opts.signKey || opts.verifyKey)
      throw new Error("Keys 'signKey' and 'verifyKey' will be overridden");
    var sigver = algo.dsa.generate(this.curve);
    this.k.verify = sigver.pub;
    this.k.sign   = sigver.sec;
  }

  //import provided keys
  if(opts.encryptKey)
    this.k.encrypt = algo.elg.importPublicHex(this.curve, opts.encryptKey);
  if(opts.decryptKey)
    this.k.decrypt = algo.elg.importSecretHex(this.curve, opts.decryptKey);
  if(opts.verifyKey)
    this.k.verify = algo.dsa.importPublicHex(this.curve, opts.verifyKey);
  if(opts.signKey)
    this.k.sign = algo.dsa.importSecretHex(this.curve, opts.signKey);

  //expose provided public keys
  if(this.k.encrypt)
    this.encryptKey = algo.exportPublic(this.k.encrypt);
  if(this.k.verify)
    this.verifyKey = algo.exportPublic(this.k.verify);

  return this;
};

ECC.prototype.addEncryptKey = function(recipient, hex) {
  if(this.enck[recipient])
    throw new Error("Encryption key already exists beloning to: " +recipient);

  var key = algo.elg.importPublicHex(this.curve, hex);
  this.enck[recipient] = key.kem();
};

ECC.prototype.encrypt = function(recipient, plaintext) {
  var kem = this.enck[recipient];
  if(!kem)
    throw new Error("Could not find encrytion key beloning to: " +recipient);

  var obj = sjcl.json._encrypt(kem.key, plaintext);

  obj.tag = kem.tag;

  return JSON.stringify(obj);
};

ECC.prototype.decrypt = function(cipher) {
  if(!this.k.decrypt)
    throw new Error("Decryption key missing");
  var obj = JSON.parse(cipher);
  var key = this.k.decrypt.unkem(obj.tag);
  return sjcl.json._decrypt(key, obj);
};

ECC.prototype.sign = function(text, hashAlgo) {

  if(!this.k.sign)
    throw new Error("Sign key missing");

  if(hashAlgo)
    text = algo[hashAlgo].hash(text);

  return this.k.sign.sign(text);
};

ECC.prototype.addVerifyKey = function(recipient, hex) {
  if(this.verk[recipient])
    throw new Error("Verify key already exists beloning to: " +recipient);

  this.verk[recipient] = algo.dsa.importPublicHex(this.curve, hex);
};

ECC.prototype.verify = function(recipient, text, signature, hashAlgo) {

  var key = this.verk[recipient];
  if(!key)
    throw new Error("Could not find verify key beloning to: " + recipient);

  if(hashAlgo)
    text = algo[hashAlgo].hash(text);

  try {
    return key.verify(text, signature);
  } catch(e) {
    return false;
  }
};

//publicise
if(typeof module !== 'undefined' && module.exports)
  module.exports = ecc;
else
  window.ecc = ecc;
