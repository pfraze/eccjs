var sjcl = require('./vendor/sjcl')

var ecc = sjcl.ecc

function toBuffer(words) {
  var l = words.length
  var b = new Buffer(l * 4)
  for(var i = 0; i < l; i++) {
    b.writeInt32BE(words[i], i*4)
  }
  return b
}

function toWords (buffer) {
  if(!Buffer.isBuffer(buffer))
    throw new Error('toWords *must* be passed a buffer')

  if(buffer.length % 4)
    throw new Error('buffer.length must be multiple of 4, was: ' + buffer.length)
  var l = buffer.length/4

  var w = Array(l)
  for(var i = 0; i < l; i++)
    w[i] = buffer.readInt32BE(i*4)
  return w
}

function toPoint (curve, buffer) {
  var w = toWords(buffer)
  var l = w.length
  var x = sjcl.bn.fromBits(w.slice(0, l/2))
  var y = sjcl.bn.fromBits(w.slice(l/2))
  return new sjcl.ecc.point(curve, x, y)
}

var toBig = sjcl.bn.fromBits

exports.curves = sjcl.ecc.curves

exports.generate = function (curve, paranoia) {

  var _PRIVATE = sjcl.bn.random(curve.r, paranoia)
  var PRIVATE = toBuffer(_PRIVATE.toBits())
  var PUBLIC = toBuffer(curve.G.mult(_PRIVATE).toBits())

  return { private: PRIVATE, public: PUBLIC}
}

exports.restore = function (curve, PRIVATE) {
  return {
    private: PRIVATE,
    public: toBuffer(curve.G.mult(sjcl.bn.fromBits(toWords(PRIVATE))).toBits())
  }
}

exports.sign = function (curve, key, hash, paranoia) {
  key = key.private || key
  var sec = new ecc.ecdsa.secretKey(curve, sjcl.bn.fromBits(toWords(key)))
  return toBuffer(sec.sign(toWords(hash), paranoia))
}

exports.verify = function (curve, key, sig, hash) {
  key = key.public || key
  try {
    var pub = new ecc.ecdsa.publicKey(curve, toWords(key))
    return pub.verify(toWords(hash), toWords(sig))
  } catch (err) {
    if(!/^CORRUPT/.test(''+err)) throw err
    return false
  }
}

exports.kem = function (curve, key, paranoia) {
  key = key.public || key
  var pub = new ecc.ecdsa.publicKey(curve, toWords(key))
  return ecc.elGamal.publicKey(curve, pub).key(paranoia)
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

