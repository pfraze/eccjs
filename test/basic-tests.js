var expect = require('chai').expect,
    ecc = require('../');

describe('ecc >', function() {


  var alice;
  var bob;
  var carl;

  it('should generate keys on alice and not on bob and carl', function() {
    alice = ecc().keys({ generate: true });
    bob   = ecc().keys({ generate: false });
    carl  = ecc().keys({ generate: false });

    function check(person, expectation) {
      expect(person.k.encrypt).to.be[expectation];
      expect(person.k.decrypt).to.be[expectation];
      expect(person.k.sign).to.be[expectation];
      expect(person.k.verify).to.be[expectation];
    }

    check(alice, 'truthy');
    check(bob, 'falsy');
    check(carl, 'falsy');
  });


  describe('encrypt/decrypt >', function() {

    var plaintext = "hello-world!!";
    var ciphertext = null;

    it('should throw since missing alices key', function() {
      expect(function() {
        bob.encrypt('alice', plaintext);
      }).to.throw(Error);
    });

    it('should NOT throw since has alices key', function() {

      //add key then try again
      bob.addEncryptKey('alice', alice.encryptKey);

      expect(function() {
        ciphertext = bob.encrypt('alice', plaintext);
      }).not.to.throw(Error);

      expect(ciphertext).not.to.equal(null);
    });


    it('should successfully decrypt', function() {
      var result = alice.decrypt(ciphertext);
      expect(result).to.equal(plaintext);
    });

  });


  describe('sign/verify >', function() {

    var message = "hello-world!!";
    var signature = null;
    var result = null;

    it('should create a signature', function() {
      signature = alice.sign(message, 'sha256');
      expect(signature).not.to.equal(null);
    });

    it('should throw since missing alices key', function() {
      expect(function() {
        bob.verify('alice', message, signature, 'sha256');
      }).to.throw(Error);
    });

    it('should NOT throw since has alices key', function() {

      //add key then try again
      bob.addVerifyKey('alice', alice.verifyKey);

      expect(function() {
        result = bob.verify('alice', message, signature, 'sha256');
      }).not.to.throw(Error);

      expect(result).to.equal(true);
    });


    it('should fail on wrong message', function() {
      var message2 = message + "!";
      var result2 = bob.verify('alice', message2, signature, 'sha256');
      expect(result2).to.equal(false);
    });

  });


});
