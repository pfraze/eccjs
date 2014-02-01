//var tape = require('tape')

var ecc = require('../')
var sjcl = require('../vendor/sjcl')
var crypto = require('crypto')
function hash (m) {
  return crypto.createHash('sha256').update(m).digest('hex')
}

//tape('generate & sign valid keys', function (t) {
  var curve = ecc.curves.k256
  var keys = ecc.generate(curve)
  console.log('Keys', keys)
  var message = hash('hello!')
  var sig = ecc.sign(curve, keys.private, message)

  console.log('Sig', sig)
  var valid = ecc.verify(curve, keys.public, sig, message)
  console.log('BITS',
    sjcl.codec.hex.fromBits(keys.public.toBits())
  )
  console.log('Valid?', valid)
//})
