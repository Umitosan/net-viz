/*jshint esversion: 6 */

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
};

function TxtBox(x,y,fontSize,color,str,cellIndex) {
  // aprox center for cell's txt TxtBox
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
  };
}

function Arrow(cellIndex1, cellIndex2) {
  this.ind1 = cellIndex1;
  this.ind2 = cellIndex2;
  this.color = myNet.cells[cellIndex1].color;
  this.xxx1;
  this.yyy1;
  this.xxx2;
  this.yyy2;
  this.quadrant = 1;
  this.tRad;

  this.draw = function() {
    // draw main body of arrow
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.moveTo(this.xxx1,this.yyy1);
    ctx.lineTo(this.xxx2,this.yyy2);
    ctx.stroke();
    this.drawHead();
  }; // draw

  // draw the head of the arrow (2 small lines)
  this.drawHead = function() {
    var xoff1,yoff1,xoff2,yoff2;
    var length = 20;
    var x1Angle = Math.cos(this.tRad+Math.PI/10);
    var y1Angle = Math.sin(this.tRad+Math.PI/10);
    var x2Angle = Math.cos(this.tRad-Math.PI/10);
    var y2Angle = Math.sin(this.tRad-Math.PI/10);

    switch (this.quadrant) {
      case 1: // quadrant 1
        xoff1 = x1Angle * length; yoff1 = y1Angle * length;
        xoff2 = x2Angle * length; yoff2 = y2Angle * length;
        break;
      case 2: // quadrant 2
        xoff1 = -1*x1Angle*length; yoff1 = y1Angle*length;
        xoff2 = -1 * x2Angle * length; yoff2 = y2Angle * length;
        break;
      case 3: // quadrant 3
        xoff1 = -1 * x1Angle * length; yoff1 = -1 * y1Angle * length;
        xoff2 = -1 * x2Angle * length; yoff2 = -1 * y2Angle * length;
        break;
      case 4: // quadrant 4
        xoff1 = x1Angle * length; yoff1 = -1 * y1Angle * length;
        xoff2 = x2Angle * length; yoff2 = -1 * y2Angle * length;
        break;
      default:
        console.log('no quadrant found');
        break;
    }
    // arrow head line 1
    ctx.beginPath();
    ctx.moveTo(this.xxx2,this.yyy2);
    ctx.lineTo(this.xxx2+xoff1,this.yyy2+yoff1);
    ctx.stroke();
    // arrow head line 2
    ctx.beginPath();
    ctx.moveTo(this.xxx2,this.yyy2);
    ctx.lineTo(this.xxx2+xoff2,this.yyy2+yoff2);
    ctx.stroke();
  };

  this.update = function() {
    var x1 = myNet.cells[this.ind1].x;
    var y1 = myNet.cells[this.ind1].y;
    var r1 = myNet.cells[this.ind1].r;
    var x2 = myNet.cells[this.ind2].x;
    var y2 = myNet.cells[this.ind2].y;
    var r2 = myNet.cells[this.ind2].r;
    // calculate the (x1 y1) (x2 y2) start and finish coords of the arrow
    //   so that the line attachs to the correct location on the cell wall
    if ( (x1 <= x2) && (y1 <= y2) ) {  // c0 left and above c1
      this.quadrant = 3;
      this.tRad = Math.atan( (y2-y1) / (x2-x1) );
      this.xxx1 = x1 + ( Math.cos(this.tRad ) * (r1) );
      this.yyy1 = y1 + ( Math.sin(this.tRad ) * (r1) );
      this.xxx2 = x2 - ( Math.cos(this.tRad ) * (r2) );
      this.yyy2 = y2 - ( Math.sin(this.tRad ) * (r2) );
    } else if ( (x1 <= x2) && (y1 >= y2) ) {  // c0 left and below c1
      this.quadrant = 2;
      this.tRad  = Math.atan( (y1-y2) / (x2-x1));
      this.xxx1 = x1 + ( Math.cos(this.tRad ) * (r1) );
      this.yyy1 = y1 - ( Math.sin(this.tRad ) * (r1) );
      this.xxx2 = x2 - ( Math.cos(this.tRad ) * (r2) );
      this.yyy2 = y2 + ( Math.sin(this.tRad ) * (r2) );
    } else if ( (x1 >= x2) && (y1 <= y2) ) {  // c0 right and above c1
      this.quadrant = 4;
      this.tRad  = Math.atan( (y2-y1) / (x1-x2) );
      this.xxx1 = x1 - ( Math.cos(this.tRad ) * (r1) );
      this.yyy1 = y1 + ( Math.sin(this.tRad ) * (r1) );
      this.xxx2 = x2 + ( Math.cos(this.tRad ) * (r2) );
      this.yyy2 = y2 - ( Math.sin(this.tRad ) * (r2) );
    } else if ( (x1 >= x2) && (y1 >= y2) ) {  // c0 right and below c1
      this.quadrant = 1;
      this.tRad  = Math.atan( (y1-y2) / (x1-x2) );
      this.xxx1 = x1 - ( Math.cos(this.tRad ) * (r1) );
      this.yyy1 = y1 - ( Math.sin(this.tRad ) * (r1) );
      this.xxx2 = x2 + ( Math.cos(this.tRad ) * (r2) );
      this.yyy2 = y2 + ( Math.sin(this.tRad ) * (r2) );
    } else {
      console.log("arrow update error");
      console.log("x1 y1 x2 y2: "+x1+" "+y1+" "+x2+" "+y2);
    } // if
    // console.log('circle: '+this.ind1+' xxx1: '+this.xxx1+' y1: '+this.yyy1+' x2: '+this.xxx2+' y2: '+this.yyy2);
  }; // update
} // Arrow

