var gl;
var t = 0;
var tPosBuff, sPosBuff;
var tColBuff;
var sColBuff;
/*
var vPosition;
var vertColor;
var projectionTLoc, modelTLoc, cameraTLoc;
*/

var house;

var tree; // drvo 
var pyramid;

var cylinder; 

var coordSys;
var grid;
var cameraY = 100;
var cameraX = 0; 
var cameraZ = 0; 

var vision_angle = 0; 

var cameraAngle = 0;
var cameraDistance = 100;

var fovy = 60;

var context; 

function setUpEventHandling(canvas){

	var angleInput = document.getElementById("angle");
	angleInput.value = fovy;

	angleInput.oninput = function(){
		fovy = angleInput.value;
	}

	canvas.onmousewheel = function (event){
		var wheel = event.wheelDelta/120;
		cameraDistance+=wheel;
		cameraDistance = Math.max(cameraDistance, 0);
		console.log(cameraDistance);
	}

	document.onkeydown = checkKey;

	function checkKey(e) {
		e = e || window.event;
    
		if (e.keyCode == '38') {
			//up
		   cameraX += 5*Math.cos(vision_angle);
		   cameraZ += 5*Math.sin(vision_angle);
		}
		else if (e.keyCode == '40') {
			//down
		   cameraX -= 5*Math.cos(vision_angle);
		   cameraZ -= 5*Math.sin(vision_angle);
		}
		else if (e.keyCode == '37') {
		   // left
       vision_angle -= 0.05; 
		}
		else if (e.keyCode == '39') {
		   // right
       vision_angle += 0.05;
		}
    else if (e.keyCode == 65) {
      cameraY += 5; 
    }
    else if (e.keyCode == 87) {
      cameraY -= 5;
    }

	}
}

window.onload = function init()
{
	var canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );

	gl.clearColor( 0.4, 1.0, 1.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	
  /*
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	projectionTLoc = gl.getUniformLocation(program, "u_proj");
	modelTLoc = gl.getUniformLocation(program, "u_model");
	cameraTLoc = gl.getUniformLocation(program, "u_camera");



	vPosition = gl.getAttribLocation( program, "vPosition" );
	vertColor = gl.getAttribLocation( program, "vertColor" );

	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vertColor );
  */
  context = createContext(gl);

	house = createHouse(gl);
  pyramid = createPyramid(gl);
	coordSys = createCoordSys(gl);
	grid = createGrid(40,40);
  tree = createTree(gl); 
  cylinder = createCylinder(gl, 0.6, 0.199, 0, 1.0);
  terrain = createCube(gl, 0, 0.6, 0.199, 1.0);

	setUpEventHandling(canvas);
	render();

};


function render() {
	gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);
	t+=0.009;

	//gl.uniformMatrix4fv(projectionTLoc, false, flatten(perspective(fovy, 1, 10, 1000)));
  movePerspective(gl, context, fovy);

	console.log(cameraDistance);
	//var modelMat;
	
  //gl.uniformMatrix4fv(cameraTLoc, false, flatten(lookAt([cameraDistance*Math.cos(cameraAngle),(cameraDistance/100)*cameraY,cameraDistance*Math.sin(cameraAngle)], [0,0,0], [0,1,0])));
  
  moveCamera(gl, context, cameraX, cameraY, cameraZ, cameraX + 5*Math.cos(vision_angle), cameraY, cameraZ + 5*Math.sin(vision_angle));
  
  /*
	modelMat = mult(translate(0, 0, 0), scalem(10, 10, 10));
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));

	//////////coordsys
	setAttributes(gl, coordSys, vPosition, vertColor);

	gl.lineWidth(2);
	gl.drawArrays(coordSys.primtype, 0, coordSys.nVerts);
  */
  drawCoordSys(gl, context, coordSys);

	////cube
	
  /*
	setAttributes(gl, cube, vPosition, vertColor);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indxBuffer);

	//var x=  0; 
	//var z=  0; 
	
	modelMat = mult(translate(x, 10, z), scalem(10,10,10));
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
	gl.drawElements(cube.primtype, cube.nIndices, gl.UNSIGNED_SHORT, 0);
  */
  drawCube(gl, context, 0, 10, 0, 10, 10, 10, 0, 0, house);
	
  /////grid
	
  /*
	modelMat = scalem(20, 20, 20);
	gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));

	setAttributes(gl, grid, vPosition, vertColor);
	gl.lineWidth(1);
	gl.drawArrays(grid.primtype, 0, grid.nVerts);
  */
  drawGrid(gl, context, grid);
  
  /*
  var step = 0.1;
  for (var angle = 0; angle < 360 + step; angle += step) 
  {
    setAttributes(gl, tree, vPosition, vertColor);
	  modelMat = mult(translate(30, 14, 30), mult(scalem(2,10,2), rotate(angle, 0, 0, -1)));
	  gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tree.indxBuffer);
    gl.drawElements(tree.primtype, tree.nIndices, gl.UNSIGNED_SHORT, 0);
  }
  
  for (var angleP = 0; angleP < 360 + step; angleP += step) 
  {
    setAttributes(gl, pyramid, vPosition, vertColor);
	  modelMat = mult(translate(30, 25, 30), mult(scalem(10,10,10), rotate(angleP, 0, 1, 0)));
	  gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramid.indxBuffer);
    gl.drawElements(pyramid.primtype, pyramid.nIndices, gl.UNSIGNED_SHORT, 0);
  }
  
  for (var angleP = 0; angleP < 360 + step; angleP += step) 
  {
    setAttributes(gl, pyramid, vPosition, vertColor);
	  modelMat = mult(translate(30, 30, 30), mult(scalem(5,10,5), rotate(angleP, 0, 1, 0)));
	  gl.uniformMatrix4fv(modelTLoc, false, flatten(modelMat));
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramid.indxBuffer);
    gl.drawElements(pyramid.primtype, pyramid.nIndices, gl.UNSIGNED_SHORT, 0);
  }*/

  //drawTree(gl, context, 30, 14, 30, 2, 10, tree);
  //drawCone(gl, context, 30, 20, 30, 10, 10, pyramid);
  //drawCone(gl, context, 30, 30, 30, 10, 10, pyramid);

  drawCylinder(gl, context, 50, 0, 50, 3, 50, 0, 0, cylinder);
  
  // draw terrain 
  drawCube(gl, context, 0, 0, 0, 1000, 0, 1000, 0, 0, terrain); 

  requestAnimFrame( render );
}
