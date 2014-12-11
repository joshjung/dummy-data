![](https://nodei.co/npm/dummy-data.png?downloads=True&stars=True)

Dummy-Data
==========

Dummy-Data allows you to generate dummy data that fits a JSON specification.

Example (basic)
===============

    var dummy = require('dummy-data');

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

    var person = dummy.generate(spec);

Example (nested objects)
========================

    var dummy = require('dummy-data');

    var spec = {
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
    };

    var customer = dummy.generate(spec);

Example (nested objects in array)
=================================

    var dummy = require('dummy-data');

    // Produce an array of 20-100 customer objects.
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

    var customer = dummy.generate(spec);
    
Example (w/count)
=================

    var dummy = require('dummy-data');

    var spec = {
      {
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
      }
    };

    var people = dummy.generate(spec, undefined, 10); // Build 10 people

Example (w/tokens)
==================

    var dummy = require('dummy-data');

    var spec = {
      {
        name: "String",
        age: {
          type: "Integer",
          max: "${maxAge}",
          min: "${minAge}"
        },
        height: {
          type: "Number",
          max: "${maxHeight}",
          min: "${minHeight}"
        },
        address: "String",
        date: {
          type: "Date",
          min: "${minDate}",
          max: "${maxDate}"
        }
      }
    };

    var tokens = {
      maxAge: 120,
      minAge: 0,
      maxHeight: 6.0,
      minHeight: 1.0,
      maxDate: new Date(),
      minDate: new Date(1930, 0)
    }
    
    var person = dummy.generate(spec, tokens);



Install
=======

    npm install dummy-data

License
=======

The MIT License (MIT)

Copyright (c) 2014 Joshua Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
