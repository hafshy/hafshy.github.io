"use strict";

var canvas;
var cameraRotation=1;
var cameraRadius=1;

var gl;
var program;

var texCoordsArray = [];
var textures = [];
var textureIndex = 0;

var texCoord = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),
    vec2(0, 1)
];

var modelViewMatrix, projectionMatrix, normalMatrix;


var normal = vec4(0.0, 1.0, 0.0, 0.0);
var tangent = vec3(1.0, 0.0, 0.0);


var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialDiffuse = vec4( 0.7, 0.7, 0.7, 1.0 );

var instanceMatrix = mat4();

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var interval;
/* Init Bump Map */
var thetas  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var texSize = 256;

// Bump Data

var data = new Array()
for (var i = 0; i<= texSize; i++)  data[i] = new Array();
for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
    data[i][j] = rawData[i*256+j];


// Bump Map Normals

var normalst = new Array()
for (var i=0; i<texSize; i++)  normalst[i] = new Array();
for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++)
    normalst[i][j] = new Array();
for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++) {
    normalst[i][j][0] = data[i][j]-data[i+1][j];
    normalst[i][j][1] = data[i][j]-data[i][j+1];
    normalst[i][j][2] = 1;
}

// Scale to Texture Coordinates

for (var i=0; i<texSize; i++) for (var j=0; j<texSize; j++) {
    var d = 0;
    for(k=0;k<3;k++) d+=normalst[i][j][k]*normalst[i][j][k];
    d = Math.sqrt(d);
    for(k=0;k<3;k++) normalst[i][j][k]= 0.5*normalst[i][j][k]/d + 0.5;
}

// Normal Texture Array

var normals = new Uint8Array(3*texSize*texSize);

for ( var i = 0; i < texSize; i++ )
    for ( var j = 0; j < texSize; j++ )
        for(var k =0; k<3; k++)
            normals[3*texSize*i+3*j+k] = 255*normalst[i][j][k];

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function configureTexture( image ) {
    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, normals);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
    var texture2 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    var mips = [
      { size: 64, color: "rgb(128,0,255)", },
      { size: 32, color: "rgb(0,0,255)", },
      { size: 16, color: "rgb(255,0,0)", },
      { size:  8, color: "rgb(255,255,0)", },
      { size:  4, color: "rgb(0,255,0)", },
      { size:  2, color: "rgb(0,255,255)", },
      { size:  1, color: "rgb(255,0,255)", },
    ];
    mips.forEach(function(s, level) {
       var size = s.size;
       c.width = size;
       c.height = size;
       ctx.fillStyle = "rgb(255,255,255)";
       ctx.fillRect(0, 0, size, size);
       ctx.fillStyle = s.color;
       ctx.fillRect(0, 0, size / 2, size / 2);
       ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
       gl.texImage2D(gl.TEXTURE_2D, level, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    });
    textures = [
        texture1,
        texture2,
    ];
}

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 2;
var leftUpperArmId = 3;
var rightUpperArmId = 4;
var leftUpperLegId = 5;
var rightUpperLegId = 6;
var torso2Id = 7;
var headInsectId = 8;
var leftFrontId = 9;
var rightFrontId = 10;
var leftBackId = 11;
var rightBackId = 12;
var tailId = 13;
var TORSO_ID = 14;
var NECK_ID = 15;
var HEAD_ID = 16;
var HEAD1_ID = 16;
var HEAD2_ID = 25;
var LEFT_FRONT_LEG_ID = 17;
var LEFT_FRONT_FOOT_ID = 18;
var RIGHT_FRONT_LEG_ID = 19;
var RIGHT_FRONT_FOOT_ID = 20;
var LEFT_BACK_LEG_ID = 21;
var LEFT_BACK_FOOT_ID = 22;
var RIGHT_BACK_LEG_ID = 23;
var RIGHT_BACK_FOOT_ID = 24;
var GLOBAL_ANGLE_ID = 26;
var GLOBAL_X_COORDINATE = 27;
var GLOBAL_Y_COORDINATE = 28;


var torsoHeight = 7.0;
var torsoWidth = 3.0;
var upperArmHeight = 3.0;
var upperArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;
var torso2Height = 3.0;
var torso2Width = 7.0;
var insectLegWidth = 0.5;
var insectLegHeight = 3.0;
var tailWidth = 0.5;
var tailHeight = 3.0;