function Cell(x,y,r,color,thickness = 3) {
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
  this.thick = thickness;
  // arrow width = cell.internalCoeff * cell.linkCoeff
  // this.internalCoeff = 0;  single number for strength of outgoing signal

  this.init = function(index) {
    // make 0 - 3 arrows
    for ( var j = 0; j < getRandomIntInclusive(0,3); j++ ) {
      var pair = myNet.getRandIndex(index);
      this.arrows.push(new Arrow(pair[0], pair[1]));
    }
    // make cells thicker and larger the more outgoing connections they have
    this.r = 10 + (4 * this.arrows.length);
    this.thick = 1 + this.arrows.length;
    // calc x and y making sure it's in bounds
    this.x = getRandomIntInclusive(this.r, canvas.width-this.r);
    this.y = getRandomIntInclusive(this.r, canvas.height-this.r);
    // TxtBox(x,y,font,color)
    this.txt = new TxtBox(this.x-4,this.y-this.r-5,16,myColors.black,index.toString(),index);
  };

  this.draw = function() {
    this.arrows.forEach(function(a) {
      a.draw();
    });
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default...
    //    and indicates clockwise, while true indicates counter-clockwise.
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thick;
    ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);  // ctx.arc(x,y,radius,startAngle,endAngle)
    ctx.stroke();
    // draw all arrows
    this.txt.draw();
  }; // draw

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
    }; // update
} // Cell

function Net(quantity) {
  this.cells = [];

  this.init = function() {  // fill with new cells
    for (var i = 0; i < quantity; i++) {
      // var randRad = getRandomIntInclusive(4, 45);
      //  Cell(x,y,r,color,thickness)
      var tmpCell = new Cell( getRandomIntInclusive(20, canvas.width-20), // center x
                              getRandomIntInclusive(20, canvas.height-20), // center y
                              10, // radius
                              randColor('hex'), // color
                              1  // thickness
                            );
      this.cells.push(tmpCell);
    } // fill this.cells
    // init all new cells
    for (var j = 0; j < this.cells.length; j++) {
      this.cells[j].init(j);
    }
  }; // init
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
  }; // getRandIndex
  this.draw = function() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].draw();
    }
  }; // draw
  this.update = function() {
    // cells first to get locations
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].update();
    }
    // arrows musst be updated separately to gather all new cell positions
    for (var j = 0; j < this.cells.length; j++) {
      // update arrow positions
      this.cells[j].arrows.forEach(function(a) {
        a.update();
      });
    }
  }; // update
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
  myNet.update(); // establish correct starting points
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
  var num = getRandomIntInclusive(1,2);
  return (num === 1) ? (1) : (-1);
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
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  canvas = $('#canvas')[0];
  ctx = canvas.getContext('2d');
  $("#output-msg").hide();

  $('#start').click(function() {
    var cellCount = parseInt($('#cell-count').val());
    if ( (cellCount >= 2) && (cellCount <= 1000) ) {
      console.log('loop started');
      clearCanvas();
      myNet = new Net(cellCount);
      myNet.init();
      aLoopInit(40);  // aLoopInit(fps)
    }
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

  // $('#file-xml').change(function() {
  //   var filePath = $('#file-xml')[0].path();
  //   console.log('file-xml = ', filePath);
  // });

  $('#submit-btn').click(function() {
    $("#output-msg").show();
    var myFile = $('#file-xml')[0].files[0];
    console.log("file recieved: ", myFile);
    // $('#output-xml').load("/seeds/"+myFile.name);
    $.get("/seeds/"+myFile.name, function(str) {
      console.log("data = ", str);
      console.log("typeof data = ", typeof str);
      $('#output-xml').html(str);

    }, 'text');
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
