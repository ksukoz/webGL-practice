let gl,
shaderProgram;

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
  let vs='';
  vs += 'attribute vec4 coords;';
  vs += 'attribute float pointSize;';
  vs += 'void main(void) {';
  vs +=  ' gl_Position = coords;';
  vs += ' gl_PointSize = pointSize;';
  vs += '}';

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vs);
  gl.compileShader(vertexShader);

  let fs='';
  fs += 'precision mediump float;';
  fs += 'uniform vec4 color;';
  fs += 'void main(void) {';
  fs +=  ' gl_FragColor = color;';
  fs += '}';

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fs);
  gl.compileShader(fragmentShader);

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

function createVerticies() {
  let coords = gl.getAttribLocation(shaderProgram, 'coords');
  gl.vertexAttrib3f(coords, 0, 0, 0);

  let pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
  gl.vertexAttrib1f(pointSize, 50);

  let color = gl.getUniformLocation(shaderProgram, 'color');
  gl.uniform4f(color, 1, 0, 1, 1);
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}