var lowerArmHeight = 1.0;
var lowerArmWidth = 0.5;
var lowerLegWidth = 0.5;
var lowerLegHeight = 1.0;
var neckHeight = 2.0;
var neckWidth = 1.0;


var numNodes = 28;
var numAngles = 11;
var frameOn = 0;

var theta = [0, 0, 0, 0, 0, 180, 180, 0, 0, 180, 180, 180, 180, 0, 90, 120, 90, 70, 10, 80, 10, 90, 40, 70, 30, 0, -90, 0, 0];

var knownLastIndex = 1;
  
var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);


var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

        case torsoId:

            m = rotate(theta[torsoId], 0, 1, 0 );
            figure[torsoId] = createNode( m, torso, null, headId );
            break;

        case headId:
        case head1Id:
            m = translate(0.7, torsoHeight+0.5*headHeight, 0.0);
            m = mult(m, rotate(theta[head1Id], 0, 1, 0))
            m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
            figure[head1Id] = createNode( m, head, head2Id, null);
            break;

        case head2Id:

            m = translate(-0.7, torsoHeight+0.5*headHeight, 0.0);
            m = mult(m, rotate(theta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
            figure[head2Id] = createNode( m, head, leftUpperArmId, null);
            break;


        case leftUpperArmId:

            m = translate(-1.7, 0.9*torsoHeight, 0.0);
            m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
            figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, null);
            break;

        case rightUpperArmId:

            m = translate(1.7, 0.9*torsoHeight, 0.0);
            m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
            figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, null);
            break;

        case leftUpperLegId:

            m = translate(-1.7, 0.1*upperLegHeight, 0.0);
            m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
            figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, null);
            break;

        case rightUpperLegId:

            m = translate(1.7, 0.1*upperLegHeight, 0.0);
            m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
            figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, null);
            break;

        case torso2Id:
            m = rotate(theta[torso2Id], 0, 1, 0 );
            figure[torso2Id] = createNode(m, torso2, null, headInsectId);
            break;

        case headInsectId:
            m = translate(0.0, torso2Height+0.5*headHeight, 0.5*torso2Width);
            m = mult(m, rotate(theta[headInsectId], 1, 0, 0));
            figure[headInsectId] = createNode(m, headInsect, leftFrontId, null);
            break;

        case leftFrontId:
            m = translate(-1.5, 0.5*torso2Height, 0.3*torso2Width);
            m = mult(m, rotate(theta[leftFrontId], 1, 0, 0));
            figure[leftFrontId] = createNode(m, leftFront, rightFrontId, null);
            break;

        case rightFrontId:
            m = translate(1.5, 0.5*torso2Height, 0.3*torso2Width);
            m = mult(m, rotate(theta[rightFrontId], 1, 0, 0));
            figure[rightFrontId] = createNode(m, rightFront, leftBackId, null);
            break;

        case leftBackId:
            m = translate(-1.5, 0.5*torso2Height, -0.3*torso2Width);
            m = mult(m, rotate(theta[leftBackId], 1, 0, 0));
            figure[leftBackId] = createNode(m, leftBack, rightBackId, null);
            break;

        case rightBackId:
            m = translate(1.5, 0.5*torso2Height, -0.3*torso2Width);
            m = mult(m, rotate(theta[rightBackId], 1, 0, 0));
            figure[rightBackId] = createNode(m, rightBack, tailId, null);
            break;

        case tailId:
            m = translate(0.0, 1.5*torso2Height, -0.5*torso2Width-0.5*tailWidth);
            m = mult(m, rotate(theta[tailId], 0, 0, 1));
            figure[tailId] = createNode(m, tail, null, null);
            break;


        case TORSO_ID:
            m = rotate(theta[GLOBAL_ANGLE_ID], 0, 0, 1);
            m = mult(m, rotate(theta[TORSO_ID], 0, 1, 0));
            figure[TORSO_ID] = createNode(m, torso3, null, NECK_ID);
            break;
          
            case NECK_ID:
              m = translate(0.0, torsoHeight - neckHeight + 3.5, 0.0);
              m = mult(m, rotate(theta[NECK_ID], 1, 0, 0))
              m = mult(m, rotate(theta[HEAD2_ID], 0, 1, 0));
              m = mult(m, translate(0.0, -1 * neckHeight, 0.0));
              figure[NECK_ID] = createNode(m, neck3, LEFT_FRONT_LEG_ID, HEAD_ID);
              break;
        
            case HEAD_ID:
            case HEAD1_ID:
            case HEAD2_ID:
        
              m = translate(0.0, 0.2 * headHeight, 0.0);
              m = mult(m, rotate(theta[HEAD1_ID], 1, 0, 0))
              //  m = mult(m, rotate(theta[HEAD2_ID], 0, 1, 0));
              m = mult(m, translate(0.0, -0.8 * headHeight, 0.0));
              //figure[HEAD_ID] = createNode(m, head, LEFT_FRONT_LEG_ID, null);
              figure[HEAD_ID] = createNode(m, head3, null, null);
              break;
            case LEFT_FRONT_LEG_ID:
        
              m = translate(-(torsoWidth / 3 + upperArmWidth), 0.9 * torsoHeight, 0.0);
              m = mult(m, rotate(theta[LEFT_FRONT_LEG_ID], 1, 0, 0));
              figure[LEFT_FRONT_LEG_ID] = createNode(m, leftUpperArm3, RIGHT_FRONT_LEG_ID, LEFT_FRONT_FOOT_ID);
              break;
        
            case RIGHT_FRONT_LEG_ID:
        
              m = translate(torsoWidth / 3 + upperArmWidth, 0.9 * torsoHeight, 0.0);
              m = mult(m, rotate(theta[RIGHT_FRONT_LEG_ID], 1, 0, 0));
              figure[RIGHT_FRONT_LEG_ID] = createNode(m, rightUpperArm3, LEFT_BACK_LEG_ID, RIGHT_FRONT_FOOT_ID);
              break;
        
            case LEFT_BACK_LEG_ID:
        
              m = translate(-(torsoWidth / 3 + upperLegWidth), 0.1 * upperLegHeight, 0.0);
              m = mult(m, rotate(theta[LEFT_BACK_LEG_ID], 1, 0, 0));
              figure[LEFT_BACK_LEG_ID] = createNode(m, leftUpperLeg3, RIGHT_BACK_LEG_ID, LEFT_BACK_FOOT_ID);
              break;
        
            case RIGHT_BACK_LEG_ID:
        
              m = translate(torsoWidth / 3 + upperLegWidth, 0.1 * upperLegHeight, 0.0);
              m = mult(m, rotate(theta[RIGHT_BACK_LEG_ID], 1, 0, 0));
              figure[RIGHT_BACK_LEG_ID] = createNode(m, rightUpperLeg3, null, RIGHT_BACK_FOOT_ID);
              break;
        
            case LEFT_FRONT_FOOT_ID:
        
              m = translate(0.0, upperArmHeight, 0.0);
              m = mult(m, rotate(theta[LEFT_FRONT_FOOT_ID], 1, 0, 0));
              figure[LEFT_FRONT_FOOT_ID] = createNode(m, leftLowerArm3, null, null);
              break;
        
            case RIGHT_FRONT_FOOT_ID:
        
              m = translate(0.0, upperArmHeight, 0.0);
              m = mult(m, rotate(theta[RIGHT_FRONT_FOOT_ID], 1, 0, 0));
              figure[RIGHT_FRONT_FOOT_ID] = createNode(m, rightLowerArm3, null, null);
              break;
        
            case LEFT_BACK_FOOT_ID:
        
              m = translate(0.0, upperLegHeight, 0.0);
              m = mult(m, rotate(theta[LEFT_BACK_FOOT_ID], 1, 0, 0));
              figure[LEFT_BACK_FOOT_ID] = createNode(m, leftLowerLeg3, null, null);
              break;
        
            case RIGHT_BACK_FOOT_ID:
        
              m = translate(0.0, upperLegHeight, 0.0);
              m = mult(m, rotate(theta[RIGHT_BACK_FOOT_ID], 1, 0, 0));
              figure[RIGHT_BACK_FOOT_ID] = createNode(m, rightLowerLeg3, null, null);
              break;
    }

}

