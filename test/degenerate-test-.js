var assert = require('assert'),
    process_exec = require('child_process').exec,
    Dummy  = require('../src/DummyData.js');

describe('Dummy degenerate', function() {
  describe('json validation', function() {
    it('should throw an error with invalid json', function() {
      assert.throws(function() {
        Dummy.degenerate('./test/json-samples/invalid.json');
      }, /invalid JSON/);
    });

    it('should not throw any error', function() {
      assert.doesNotThrow(function() {
        Dummy.degenerate('./test/json-samples/valid.json');
      });
    });
  });

  describe('extract specification', function() {
    describe("Arrays", function() {
      it("should return the type Array", function() {
        var spec = Dummy.degenerate('./test/json-samples/array.json');
        assert.equal(spec.type, 'Array');
      });

      it("should return the childSpec", function() {
        var spec = Dummy.degenerate('./test/json-samples/array.json');
        assert.equal(spec.childSpec.name.type, 'String');
      });

      it("should return the type Array", function() {
        var spec = Dummy.degenerate('./test/json-samples/nested-array.json');
        assert.equal(spec.type, 'Array');
      });

      it("should return the childSpec of childSpec", function() {
        var spec = Dummy.degenerate('./test/json-samples/nested-array.json');
        assert.equal(spec.childSpec.list.childSpec.tomatoes.type, 'String');
      });
    });

    describe("Objects", function() {
      it('should return type Object', function() {
        var spec = Dummy.degenerate('./test/json-samples/core.json');
        assert.equal(spec.type, 'Object');
      });

      it('should return type String', function() {
        var spec = Dummy.degenerate('./test/json-samples/core.json');
        assert.equal(spec.hello.type, "String");
        assert.equal(spec.foo.type, "String");
      });

      it('should return type Number', function() {
        var spec = Dummy.degenerate('./test/json-samples/core.json');
        assert.equal(spec.num.type, 'Number');
      });

      it('should return min/max of Number types', function() {
        var spec = Dummy.degenerate('./test/json-samples/core.json');
        assert.equal(spec.num.min, 0);
        assert.equal(spec.num.max, 123e5);
      });

      it('should return type Array', function() {
        var spec = Dummy.degenerate('./test/json-samples/core.json');
        assert.equal(spec.arr.type, 'Array');
      });

      it('should return type Array', function() {
        var spec = Dummy.degenerate('./test/json-samples/core.json');
        assert.equal(spec.arr, 'String');
      });
    });
  });

});
