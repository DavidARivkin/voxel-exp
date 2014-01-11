
//generators
function cubeGenerator(x,y,z, size)
{
  return true;
}

function randomGenerator(x,y,z)
{
  return Math.round(Math.random())
}

//meshers
function stupidMesher(grid)
{
  /*
  var gridSize = grid.length;

  for(var i=0; i<gridSize; i++)
  {
    var curAtCoord = grid[i];

    if(filled)
    {
      var cubeGeometry = new THREE.CubeGeometry( baseSize, baseSize, baseSize ); 
      var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
      var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff,wireframe:true} ); 
      var cube = THREE.SceneUtils.createMultiMaterialObject( cubeGeometry, [material,material2]);

      //generator needed
      if(filled) this.add(cube);

      var offset = (baseSize*(divisions-1))/2;
      cube.position.set(x*baseSize-offset, y*baseSize-offset, z*baseSize-offset);
    }
  }*/

}

function VoxelMesh(divisions, baseSize, generator)
{
  var divisions = this.divisions = divisions || 3;
  var baseSize = this.baseSize = baseSize || 25;
  var generator = this.generator = generator || randomGenerator;

  THREE.Object3D.call( this );

  var gridSize = Math.pow(divisions,3);
  var grid =new Array(gridSize);

  var lineSize = divisions;

  var x=0,y=0,z=0;
  for(var i=0; i<gridSize; i++)
  {
    //console.log("x",x,"y",y,"z",z)
    var filled = generator(x,y,z);
    var index= x + divisions * (y + divisions * z);
    grid[index] = {filled:filled, mesh:cube};

    if(filled)
    {
      var cubeGeometry = new THREE.CubeGeometry( baseSize, baseSize, baseSize ); 
      var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
      var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff,wireframe:true} ); 
      var cube = THREE.SceneUtils.createMultiMaterialObject( cubeGeometry, [material,material2]);

      //generator needed
      if(filled) this.add(cube);

      var offset = (baseSize*(divisions-1))/2;
      cube.position.set(x*baseSize-offset, y*baseSize-offset, z*baseSize-offset);
    }

    x++;
    if(x==lineSize){x = 0; y++;}
    if(y==lineSize){y = 0; z++;}
    if(z==lineSize)z = 0;
  }
  //indexed access of 3d data in 1d array : x + WIDTH * (y + DEPTH * z)

 console.log("grid",grid)
  this.grid = grid;
}
VoxelMesh.prototype = Object.create( THREE.Object3D.prototype );

VoxelMesh.prototype.getAt = function(x,y,z)
{
    var index= x + this.divisions * (y + this.divisions * z);
    this.grid[index];
}

VoxelMesh.prototype.coordFromLinearIndex = function(i)
{
    var index= x + this.divisions * (y + this.divisions * z);
    -x = -index + this.divisions * (y + this.divisions * z);
}

VoxelMesh.prototype.subtract = function( other )
{
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
  console.log("result grid",grid)
}

VoxelMesh.prototype.translate = function( x )
{

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

