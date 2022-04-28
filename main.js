import {VertexAttributes} from './vertex-attributes';
import {ShaderProgram} from './shader-program';
import {VertexArray} from './vertex-array';
import {Matrix4} from './matrix';
import {Vector3, Vector4} from './vector';
import {Terrain} from './terrain';
import {Trimesh} from './trimesh';
import {Camera} from './camera';
import {TerrainCamera} from './TerrainCamera';

let canvas;
let attributes;
let shaderProgram;
let vao;
let clipFromEye;
let camera;
let degrees = 5;
let turnDelta = .01;

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  //gl.clearColor(0.5294, 0.8078, 0.9216, 1);
  gl.clearColor(0.2235, 0.2392, 0.2784, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  shaderProgram.bind();

  shaderProgram.setUniformMatrix4('clipFromEye', clipFromEye);
  shaderProgram.setUniformMatrix4('eyeFromWorld', camera.eyeFromWorld);
  shaderProgram.setUniformMatrix4('worldFromModel', Matrix4.identity());
  vao.bind();
  // vao.drawSequence(gl.POINTS);
	vao.drawIndexed(gl.TRIANGLES);
  vao.unbind();

  shaderProgram.unbind();
}

function onResizeWindow() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  clipFromEye = Matrix4.fovPerspective(45, canvas.width / canvas.height, 0.1, 500);
  render();
}

async function initialize() {
  canvas = document.getElementById('canvas');
  window.gl = canvas.getContext('webgl2');

  const heightmap = await readImage('./noise-terrain.png');
  let gray = imageToGrayscale(heightmap);


  let ter = new Terrain(gray, heightmap.width, heightmap.height);
  let mesh = ter.toTrimesh();

  let vecPositions = mesh.getPositions();
  let positions = mesh.getPositions();
  let normals   = mesh.getNormals();
  let indices   = mesh.getIndices();

  normals = normals.flatMap(v => [v.x, v.y, v.z]);
  positions = positions.flatMap(v => [v.x, v.y, v.z]);


	/* Generate colors */
	let colors = [];
	for(let i = 0; i < positions.length / 3; i++) {
		colors.push(0.3373, 0.4902, 0.2745);
	}

  let from = vecPositions[parseInt(Math.random() * (vecPositions.length - 1))];
  let to = vecPositions[0];
  let worldUp = new Vector3(0, 1, 0);
  camera = new TerrainCamera(from, to, worldUp, ter, 15);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  attributes = new VertexAttributes();
  attributes.addAttribute('position', positions.length / 3, 3, positions);
  attributes.addAttribute('normal',   normals.length / 3, 3, normals);
  attributes.addAttribute('color',    colors.length   / 3, 3, colors);
  attributes.addIndices(indices);

  //console.log(normals);

  const vertexSource = `
uniform mat4 clipFromEye;
uniform mat4 eyeFromWorld;
uniform mat4 worldFromModel;
in vec3 position;
in vec3 normal;
in vec3 color;
out vec3 mixNormal;
out vec3 mixColor;

void main() {
  gl_PointSize = 3.0;
  gl_Position = clipFromEye * eyeFromWorld * worldFromModel * vec4(position, 1.0);
  mixNormal = (eyeFromWorld * worldFromModel * vec4(normal, 0.0)).xyz;
	mixColor = color;
}
  `;

  const fragmentSource = `
float fog_maxdist = 560.0;
float fog_mindist = 150.0;
vec4  fog_color = vec4(0.4, 0.4, 0.4, 1.0);
const float ambientFactor = 0.7;
const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
const vec3 albedo = vec3(1.0, 1.0, 1.0);
in vec3 mixNormal;
in vec3 mixColor;
out vec4 fragmentColor;

void main() {
  vec3 normal = normalize(mixNormal);
  float litness = max(0.0, dot(normal, lightDirection));
  vec3 diffuse = albedo * litness * (1.0 - ambientFactor);
  vec3 ambient = albedo * ambientFactor;
  vec4 tempColor = vec4(mixColor * (diffuse + ambient), 1.0);

  float dist = fog_maxdist - fog_mindist;
  float fog_factor = (fog_maxdist - dist) / (fog_maxdist - fog_mindist);
  fog_factor = clamp(fog_factor, 0.0, 1.0);
  fragmentColor = mix(fog_color, tempColor, fog_factor);
  fragmentColor = tempColor;
}
  `;

  shaderProgram = new ShaderProgram(vertexSource, fragmentSource);
  vao = new VertexArray(shaderProgram, attributes);

  window.addEventListener('resize', onResizeWindow);
  onResizeWindow();

  canvas.addEventListener('pointerdown', event => {
    document.body.requestPointerLock();
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'w' || event.key === 'ArrowUp') {
      camera.advance(degrees);
      render();
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
      camera.strafe(-degrees);
      render();
    } else if (event.key === 's' || event.key === 'ArrowDown') {
      camera.advance(-degrees);
      render();
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
      camera.strafe(degrees);
      render();
    } else if (event.key === 'q') {
      camera.yaw(turnDelta);
      render();
    } else if (event.key === 'e') {
      camera.yaw(-turnDelta);
      render();
    }
  });

  window.addEventListener('mousemove', event => {
    if (document.pointerLockElement) {
      camera.yaw(-event.movementX * .001);
      camera.pitch(-event.movementY * .001);
      render();
    }
  });

  onResizeWindow();
}

async function readImage(url) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

function imageToGrayscale(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, image.width, image.height);
  const pixels = context.getImageData(0, 0, image.width, image.height);

  const grays = new Array(image.width * image.height);
  for (let i = 0; i < image.width * image.height; ++i) {
    grays[i] = pixels.data[i * 4];
  }

  return grays;
}

window.addEventListener('load', initialize);

// function reserveDepthTexture(width, height, unit = gl.TEXTURE0) {
//   gl.activeTexture(unit);
//   const texture = gl.createTexture();
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   return texture;
// }

// function initializeDepthFbo(depthTexture) {
//   const framebuffer = gl.createFramebuffer();
//   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
//   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
//   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//   return framebuffer;
// }

// function initializeDepthProgram() {
//   const vertexSource = `
// uniform mat4 clipFromWorld;
// uniform mat4 worldFromModel;
// in vec3 position;

// void main() {
//   gl_Position = clipFromWorld * worldFromModel * vec4(position, 1.0);
// }
//   `;

//   const fragmentSource = `
// out vec4 fragmentColor;

// void main() {
//   fragmentColor = vec4(1.0);
// }
//     `;

//   depthProgram = new ShaderProgram(vertexSource, fragmentSource);
// }
