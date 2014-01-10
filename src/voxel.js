
//generators
function cubeGenerator(x,y,z)
{
  return true;
}

function randomGenerator(x,y,z)
{
  return Math.round(Math.random())
}

//meshers
function stupidMesher()
{

}

function VoxelMesh(divisions, baseSize, generator)
{
  var divisions = this.divisions = divisions || 3;
  var baseSize = this.baseSize = baseSize || 25;
  var generator = this.generator = generator || randomGenerator;

  THREE.Object3D.call( this );

  /*
  var grid = [];
  for(var i= 0; i<divisions*divisions*divisions; i++)
  {
    var x,y,z;

    grid[];
  }*/

  var grid = new Array(divisions);

  for(var i=0;i<divisions;i++)
  {
    grid[i] = new Array(divisions);
    
    for(var j=0;j<divisions;j++)
    {
      grid[i][j] = new Array(divisions);
      for(var k=0;k<divisions;k++)
      {
        var filled = generator(i,j,k);

        var cubeGeometry = new THREE.CubeGeometry( baseSize, baseSize, baseSize ); 
        var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
        var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff,wireframe:true} ); 
        var cube = THREE.SceneUtils.createMultiMaterialObject( cubeGeometry, [material,material2]);

        //generator needed
        var filled = generator(i,j,k);
        if(filled) this.add(cube);

        var offset = (baseSize*divisions)/2+baseSize;
        cube.position.set(i*baseSize, j*baseSize, k*baseSize);

        grid[i][j][k] = {filled:filled, mesh:cube};

      }
    }
  }

  console.log("grid",grid)
  this.grid = grid;
  

  //TODO: switch to linear iteration
}
VoxelMesh.prototype = Object.create( THREE.Object3D.prototype );

VoxelMesh.prototype.subtract = function( other )
{
  var divisions = this.divisions;
  for(var i=0;i<divisions;i++)
  {
    for(var j=0;j<divisions;j++)
    {
      for(var k=0;k<divisions;k++)
      {
        var curAtCoord = this.grid[i][j][k];
        var otherAtCoord = other.grid[i][j][k];

        if(curAtCoord.filled == 1 && otherAtCoord.filled  ==1 )
        {
          this.grid[i][j][k].filled= 0;
          this.remove( curAtCoord.mesh )
          this.grid[i][j][k].mesh = null;
        }
      }
    }
  }
  console.log("result grid",this.grid, this)
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

