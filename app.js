

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

function TxtBox(x,y,fontSize,color,str,cellIndex) {
  // aprox center for text above cell
  // (x == 2 ? "yes" : "no")
  this.x = ( (cellIndex > 9) ? (x-2) : (x+1) );
  this.y = y;
  this.fontSize = fontSize;
  this.font = fontSize.toString() + "px Courier";
  this.color = color;
  this.str = str;

  this.draw = function() {
    // black number
    ctx.fillStyle = this.color;
    ctx.fillText(this.str,this.x,this.y);
  }
}

function Arrow(cellIndex1, cellIndex2) {
  this.ind1 = cellIndex1;
  this.ind2 = cellIndex2;
  this.x1 = myNet.cells[cellIndex1].x;
  this.y1 = myNet.cells[cellIndex1].y;
  this.x2 = myNet.cells[cellIndex2].x;
  this.y2 =  myNet.cells[cellIndex2].y;
  this.color = myNet.cells[cellIndex1].color;
  this.xxx1;
  this.yyy1;
  this.xxx2;
  this.yyy2;

  this.draw = function() {
    // ctx.beginPath();
    // ctx.strokeStyle = this.color;
    // ctx.lineWidth = 1;
    // ctx.moveTo(this.x1,this.y1);
    // ctx.lineTo(this.x2,this.y2);
    // ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.moveTo(this.xxx1,this.yyy1);
    ctx.lineTo(this.xxx2,this.yyy2);
    ctx.stroke();
  } // draw

  this.update = function() {
    this.x1 += myNet.cells[this.ind1].xVel;
    this.y1 += myNet.cells[this.ind1].yVel;
    this.x2 += myNet.cells[this.ind2].xVel;
    this.y2 += myNet.cells[this.ind2].yVel;
    this.setLinePair();
  } // update

  // calculate the (x1 y1) (x2 y2) start and finish coords of the arrow
  this.setLinePair = function() {
    var tRad;
    if ( (this.x1 <= this.x2) && (this.y1 <= this.y2) ) {  // c0 left and above c1
      // console.log(this.ind1 + " left and above " + this.ind2);
      tRad = Math.atan( Math.pow(this.x2-this.x1,2) + Math.pow(this.y2-this.y1,2) );
      this.xxx1 = this.x1 + ( Math.cos(tRad) * (myNet.cells[this.ind1].r) );
      this.yyy1 = this.y1 + ( Math.sin(tRad) * (myNet.cells[this.ind1].r) );
      this.xxx2 = ( Math.cos(tRad) * (myNet.cells[this.ind2].r) ) + this.x2;
      this.yyy2 = ( Math.cos(tRad) * (myNet.cells[this.ind2].r) ) + this.y2;
      // this.xxx2 = this.x2 - (this.xxx1 - this.x1);
      // this.yyy2 = this.y2 - (this.yyy1 - this.y1);
    } else if ( (this.x1 <= this.x2) && (this.y1 >= this.y2) ) {  // c0 left and below c1
      // console.log(this.ind1 + " left and below " + this.ind2);
      tRad = Math.atan( Math.pow(this.x2-this.x1,2) + Math.pow(this.y1-this.y2,2) );
      this.xxx1 = ( Math.cos(tRad) * (myNet.cells[this.ind1].r) ) + this.x1;
      this.yyy1 = this.y1 - ( Math.sin(tRad) * (myNet.cells[this.ind1].r) );
      this.xxx2 = this.x2 - (this.xxx1 - this.x1);
      this.yyy2 = this.y2 + (this.yyy1 - this.y1);
    } else if ( (this.x1 >= this.x2) && (this.y1 <= this.y2) ) {  // c0 right and above c1
      // console.log(this.ind1 + " right and above " + this.ind2);
      tRad = Math.atan( Math.pow(this.x1-this.x2,2) + Math.pow(this.y2-this.y1,2) );
      this.xxx1 = this.x1 - ( Math.cos(tRad) * (myNet.cells[this.ind1].r) );
      this.yyy1 = ( Math.sin(tRad) * (myNet.cells[this.ind1].r) ) + this.y1;
      this.xxx2 = this.x2 + (this.x1 - this.xxx1);
      this.yyy2 = this.y2 - (this.yyy1 - this.y1);
    } else if ( (this.x1 >= this.x2) && (this.y1 >= this.y2) ) {  // c0 right and below c1
      // console.log(this.ind1 + " right and below " + this.ind2);
      tRad = Math.atan( Math.pow(this.x1-this.x2,2) + Math.pow(this.y1-this.y2,2) );
      this.xxx1 = this.x1 - ( Math.cos(tRad) * (myNet.cells[this.ind1].r) );
      this.yyy1 = this.y1 - ( Math.sin(tRad) * (myNet.cells[this.ind1].r) );
      this.xxx2 = this.x2 + (this.x1 - this.xxx1);
      this.yyy2 = this.y2 - (this.y1 - this.yyy1);
    } else {
      console.log('getLinePair error');
    } // if
  } // setLinePair
} // Arrow

