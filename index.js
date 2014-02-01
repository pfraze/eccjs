var sjcl = require('./vendor/sjcl')

var ecc = sjcl.ecc

function toBuffer(words) {
  var l = words.length
  var b = new Buffer(l * 4)
  for(var i = 0; i < l; i++)
    b.writeInt32(words[i], i*4)
  return b
}

function toWords (buffer) {
  var l = buffer.length/4
  var w = Array(l)
  for(var i = 0; i < l; i++)
    words[i] = buffer.readInt32(i*4)
  return w
}

exports.curves = sjcl.ecc.curves

exports.generate = function (curve, paranoia) {

  var PRIVATE = sjcl.bn.random(curve.r, paranoia).
  var PUBLIC = curve.G.mult(PRIVATE)

  return { private: PRIVATE, public: PUBLIC }
}

exports.sign = function (curve, key, hash, paranoia) {
  key = key.private || key
  console.log('hydrate key', curve, key)
  var sec = new ecc.ecdsa.secretKey(curve, key)
  console.log('secret', sec)
  return sec.sign(hash, paranoia)
}

exports.verify = function (curve, key, sig, hash) {
  key = key.public || key
  var pub = new ecc.ecdsa.publicKey(curve, key)
  try {
    return pub.verify(hash, sig)
  } catch (err) {
    console.error(err)
    return false
  }
}

exports.kem = function (curve, key, paranoia) {
  key = key.public || key
  return ecc.elGamal.publicKey(curve, key).key(paranoia)
}

exports.unkem = function (curve, key, kem) {
  key = key.public || key
  return ecc.elGamal.privateKey(curve, key).unkey(paranoia)
}

if(!module.parent) {
  var keys = exports.generate(exports.curves.k256, 6)
  console.log(keys)
  console.log(exports.sign(exports.curves.k256, keys, 'hello there!'))
}

