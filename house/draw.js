
function createContext(gl)
{
  
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	var projectionTLoc = gl.getUniformLocation(program, "u_proj");
	var modelTLoc = gl.getUniformLocation(program, "u_model");
	var cameraTLoc = gl.getUniformLocation(program, "u_camera");

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	var vertColor = gl.getAttribLocation( program, "vertColor" );

	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vertColor );

  return {
    program: program,
    projection: projectionTLoc,
    model: modelTLoc,
    camera: cameraTLoc,

    vPosition: vPosition,
    vertColor: vertColor,
  };
}

function drawCube(gl, context, x0, y0, z0, a, b, c, anglex, angley, cube_attrs) {

	setAttributes(gl, cube_attrs, context.vPosition, context.vertColor);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube_attrs.indxBuffer);
  var rotationMat = mult(rotate(angley, 0, 1, 0), rotate(anglex, 1, 0, 0));
  var TR = mult(translate(x0, y0, z0), rotationMat);

	var modelMat = mult(TR, scalem(a,b,c));
	gl.uniformMatrix4fv(context.model, false, flatten(modelMat));
	gl.drawElements(cube_attrs.primtype, cube_attrs.nIndices, gl.UNSIGNED_SHORT, 0);
}

function drawCylinder(gl, context, x0, y0, z0, a, h, anglex, angley, cylinder_attrs) {

	setAttributes(gl, cylinder_attrs, context.vPosition, context.vertColor);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder_attrs.indxBuffer);

  var rotationMat = mult(rotate(angley, 0, 1, 0), rotate(anglex, 1, 0, 0));
  var TR = mult(translate(x0, y0, z0), rotationMat);

	var modelMat = mult(TR, scalem(a,h,a));
	gl.uniformMatrix4fv(context.model, false, flatten(modelMat));
	gl.drawElements(cylinder_attrs.primtype, cylinder_attrs.nIndices, gl.UNSIGNED_SHORT, 0);
}

function drawGrid(gl, context,  grid_attrs) 
{
	var modelMat = scalem(20, 20, 20);
	gl.uniformMatrix4fv(context.model, false, flatten(modelMat));

	setAttributes(gl, grid_attrs, context.vPosition, context.vertColor);
	gl.lineWidth(1);
	gl.drawArrays(grid_attrs.primtype, 0, grid_attrs.nVerts);
}

function drawCoordSys(gl, context, cs_attrs) 
{
	var modelMat = mult(translate(0, 0, 0), scalem(10, 10, 10));
	gl.uniformMatrix4fv(context.model, false, flatten(modelMat));

	//////////coordsys
	setAttributes(gl, cs_attrs, context.vPosition, context.vertColor);

	gl.lineWidth(2);
	gl.drawArrays(cs_attrs.primtype, 0, cs_attrs.nVerts);
}

function drawTree(gl, context, x, y, z, a, h, tree) 
{

  var step = 0.1;
  for (var angle = 0; angle < 360 + step; angle += step) 
  {
    setAttributes(gl, tree, context.vPosition, context.vertColor);
	  var modelMat = mult(translate(x, y, z), mult(scalem(a,h,a), rotate(angle, 0, 0, -1)));
	  gl.uniformMatrix4fv(context.model, false, flatten(modelMat));
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tree.indxBuffer);
    gl.drawElements(tree.primtype, tree.nIndices, gl.UNSIGNED_SHORT, 0);
  }
}

function drawCone(gl, context, x, y, z, a, h, cone) 
{
  var step = 0.1;
  for (var angleP = 0; angleP < 360 + step; angleP += step) 
  {
    setAttributes(gl, cone, context.vPosition, context.vertColor);
	  modelMat = mult(translate(x, y, z), mult(scalem(a,h,a), rotate(angleP, 0, 1, 0)));
	  gl.uniformMatrix4fv(context.model, false, flatten(modelMat));
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cone.indxBuffer);
    gl.drawElements(cone.primtype, cone.nIndices, gl.UNSIGNED_SHORT, 0);
  }
}

function movePerspective(gl, context, fovy) 
{
	gl.uniformMatrix4fv(context.projection, false, flatten(perspective(fovy, 1, 10, 1000)));
}

function moveCamera(gl, context, x, y, z, lx, ly, lz) 
{
  gl.uniformMatrix4fv(context.camera, false, flatten(lookAt([x,y,z], [lx,ly,lz], [0,1,0])));
}

