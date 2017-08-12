var container = document.getElementById("container")
var width = container.clientWidth;
var height = container.clientHeight;
var aspect = width / height;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
camera.position.set(150,150,200);

var controls = new THREE.TrackballControls( camera);
controls.target.set( 0, 0, 0 );
controls.minDistance=0;
controls.maxDistance=1000;
controls.staticMoving = true;
controls.rotateSpeed = 1.0;


var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

var waterDimensions=200;
var waterResolution=10;

var water = new THREE.PlaneGeometry( waterDimensions,waterDimensions,waterResolution,waterResolution);

// CPU animated water material
var waterMaterial=new THREE.MeshLambertMaterial( {
            //ambient: 0x44B8ED,
            color: 0x44B8ED,
            //emissive: 0x44B8ED,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        } );


// GPU animated water material
var phongShader= THREE.ShaderLib.phong;
var waterShader=document.getElementById("waterVertexShader").textContent;
var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
uniforms.emissive.value=new THREE.Color(0x000000);
uniforms.diffuse.value=new THREE.Color(0x44B8ED);
uniforms.timestamp={  
  type: 'f', // a float
  value: 0
}

var animatedWaterMaterial= new THREE.ShaderMaterial({
  vertexShader: waterShader,
  fragmentShader: phongShader.fragmentShader,
  uniforms: uniforms,
  lights:true, 
	shading: THREE.FlatShading
});

var waterMesh = new THREE.Mesh( water, waterMaterial);
waterMesh.rotation.x=-Math.PI/2;
scene.add(waterMesh);


var dirLight =  new THREE.DirectionalLight( 0xffffff, 0.7 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( 500, 500, 500);
dirLight.target=new THREE.Object3D(0,0,0);
this.scene.add( dirLight );


//CPU animation
function animateWater(timestamp){    
  timestamp/=1000;
  for (var x = 0; x < waterMesh.geometry.vertices.length; x++) {
		var v = waterMesh.geometry.vertices[x];
	  v.z = (-2 * Math.sin((timestamp + (v.x * 10 )))) * 3 + (1 * Math.cos((timestamp + (v.y )))) * 5;
  }    
  
  waterMesh.geometry.computeFaceNormals();	
  waterMesh.geometry.normalsNeedUpdate = true;  
  waterMesh.geometry.verticesNeedUpdate =true;
}

function render(timestamp) {   
  requestAnimationFrame(render);  
  controls.update();
  if (gpuAnimation){    
		animatedWaterMaterial.uniforms.timestamp.value = timestamp/1000;            
  }
  else{        
  	animateWater(timestamp);
  }
  renderer.render(scene, camera);
}


var gpuAnimation=false;
render(0);


document.getElementById("toggle").addEventListener("click",function(){  
  if (gpuAnimation){
    gpuAnimation=false;
    waterMesh.material=waterMaterial;
  }
  else{
    gpuAnimation=true;
    for (var x = 0; x < waterMesh.geometry.vertices.length; x++) {
      var v = waterMesh.geometry.vertices[x];
      v.z = 0
  	}    
    waterMesh.geometry.computeFaceNormals();	
  	waterMesh.geometry.normalsNeedUpdate = true;  
  	waterMesh.geometry.verticesNeedUpdate =true;
    waterMesh.material=animatedWaterMaterial;
  }
});