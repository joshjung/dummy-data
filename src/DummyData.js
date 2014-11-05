/*===========================================================================*\
 * Requires
\*===========================================================================*/
var JClass = require('jclass'),
  Promise = require('bluebird');

function conthunktor(Constructor) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {

     var Temp = function(){}, // temporary constructor
         inst, ret; // other vars

     // Give the Temp constructor the Constructor's prototype
     Temp.prototype = Constructor.prototype;

     // Create a new instance
     inst = new Temp;

     // Call the original Constructor with the temp
     // instance as its context (i.e. its 'this' value)
     ret = Constructor.apply(inst, args);

     // If an object has been returned then return it otherwise
     // return the original instance.
     // (consistent with behaviour of the new operator)
     return Object(ret) === ret ? ret : inst;

  }
}

/*===========================================================================*\
 * Globals
\*===========================================================================*/
var integer = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
}

var getType = function (spec) {
  var type = TYPES[spec.type];

  if (!type)
    throw Error('Invalid type in specification: ' + spec.type + '. Valid types are: String, Number, Integer, Array, Date, or Object');

  return type;
}

var instanceOf = function (spec, props, dummy) {
  return getType(spec).instance(spec, props, dummy);
}

var TYPES = {
  'Object': {
    instance: function (spec, props, dummy) {
      
      var obj = {};
      for (var key in spec)
      {
        if (key == 'type')
          continue;

        var prop = key,
          subSpec = (typeof spec[key] == 'string') ? {type: spec[key]} : spec[key];

        obj[key] = instanceOf(subSpec, props, dummy);          
      }
      return obj;
    }
  },
  'String': {
    instance: function (spec, props, dummy) {
      return 'string_' + (Math.random() * 10000).toString(16);
    }
  },
  'Integer': {
    instance: function (spec, props, dummy) {
      spec.min = spec.min || 0.0;
      spec.max = spec.max || 100.0;
      return integer(spec.min, spec.max);
    }
  },
  'Number': {
    instance: function (spec, props, dummy) {
      spec.min = spec.min || 0.0;
      spec.max = spec.max || 1.0;
      return spec.min + Math.random() * (spec.max - spec.min);
    }
  },
  'Array': {
    instance: function (spec, props, dummy) {
      spec.min = spec.min || 1.0;
      spec.max = spec.max || 100.0;

      var c = integer(spec.min, spec.max),
        ret = [];

      for (var i = 0; i < c; i++)
      {
        ret.push(DummyExport.gen(spec, props));
      }
      
      return ret;
    }
  },
  'Date': {
    instance: function (spec, props, dummy) {
      spec.min = spec.min ? new Date(spec.min) : new Date(0);
      spec.max = spec.max ? new Date(spec.max) : new Date();

      return new Date(integer(spec.min.getTime(), spec.max.getTime()));
    }
  }
};

var regExDict = {};

/*===========================================================================*\
 * Utils
\*===========================================================================*/
function tokenize(strOrObj, props) {
	var ret = (typeof strOrObj == 'string') ? strOrObj : JSON.stringify(strOrObj);

  if (!props)
    return ret;

	for (var key in props)
	{
    var regEx = regExDict[key] || (regExDict[key] = (typeof props[key] == 'string' ? new RegExp('\\$\\{' + key + '\\}?', 'g') : new RegExp('\\"?\\$\\{' + key + '\\}\\"?', 'g')));
		ret = ret.replace(regEx, props[key]);
    console.log(ret);
	}

	return ret;
};

/*===========================================================================*\
 * DummyData
\*===========================================================================*/
var Dummy = JClass._extend({
  //-----------------------------------
  // Constructor
  //-----------------------------------
  init: function init() {},
  generate: function generate(specification, props, count) {
    var spec = JSON.parse(tokenize(specification, props));
    count = count || 1;

    spec.type = spec.type || 'Object';

    var obj,
      type = getType(spec);

    if (count == 1)  
      return type.instance(spec, props, this);
    else
    {
      var ret = [];
      for (var i = 0; i < count; i++)
        ret.push(type.instance(spec, props, this));
      return ret;
    }
  }
});

/*===========================================================================*\
 * Exports
\*===========================================================================*/
var DummyExport = module.exports = {
  Dummy: Dummy,
  tokenize: tokenize,
  generate: function (specification, props, count) {
    return (new Dummy()).generate(specification, props, count);
  },
  generateLater: function (timeout, specification, props, count) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(DummyExport.generate(specification, props, count));
      }, timeout);
    });
  }
}