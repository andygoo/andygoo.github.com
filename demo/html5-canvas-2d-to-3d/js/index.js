class CustomGeometry extends THREE.BufferGeometry {
  constructor (refGeo1, refGeo2) {
    super()
    let count = refGeo1.attributes.position.count
    
    let targets = new Float32Array(count * 3)
    let mixFactorOffsets = new Float32Array(count)
    let offset = 300
    for (let i = 0; i < count; i += 3) {
      let randX = (Math.random() * 2 - 1) * offset
      let randY = (Math.random() * 2 - 1) * offset
      let randZ = (Math.random() * 2 - 1) * offset
      targets[i + 0] = refGeo2.attributes.position.array[i + 0] || randX
      targets[i + 1] = refGeo2.attributes.position.array[i + 1] || randY
      targets[i + 2] = refGeo2.attributes.position.array[i + 2] || randZ
      
      mixFactorOffsets[i] = -i / count; 
    }
    
    this.addAttribute('position', refGeo1.attributes.position)
    this.addAttribute('targetPosition', new THREE.BufferAttribute(targets, 3))
    this.addAttribute('mixFactorOffset', new THREE.BufferAttribute(mixFactorOffsets, 1))
  }
}

class TextPositions {
  constructor (text) {
    this.text = text
    
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = 2000
    this.canvas.height = 1200
    // document.body.appendChild(this.canvas)
    this.canvas.style.position = 'fixed'
    this.canvas.style.top = '1rem'
    this.canvas.style.left = '1rem'
    this.canvas.style.zIndex = 999
  }
  getPositions () {
    let positions = []
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '200px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height / 2)
    
    let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    let buffer = new Uint32Array(imgData.data.buffer)
    let grid = 2
    
    for (let y = 0; y <= this.canvas.height; y += grid) {
      for (let x = 0; x <= this.canvas.width; x += grid) {
        if (buffer[y * this.canvas.width + x]) {
          positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
          positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
          positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
          positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
          positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
          positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
          // positions.push({ x: x / 10 - this.canvas.width / 20, y: y / 10 - this.canvas.height / 20 })
        }
      }
    }

    return positions
  }
}

const width = window.innerWidth
const height = window.innerHeight

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const clock = new THREE.Clock()
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const loader = new THREE.OBJLoader()

const uniforms = {
  time: { value: 0 },
  mixFactor: { value: 0 }
}
const vertexShader = `
  uniform float mixFactor;

  attribute vec3 targetPosition;
  attribute float mixFactorOffset;

  float smooth(float pos) {
    pos *= 2.;
    if (pos < 1.) {
      return 0.5 * pow(2., 10. * (pos - 1.));
    }
    return 0.5 * (-pow(2., -10. * --pos) + 2.);
  }

  void main () {
    float realFactorOffset = clamp(mixFactor + mixFactorOffset, 0.0, 1.0);
    realFactorOffset = smooth(realFactorOffset);
    vec3 newPosition = mix(position, targetPosition, realFactorOffset);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 5.0;
  }
`
const fragmentShader = `
  void main () {
    gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
  }
`

let text = new TextPositions('The new digital world')
let textPositions = text.getPositions()
let textGeo = new THREE.BufferGeometry()
let positions = new Float32Array(textPositions.length * 3)
for (let i = 0; i < textPositions.length; i += 3) {
  positions[i + 0] = textPositions[i].x
  positions[i + 1] = -textPositions[i].y
  positions[i + 2] = Math.sin(i) * 2.0
}
textGeo.addAttribute('position', new THREE.BufferAttribute(positions, 3))

loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/144379/suzanne.obj', (group) => {
  let geometry2 = group.children[0].geometry
  console.log(group.children[0])
  let geo = new CustomGeometry(textGeo, geometry2)
  let material = new THREE.ShaderMaterial({
    uniforms, 
    vertexShader,
    fragmentShader
  })
  let mesh = new THREE.LineSegments(geo, material)
  scene.add(mesh)
  
  setScene()
  renderFrame() 
})

let count = 0
function shift () {
  if (count % 2 === 0) {
    TweenMax.to(uniforms.mixFactor, 4.5, { value: 2 })
  } else {
    TweenMax.to(uniforms.mixFactor, 4.5, { value: 0 })
  }
  count += 1
}

setInterval(shift, 5000)
shift()


function setScene () {
  renderer.setSize(width, height)
  renderer.setClearColor(0x111111)
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  document.body.appendChild(renderer.domElement)
  
  camera.position.set(0, 0, 100)
  camera.lookAt(new THREE.Vector3())
}

function renderFrame () {
  window.requestAnimationFrame(renderFrame)
  renderer.render(scene, camera)
}