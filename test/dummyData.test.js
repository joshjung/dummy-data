var assert = require('assert'),
  Dummy = require('../src/DummyData.js');

describe('Dummy', function() {
  describe('should work with example 1 in docs', function () {
    var spec = {
      name: "String",
      age: {
        type: "Integer",
        max: 110,
        min: 0
      },
      height: {
        type: "Number",
        max: 9,
        min: 0
      },
      address: "String",
      date: {
        type: "Date",
        min: new Date(1960, 0),
        max: new Date()
      }
    };

    var person = Dummy.generate(spec);
  });

  describe('should work with example 2 in docs', function () {
    var spec = {
      type: "Array",
      min: 20,
      max: 100,
      childSpec: {
        name: {
          first: "String",
          last: "String"
        },
        address: {
          street1: "String",
          street2: "String",
          city: "String",
          state: "String",
          zip: "String"
        },
        email: "String"
      }
    };

    var customer = Dummy.generate(spec);
  });

  describe('should validate specification', function() {
    it('should ERROR with undefined specification', function() {
      assert.throws(function () {
        Dummy.generate();
      }, function (err) {return true;});
    });
  });
  
  describe('should work with Object spec and no count', function() {
    var personSpec = require('./specifications/core.json'),
      dummyData = Dummy.generate(personSpec);

    it(' should map basic String (name)', function() {
      assert.equal(typeof dummyData.name, 'string');
    });

    it(' should map basic Integer (age)', function() {
      assert.equal(typeof dummyData.age, 'number');
    });

    it(' should map basic Integer (age) with min', function() {
      assert(dummyData.age >= personSpec.age.min, 'Value should be >= ' + personSpec.age.min + ' but was ' + dummyData.age);
    });

    it(' should map basic Integer (age) with max', function() {
      assert(dummyData.age <= personSpec.age.max, 'Value should be <= ' + personSpec.age.max + ' but was ' + dummyData.age);
    });
    
    it(' should map basic Integer (age) with no decimal', function() {
      assert((dummyData.age % 1.0) == 0, 'Value should be integer but was ' + dummyData.age);
    });

    it(' should map basic Number (height)', function() {
      assert.equal(typeof dummyData.height, 'number');
    });
    
    it(' should map basic Number (height) with min', function() {
      assert(dummyData.height >= personSpec.height.min, 'Value should be >= ' + personSpec.height.min + ' but was ' + dummyData.height);
    });

    it(' should map basic Number (height) with max', function() {
      assert(dummyData.height <= personSpec.height.max, 'Value should be <= ' + personSpec.height.max + ' but was ' + dummyData.height);
    });
    
    it(' should map basic Date (dob)', function() {
      assert(dummyData.dob instanceof Date);
    });

    it(' should map basic Date (dob) with min', function() {
      assert(dummyData.dob.getTime() >= new Date(personSpec.dob.min).getTime(), 'Value should be >= ' + personSpec.dob.min + ' but was ' + dummyData.dob);
    });

    it(' should map basic Date (dob) with max', function() {
      assert(dummyData.dob.getTime() <= new Date(personSpec.dob.max).getTime(), 'Value should be <= ' + personSpec.dob.max + ' but was ' + dummyData.dob);
    });
  });
  
  describe('should work with generateLater()', function() {
    var personSpec = require('./specifications/core.json');

    it(' should callback with valid object', function(done) {
      Dummy.generateLater(100, personSpec).then(function (dummyData) {
        assert.equal(typeof dummyData.name, 'string');
        assert.equal(typeof dummyData.age, 'number');
        assert.equal(typeof dummyData.height, 'number');
        done();
      });
    }, 110);
  });
  
  describe('should work with Object spec and property token replacements', function() {
    var personSpec = require('./specifications/core.tokens.json'),
      tokens = {
        minAge: 10,
        maxAge: 11,
        minHeight: 1.0,
        maxHeight: 1.1,
        minDate: "1990/01/01 00:00:00",
        maxDate: "1990/01/01 00:01:00"
      },
      dummyData = Dummy.generate(personSpec, tokens);
      
    it(' should map basic Integer (age)', function() {
      assert.equal(typeof dummyData.age, 'number');
    });

    it(' should map basic Integer (age) with min', function() {
      assert(dummyData.age >= tokens.minAge, 'Value should be >= ' + tokens.minAge + ' but was ' + dummyData.age);
    });

    it(' should map basic Integer (age) with max', function() {
      assert(dummyData.age <= tokens.maxAge, 'Value should be <= ' + tokens.maxAge + ' but was ' + dummyData.age);
    });

    it(' should map basic Integer (age) with no decimal', function() {
      assert((dummyData.age % 1.0) == 0, 'Value should be integer but was ' + dummyData.age);
    });

    it(' should map basic Number (height)', function() {
      assert.equal(typeof dummyData.height, 'number');
    });

    it(' should map basic Number (height) with min', function() {
      assert(dummyData.height >= tokens.minHeight, 'Value should be >= ' + tokens.minHeight + ' but was ' + dummyData.height);
    });

    it(' should map basic Number (height) with max', function() {
      assert(dummyData.height <= tokens.maxHeight, 'Value should be <= ' + tokens.maxHeight + ' but was ' + dummyData.height);
    });
    
    it(' should map basic Date (dob)', function() {
      assert(dummyData.dob instanceof Date);
    });

    it(' should map basic Date (dob) with min', function() {
      assert(dummyData.dob.getTime() >= new Date(tokens.minDate).getTime(), 'Value should be >= ' + tokens.minDate + ' but was ' + dummyData.dob);
    });

    it(' should map basic Date (dob) with max', function() {
      assert(dummyData.dob.getTime() <= new Date(tokens.maxDate).getTime(), 'Value should be <= ' + tokens.maxDate + ' but was ' + dummyData.dob);
    });
  });

  describe('should work with Object spec and count', function() {
    var personSpec = require('./specifications/core.json'),
      dummyData = Dummy.generate(personSpec, undefined, 10);

    it(' should map core to array with length of 10', function() {
      assert.equal(dummyData.length, 10);
    });

    it(' should make each child the right object', function() {
      for (var i = 0; i < dummyData.length; i++)
      {
        assert.equal(typeof dummyData[i].name, 'string');
        assert.equal(typeof dummyData[i].age, 'number');
        assert.equal(typeof dummyData[i].height, 'number');
      }
    });
  });
  
  describe('should work with Array spec and min/max', function() {
    var arraySpec = require('./specifications/array.json'),
      dummyData = Dummy.generate(arraySpec);

    it(' should map to array', function() {
      assert(dummyData.length);
    });

    it(' should make each child the right object', function() {
      for (var i = 0; i < dummyData.length; i++)
      {
        assert.equal(typeof dummyData[i].name, 'string');
        assert.equal(typeof dummyData[i].age, 'number');
        assert.equal(typeof dummyData[i].height, 'number');
      }
    });
  });

  describe('should work with a nested object', function() {
    var arraySpec = require('./specifications/nested.json'),
      dummyData = Dummy.generate(arraySpec);

    it(' should map to an object with name.first and name.last', function() {
      assert(dummyData.name);
      assert(dummyData.name.first);
      assert(dummyData.name.last);
    });
  });

  describe('should work with a array with a childSpec that is nested', function() {
    var arraySpec = require('./specifications/nested.array.json'),
      dummyData = Dummy.generate(arraySpec);

    it(' should map to array', function() {
      assert(dummyData.length);
    });

    it(' should map to an object with name.first and name.last', function() {
      dummyData.forEach(function (item) {
        assert(item.name);
        assert(item.name.first);
        assert(item.name.last);
      });
    });
  });
});