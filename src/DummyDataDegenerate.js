var fs = require('fs'),
    _ = require('lodash');

function openAndValidate(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch(e) {
    throw new Error('invalid JSON');
  }
}

function capitalized(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getType(val) {
  if(_.isArray(val)) {
    return 'Array';
  } else if (_.isDate(val)) {
    return 'Date';
  } else if (_.isObject(val)) {
    return 'Object';
  } else {
    return capitalized(typeof val);
  }
}

function getTypeAndLimits(json) {
  var ret = {};
  ret.type = getType(json);
  if(_.isEqual(ret.type, 'Array')) {
    ret.min = 1;
    ret.max = json.length;
  }

  return ret;
}

function getJsonValueDetails(json, jsonType) {
  var ret = _.isEqual(jsonType, 'Array') ? { childSpec: {}} : {};
  var jsonSource = _.isEqual(jsonType, 'Array') ? json[0] : json;
  var valDetails = _.isEqual(jsonType, 'Array') ? ret.childSpec : ret;

  if(_.isEqual(getType(jsonSource), 'Array') || _.isEqual(getType(jsonSource), 'Object')) {
    for(var jsonKey in jsonSource) {
      var jsonValue = jsonSource[jsonKey];
      var jsonValueType = getType(jsonValue);
      valDetails[jsonKey] = { type: jsonValueType };
      _.extend(valDetails[jsonKey], getTypeAndLimits(jsonValue));

      switch(jsonValueType) {
        case 'Number':
          _.extend(valDetails[jsonKey], { min: (jsonValue < 0 ? jsonValue : 0),
            max: jsonValue });
          break;
        case 'Array':
          _.extend(valDetails[jsonKey], getJsonValueDetails(jsonValue, 'Array'));
          break;
      }
    }
  }

  return ret;
}

module.exports = function degenerate(path) {
  var specification = {};
  var json = openAndValidate(path);
  var typeInfoDict = getTypeAndLimits(json);
  var jsonValDetailsDict = getJsonValueDetails(json, typeInfoDict.type);

  _.extend(specification, typeInfoDict);
  _.extend(specification, jsonValDetailsDict);

  return specification;
};
