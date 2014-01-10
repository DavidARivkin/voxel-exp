

function cubeGenerator(x,y,z)
{
  return true;
}

function randomGenerator(x,y,z)
{
  return Math.round(Math.random())
}

function stupidMesher()
{

}

function VoxelMesh(divisions, baseSize, generator)
{
  var divisions = divisions || 3;
  var baseSize = baseSize || 25;
  var generator = generator || randomGenerator;

  THREE.Object3D.call( this );

  for(var i=0;i<divisions;i++)
  {
    for(var j=0;j<divisions;j++)
    {
      for(var k=0;k<divisions;k++)
      {
        var cubeGeometry = new THREE.CubeGeometry( baseSize, baseSize, baseSize ); 
        var material = new THREE.MeshLambertMaterial( {color: 0x0088ff} ); 
        var material2 = new THREE.MeshLambertMaterial( {color: 0xffffff,wireframe:true} ); 
        var cube = THREE.SceneUtils.createMultiMaterialObject( cubeGeometry, [material,material2]);

        //generator needed
        var filled = generator(i,j,k);
        if(filled) this.add(cube);

        cube.position.set(i*baseSize, j*baseSize, k*baseSize)
      }
    }
  }
}
VoxelMesh.prototype = Object.create( THREE.Object3D.prototype );

VoxelMesh.prototype.substract = function( other )
{

}

function Grid(resolution)
{
  this.resolution = resolution || 3;
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

