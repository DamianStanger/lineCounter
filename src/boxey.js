"use strict";

function Box(color)
{
  var color = color;

  this.getColor = function()
  {
    return color;
  }
}

Box.prototype.getMyColor = function(){
  return this.getColor();
};

module.exports = Box;