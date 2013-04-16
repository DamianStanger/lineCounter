"use strict";
var assert = require("assert"),
  Box = require("../src/Boxey.js");

describe("Boxey tests", function(){

  it('should get my color', function(){
    var blueBox=new Box("blue");
    assert.equal(blueBox.getMyColor(), "blue");
  });

  it('should get the color', function(){
    var greenBox=new Box("green");
    assert.equal(greenBox.getColor(), "green")
  });
});