function traverse(Id) {

    if(Id == null) return;
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function torso2() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, torso2Height, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 0.5*torso2Width, torso2Height, torso2Width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function headInsect() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, headHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 2*headWidth, 2*headHeight, 2*headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftFront() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2*insectLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( insectLegWidth, insectLegHeight, insectLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightFront() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2*insectLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( insectLegWidth, insectLegHeight, insectLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftBack() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2*insectLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( insectLegWidth, insectLegHeight, insectLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightBack() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2*insectLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( insectLegWidth, insectLegHeight, insectLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.2*tailHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( tailWidth, tailHeight, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}


function torso3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function head3() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function neck3() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(neckWidth, neckHeight, neckWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function leftUpperArm3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function leftLowerArm3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function rightUpperArm3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function rightLowerArm3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function leftUpperLeg3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function leftLowerLeg3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function rightUpperLeg3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }
  
  function rightLowerLeg3() {
  
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
  }




function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

var shading = true;

var canvas;

window.onload = function init() {

    canvas = document.getElementById('webgl-canvas');
    gl = glUtils.getWebGl(canvas);

    cube();

    if (document.getElementById("select").value == "object1") {
        textureIndex = 0;
    } else if (document.getElementById("select").value == "object2") {
        textureIndex = 1;
    }
    configureTexture(normals);
    input();
    render();
}


var render = function() {
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!shading){
        program = glUtils.createShaderProgram(gl, glUtils.createVertexShader(gl, "None"), glUtils.createFragmentShader(gl, "None"));
    } else{
        program = glUtils.createShaderProgram(gl, glUtils.createVertexShader(gl), glUtils.createFragmentShader(gl));
    }
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    var eye = vec3(2.0, 1.0*(1.0+Math.cos(phi)) , 2.0);
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);

    let cameraMatrix = rotateY(generalUtils.degreeToRadian(cameraRotation)); 
    cameraMatrix = mult(cameraMatrix, translate(0.0, 0.0, cameraRadius * 1.5));
    modelViewMatrix = mult(lookAt(eye, at, up), inverse(cameraMatrix));

    projectionMatrix = ortho(-17.0, 17.0, -11.0, 14.0, -17.0, 17.0);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")
    for(i=0; i<numNodes; i++) initNodes(i);

    

    if (shading){
        if (document.getElementById("select").value == "object1") {
            textureIndex = 0;
        } else if (document.getElementById("select").value == "object2") {
            textureIndex = 1;
        }
        
        var tBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

        var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
        gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);

        configureTexture(normals);

        var diffuseProduct = mult(lightDiffuse, materialDiffuse);

        gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct));
        gl.uniform4fv( gl.getUniformLocation(program, "normal"),flatten(normal));
        gl.uniform3fv( gl.getUniformLocation(program, "objTangent"),flatten(tangent));

        var lightPosition = vec4(0.0, 2.0, 0.0, 1.0 );

        lightPosition[1] = 2.0*Math.cos(thetas);
        gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition));

        var normalMatrix = [
            vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
            vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
            vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
        ];

        gl.bindTexture(gl.TEXTURE_2D, textures[textureIndex]);

        gl.uniformMatrix3fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
    if (document.getElementById("select").value == "object1") {
        traverse(torsoId);
    } else if (document.getElementById("select").value == "object2") {
        traverse(torso2Id);
    } else {
        traverse(TORSO_ID)
    }
    requestAnimFrame(render);
}

