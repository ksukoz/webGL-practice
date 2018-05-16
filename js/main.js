let gl,
  shaderProgram,
  verticies,
  angle = 0;

initGL();
createShaders();
createVerticies();
draw();

function initGL() {
  const canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
}

function createShaders() {

  const vertexShader = getShader(gl, 'shader-vs');


  const fragmentShader = getShader(gl, 'shader-fs');

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

function createVerticies() {

  verticies = [
    -0.9, -0.9, 0.0,
    0.9, -0.9, 0.0,
    0.0, 0.9, 0.0
  ];

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);

  let coords = gl.getAttribLocation(shaderProgram, 'coords');
  // gl.vertexAttrib3f(coords, 0, 0, 0);
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coords);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  let pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
  gl.vertexAttrib1f(pointSize, 50);

  let color = gl.getUniformLocation(shaderProgram, 'color');
  gl.uniform4f(color, 0, 0, 0, 1);
}

function draw() {
  rotateY(angle += 0.01);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(draw);
}

function rotateY(angle) {
  let cos = Math.cos(angle),
    sin = Math.sin(angle),
    matrix = new Float32Array([
      cos, 0, sin, 0,
      0, 1, 0, 0,
      -sin, 0, cos, 0,
      0, 0, 0, 1
    ]);

  const transformMatrix = gl.getUniformLocation(shaderProgram, 'transformMatrix');
  gl.uniformMatrix4fv(transformMatrix, false, matrix);
}
function rotateZ(angle) {
  let cos = Math.cos(angle),
    sin = Math.sin(angle),
    matrix = new Float32Array([
      cos, sin, 0, 0,
      -sin, cos, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);

  const transformMatrix = gl.getUniformLocation(shaderProgram, 'transformMatrix');
  gl.uniformMatrix4fv(transformMatrix, false, matrix);
}

// Get shader from MDN

function getShader(gl, id) {
  var shaderScript, theSource, currentChild, shader;
  
  shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  theSource = "";
  currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
     // неизвестный тип шейдера
     return null;
  }

  gl.shaderSource(shader, theSource);
    
  // скомпилировать шейдерную программу
  gl.compileShader(shader);  
    
  // Проверить успешное завершение компиляции
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
      return null;  
  }
    
  return shader;
}