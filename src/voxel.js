
//generators
function emptyGenerator(x,y,z, res)
{
  return false;
}

function cubeGenerator(x,y,z, res)
{
  return true;
}

function sphereGenerator(x,y,z, res)
{
  //spherical implicit surface  x2+y2+z2=1
  var dim = res;
  var x = dim/2-x;
  var y = dim/2-y;
  var z = dim/2-z;

  return x*x+y*y+z*z <= dim/2*dim/2 ? 1 : 0;
}

function someImplicit(x,y,z, res)
{
  //z*z = Math.sin(z – x*x*y*y), –1 ≤ x ≤ 1, –1 ≤ y ≤ 1, 0 ≤ z ≤ 1
}

function randomGenerator(x,y,z)
{
  return Math.round(Math.random())
}


//meshers
function stupidMesher(grid, bla, baseSize)
{
  var baseSize = this.baseSize = baseSize || 15;
  var gridSize = grid.length;
  var divisions = Math.pow(gridSize, 1/3);

  var geometry = new THREE.CubeGeometry( 1, 1, 1 ); 

  for(var i=0; i<gridSize; i++)
  {
    var coord = grid.coordFromIndex(i);
    var x = coord[0];
    var y = coord[1];
    var z = coord[2];

    var voxData = grid.getFromIndex(i);
    var filled = voxData.filled;
    //console.log("x,y,z",x,y,z,"filled",voxData)

    if(filled)
    {

      /*
      var cubeGeometry = new THREE.CubeGeometry( baseSize, baseSize, baseSize ); 

      //THREE.GeometryUtils.merge(geometry, cubeGeometry);

      var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
      var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff,wireframe:true} ); 
      var cube = THREE.SceneUtils.createMultiMaterialObject( cubeGeometry, [material,material2]);

      //generator needed
      if(filled) bla.add(cube)

      var offset = (baseSize*(divisions-1))/2;
      cube.position.set(x*baseSize-offset, y*baseSize-offset, z*baseSize-offset);*/

      var cubeGeometry = new THREE.CubeGeometry( baseSize, baseSize, baseSize ); 

      var offset = (baseSize*(divisions-1))/2;
      cubeGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( x*baseSize-offset, y*baseSize-offset, z*baseSize-offset ) );
      THREE.GeometryUtils.merge(geometry,cubeGeometry);
    }
  }

   var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
      var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff,wireframe:true} ); 
      var cube = THREE.SceneUtils.createMultiMaterialObject( geometry, [material,material2]);
    bla.add(cube);

}

//meshes

function VoxelMesh(grid)
{
  this.grid = grid;
}

VoxelMesh.prototype.subtract = function( other )
{

  for(var i=0;i<other.cellIndices.length;i++)
  {
    var index = other.cellIndices[i];
    if(this.cellIndices.indexOf(index) > -1)
    {
      var cell = other.grid.getFromIndex(index);
      if(cell) cell.filled = 0;
      console.log("index",index)
    }
    
  }

  /*
  var grid = this.grid;
  var divisions = this.divisions;
  var gridSize = Math.pow(divisions,3);
  var lineSize = divisions;

  for(var i=0; i<gridSize; i++)
  {
    var curAtCoord = grid[i];
    var otherAtCoord = other.grid[i];

    if(curAtCoord.filled == 1 && otherAtCoord.filled  ==1 )
    {
      this.grid[i].filled= 0;
      this.remove( curAtCoord.mesh )
      this.grid[i].mesh = null;
    }
  }
  console.log("result grid",grid)*/
}


function Cube(grid, w,h,d, center)
{
  VoxelMesh.call( this, grid );
  this.cellIndices = [];

  var center = center || new THREE.Vector3();

  for(var k=-w/2; k<w/2; ++k)
  for(var j=-h/2; j<h/2; ++j)
  for(var i=-d/2; i<d/2; ++i){

    var x= center.x - k;
    var y= center.x - j;
    var z= center.z - i;

    var cell = grid.getAt(x,y,z);
    if(cell){ cell.filled = 1; this.cellIndices.push( grid.indexFromCoords(x,y,z) ); }
  }
}
Cube.prototype = Object.create( VoxelMesh.prototype );


function Sphere(grid, radius, center)
{
  VoxelMesh.call( this, grid );
  var center = center || new THREE.Vector3();
  //spherical implicit surface  x2+y2+z2=1
  var dim = radius;
  var n = 0;

  this.cellIndices = [];//hack!

  for(var k=-radius/2; k<radius/2; ++k)
  for(var j=-radius/2; j<radius/2; ++j)
  for(var i=-radius/2; i<radius/2; ++i, ++n) {
    //v[n] = f(i,j,k);
    var x= center.x - k;
    var y= center.x - j;
    var z= center.z - i;

    var cell = grid.getAt(x,y,z);
    var filled = bli(k,j,i);

    if(cell){ cell.filled = filled; this.cellIndices.push( grid.indexFromCoords(x,y,z) ); }
  }

  function bli(x,y,z)
  {
    return x*x+y*y+z*z <= dim/2*dim/2 ? 1 : 0;
  }
}
Sphere.prototype = Object.create( VoxelMesh.prototype );



//polygoniser

function VoxelPolygoniser(grid, mesher)
{
  var mesher = mesher || stupidMesher;
  THREE.Object3D.call( this );
  
  mesher(grid,this);
}

VoxelPolygoniser.prototype = Object.create( THREE.Object3D.prototype );

//main grid
function VoxelGrid(divisions, generator)
{
  var divisions = this.divisions = divisions || 3;
  var generator = this.generator = generator || emptyGenerator;

  var gridSize = Math.pow(divisions,3);
  this.length = gridSize;
  var grid =new Array(gridSize);

  var lineSize = divisions;

  var x=0,y=0,z=0;
  for(var i=0; i<gridSize; i++)
  {
    //console.log("x",x,"y",y,"z",z)
    var filled = generator(x,y,z, divisions);
    var index= x + divisions * (y + divisions * z);
    grid[index] = {filled:filled};

    x++;
    if(x==lineSize){x = 0; y++;}
    if(y==lineSize){y = 0; z++;}
    if(z==lineSize)z = 0;
  }
  //indexed access of 3d data in 1d array : x + WIDTH * (y + DEPTH * z)
  this.grid = grid;
}

VoxelGrid.prototype.getAt = function(x,y,z)
{
    var index= x + this.divisions * (y + this.divisions * z);
    return this.grid[index];
}

VoxelGrid.prototype.getFromIndex = function(index)
{
    return this.grid[index];
}

VoxelGrid.prototype.indexFromCoords = function(x,y,z)
{
    return (x + this.divisions * (y + this.divisions * z));
}

VoxelGrid.prototype.coordFromIndex = function(index)
{
    var divisions = this.divisions;

    var x = Math.floor( index % divisions );
    var y = Math.floor( (index/divisions) % divisions );
    var z = Math.floor( index/ (divisions * divisions) );

    //console.log("x",x,"y",y,"z",z)
    return [x,y,z]
}


/*
var geometry = new THREE.CubeGeometry( 50, 50, 50 ); 
      geometry.computeCentroids();
    	geometry.computeBoundingSphere();
      geometry.computeBoundingBox();
	    var material = new THREE.MeshLambertMaterial( {opacity:1,transparent:true,color: 0x0088ff} ); 
	    var cube = new THREE.Mesh(geometry, material);
      cube.name = "TestCube";
      cube.position.set(-100,30,30);*/

