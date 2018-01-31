

var canvas = undefined,
    ctx = undefined, // canvas.getContext('2d')
    fps, fpsInterval, startTime, now, then, elapsed,
    myReq = undefined, // myReq = requestAnimationFrame()
    myArcGroup = undefined,
    myNet = undefined,
    aLoopPause = true;

// see this for html names colors
// https://www.w3schools.com/colors/colors_shades.asp
var myColors = {
  black: 'rgba(0, 0, 0, 1)',
  darkGrey: 'rgba(50, 50, 50, 1)',
  lightGreyTrans: 'rgba(50, 50, 50, 0.3)',
  greyReset: 'rgb(211,211,211)',
  lighterGreyReset: 'rgb(240,240,240)',
  white: 'rgba(250, 250, 250, 1)',
  red: 'rgba(230, 0, 0, 1)',
  green: 'rgba(0, 230, 0, 1)',
  blue: 'rgba(0, 0, 230, 1)',
  lightblueAlpha: 'rgba(173,216,230,0.2)',
  yellowAlpha: 'rgba(255,255,0,0.2)',
  greenAlpha: 'rgba(0,128,0,0.2)',
}

// function Arc(x,y,r,color) {
//   this.x = x;
//   this.y = y;
//   this.r = r;
//   this.sAngle = 0;
//   this.eAngle = 2 * Math.PI;
//   this.xVel = getRandomIntInclusive(1,8)*randSign(); // rand speed and direction
//   this.yVel = getRandomIntInclusive(1,8)*randSign(); // rand speed and direction
//   this.color = color;
//
//   this.draw = function() {
//     // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
//     // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
//     // eAngle	The ending angle, in radians
//     // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default...
//     //    and indicates clockwise, while true indicates counter-clockwise.
//     ctx.beginPath();
//     ctx.fillStyle = this.color;
//     ctx.strokeStyle = this.color;
//     ctx.lineWidth = 1;
//     ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
//     ctx.fill();
//     ctx.stroke();
//   } // draw
//
//   this.update = function() {
//     if (  ((this.x + this.xVel + this.r) > canvas.width) || ((this.x + this.xVel - this.r) < 0)  ) {
//       this.xVel *= -1;
//     }
//     if (  ((this.y + this.yVel + this.r) > canvas.height) || ((this.y + this.yVel - this.r) < 0)  ) {
//       this.yVel *= -1;
//     }
//     this.x += this.xVel;
//     this.y += this.yVel;
//   } // update
// } // Arc

// function ArcGroup(quantity) {
//   this.arcs = [];
//
//   this.init = function() {
//     for (var i = 0; i < quantity; i++) {
//       var randRad = getRandomIntInclusive(4, 26);
//       //  arc(x,y,radius,startAngle,endAngle);
//       this.arcs.push( new Arc(getRandomIntInclusive(randRad, canvas.width-randRad), getRandomIntInclusive(randRad, canvas.height-randRad), randRad, randColor('hex')) );
//     }
//   }
//
//   this.draw = function() {
//     for (var i = 0; i < this.arcs.length; i++) {
//       // this.arcs[i].drawErase();
//       this.arcs[i].draw();
//     }
//   }
//
//   this.update = function() {
//     for (var i = 0; i < this.arcs.length; i++) {
//       this.arcs[i].update();
//     }
//   }
// } // ArcGroup

function TxtBox(x,y,font,color) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;

  this.draw = function() {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText("Sorted!",this.x,this.y);
  }
}

function Arrow() {
  this.x1 = 0;
  this.y1 = 0;
  this.x2 = 0;
  this.x2 = 0;

  this.draw = function() {

  }
}

function Cell(x,y,r,color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.sAngle = 0;
  this.eAngle = 2 * Math.PI;
  this.color = color;

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default...
    //    and indicates clockwise, while true indicates counter-clockwise.
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);  // ctx.arc(x,y,radius,startAngle,endAngle)
    ctx.fill();
    ctx.stroke();
  } // draw

} // Cell

function Net(quantity) {
  this.cells = [];

  this.init = function() {
    for (var i = 0; i < quantity; i++) {
      var randRad = getRandomIntInclusive(4, 26);
      //  Cell(x,y,r,color)
      this.cells.push( new Cell(getRandomIntInclusive(randRad, canvas.width-randRad), // center x
                                getRandomIntInclusive(randRad, canvas.height-randRad), // center y
                                randRad, // radius
                                randColor('hex')) // color
                                );
    }
  }

  this.draw = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
  }

  this.update = function() {
    // for (var i = 0; i < this.cells.length; i++) {
    //   this.cells[i].update();
    // }
  }
} // ArcGroup

///////////////////
// HELPER FUNCTIONS
///////////////////
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}

function randSign() {
  var num = getRandomIntInclusive(1,2)
  if (num === 1) {
    return 1
  } else {
    return -1;
  }
}

function randColor(type) {
  // more muted colors example
  // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  }
  if (type === 'rgba') {
    return ( 'rgba('+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+1+')' );
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// prepare the loop to start based on current state
function aLoopInit(fps) {
  fpsInterval = (1000 / fps);  // number of milliseconds per frame
  then = window.performance.now();
  startTime = then;
  console.log(startTime);
  aLoopPause = false;
  if (myReq !== undefined) {
    cancelAnimationFrame(myReq);
  }
  myReq = requestAnimationFrame(aLoop);
}

//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function aLoop(newtime) {

  // pause
  if (aLoopPause) {
    myReq = requestAnimationFrame(aLoop);
    return;
  }

  // calc elapsed time since last loop
  now = newtime;
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      then = now - (elapsed % fpsInterval);
      clearCanvas();
      // myArcGroup.update();
  }
  // myArcGroup.draw();
  myNet.draw();
  myReq = requestAnimationFrame(aLoop);
}


//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  canvas = $('#canvas')[0];
  ctx = canvas.getContext('2d');

  $('#start').click(function() {
    console.log('loop started');
    // myArcGroup = new ArcGroup(30);
    // myArcGroup.init();
    var cellCount = $('#cell-count').val();
    console.log('cellCount = ', cellCount);
    myNet = new Net(cellCount);
    myNet.init();
    aLoopInit(60);
  });

  $('#pause').click(function() {
    console.log('loop paused');
    if (!aLoopPause) {
      aLoopPause = true;
    } else {
      aLoopPause = false;
    }
  });

  $('#reset').click(function() {
    console.log('loop reset');
    cancelAnimationFrame(myReq);
    clearCanvas();
  });

});

// really cool color pairs

// current color1 =  rgba(17,248,200,1)
// current color2 =  rgba(176,83,227,1)

// current color1 =  rgba(251,45,211,1)
// current color2 =  rgba(18,199,2,1)

// current color1 =  rgba(52,195,224,1)
// current color2 =  rgba(246,72,16,1)

// current color1 =  rgba(163,214,159,1)
// current color2 =  rgba(228,248,154,1)

// current color1 =  rgba(132,175,224,1)
// current color2 =  rgba(251,200,166,1)