function stopInterval(interval) {
    clearInterval(interval);
}

const saveData = (function () { 
    var a = document.createElement("a"); 
    document.body.appendChild(a); 
    a.style = "display: none";
    return function () { 
        var json = JSON.stringify({inputValue: inputValue }),
            blob = new Blob([json], {type: "application/json"}), 
            url = window.URL.createObjectURL(blob);
        a.href = url; 
        a.download = "articulated";
        a.click(); 
        window.URL.revokeObjectURL(url); 
    }; 
}());

var time = 0;
const animation = () =>{
    if (time == 100){
        reset();
        for(i=0; i<numNodes; i++) initNodes(i);
        time = 0;
        return;
    }
    else {
        time += 1;
        animate(time);
    }
}

const animate = (time) => {
    theta[head1Id] += time/10;
    initNodes(head1Id);
    theta[head2Id] -= time/10;
    initNodes(head2Id);
    theta[leftUpperArmId] += time/3;
    initNodes(leftUpperArmId);
    theta[rightUpperArmId] += time/3;
    initNodes(rightUpperArmId);
    theta[leftUpperLegId] += time/3;
    initNodes(leftUpperLegId);
    theta[rightUpperLegId] += time/3;
    initNodes(rightUpperLegId);
    setTimeout(animation, 100);
}