function Cell(x,y,r,color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.sAngle = 0;
  this.eAngle = 2 * Math.PI;
  this.color = color;
  this.xVel = getRandomIntInclusive(1,2)*randSign(); // rand speed and direction
  this.yVel = getRandomIntInclusive(1,2)*randSign(); // rand speed and direction
  this.txt = undefined;
  this.arrows = [];
  // arrow width = cell.internalCoeff * cell.linkCoeff
  // this.internalCoeff = 0;  single number for strength of outgoing signal

  this.init = function(index) {
    // TxtBox(x,y,font,color)
    this.txt = new TxtBox(this.x-4,this.y-this.r-5,16,myColors.black,index.toString(),index);
    // just make one relationship (arrow)
    var pair = myNet.getRandIndex(index);
    this.arrows.push(new Arrow(pair[0], pair[1]));
  }

  this.draw = function() {
    this.arrows.forEach(a => {
      a.draw();
    });
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default...
    //    and indicates clockwise, while true indicates counter-clockwise.
    ctx.beginPath();
    // ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);  // ctx.arc(x,y,radius,startAngle,endAngle)
    // ctx.fill();
    ctx.stroke();
    // draw all arrows
    this.txt.draw();
  } // draw

    this.update = function() {
      // check cell bounds on canvas edges
      if (  ((this.x + this.xVel + this.r) > canvas.width) || ((this.x + this.xVel - this.r) < 0)  ) {
        this.xVel *= -1;
      }
      if (  ((this.y + this.yVel + this.r) > canvas.height) || ((this.y + this.yVel - this.r) < 0)  ) {
        this.yVel *= -1;
      }
      // change cell position
      this.x += this.xVel;
      this.y += this.yVel;
      // update txt txt label
      this.txt.x += this.xVel;
      this.txt.y += this.yVel;
      // update arrow positions
      this.arrows.forEach(tmpArrow => {
        tmpArrow.update();
      });
    } // update
} // Cell

function Net(quantity) {
  this.cells = [];

  this.init = function() {
    // fill with new cells
    for (var i = 0; i < quantity; i++) {
      var randRad = getRandomIntInclusive(4, 26);
      //  Cell(x,y,r,color)
      var tmpCell = new Cell( getRandomIntInclusive(randRad, canvas.width-randRad), // center x
                              getRandomIntInclusive(randRad, canvas.height-randRad), // center y
                              randRad, // radius
                              randColor('hex') // color
                            );
      this.cells.push(tmpCell);
    } // fill this.cells
    // init all new cells
    for (var j = 0; j < this.cells.length; j++) {
      this.cells[j].init(j);
    }
  } // init
  // get random cell index to draw an arrow to
  this.getRandIndex = function(cIndex) {
    var ind;
    while (true) {
      ind = getRandomIntInclusive(0,this.cells.length-1);
      if (ind !== cIndex) {
        break;
      }
    }
    return { 0: cIndex, 1: ind };
  } // getRandIndex
  // returns random unique pair of cells to draw an arrow between
  // this.getRandPair = function() {
  //   var index1,
  //       index2;
  //   while (true) {
  //     index1 = getRandomIntInclusive(0,this.cells.length-1);
  //     index2 = getRandomIntInclusive(0,this.cells.length-1);
  //     if (index1 !== index2) {
  //       break;
  //     }
  //   }
  //   return { 0: index1,
  //            1: index2 };
  // }
  this.draw = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
  } // draw
  this.update = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].update();
    }
  } // update
} // Net

// prepare the loop to start based on current state
function aLoopInit(fps) {
  fpsInterval = (1000 / fps);  // number of milliseconds per frame
  then = window.performance.now();
  startTime = then;
  // console.log(startTime);
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
      // myArcGroup.update();
      myNet.update();
  }
  clearCanvas();
  myNet.draw();
  myReq = requestAnimationFrame(aLoop);
}

///////////////////
// HELPER FUNCTIONS
///////////////////
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}

function randSign() {
  var num = getRandomIntInclusive(1,2)
  return (num === 1) ? (1) : (-1);

  // if (num === 1) {
  //   return 1
  // } else {
  //   return -1;
  // }

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
    clearCanvas();
    var cellCount = $('#cell-count').val();
    myNet = new Net(cellCount);
    myNet.init();
    aLoopInit(30);
  });

  $('#pause').click(function() {
    console.log('loop paused');
    if (!aLoopPause) {
      aLoopPause = true;
    } else {
      aLoopPause = false;
    }
    console.log('randSign = ', randSign());
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
