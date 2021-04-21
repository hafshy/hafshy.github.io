const glUtils = {
  getWebGl: function (canvas) {
    let gl;
    const contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (var i = 0; i < contexts.length; i++) {
      try {
        gl = canvas.getContext(contexts[i]);
      } catch (e) {}
      if (gl) break;
    }
    if (!gl) {
      alert("WebGL not available!");
      return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    return gl;
  },

  createVertexBuffer: function(gl, vertices) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer
    return vertexBuffer;
  },

  createColorBuffer: function(gl, colors) {
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer
    return colorBuffer;
  },

  createIndexBuffer: function(gl, indices) {
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return indexBuffer;
  },

  createNormalBuffer: function (gl, normals) {
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(normals),
      gl.STATIC_DRAW
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return normalBuffer;
  },

  createVertexShader: function (gl, type="Bump") {
    let vertexCode = `
    attribute  vec4 vPosition;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    void main()
    {
        gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    }`;
    if (type == "Bump"){
      vertexCode = `
      varying vec3 L; /* light vector in texture-space coordinates */
      varying vec3 V; /* view vector in texture-space coordinates */
      
      attribute vec2 vTexCoord;
      attribute vec4 vPosition;
      
      uniform vec4 normal;
      uniform vec4 lightPosition;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;
      uniform vec3 objTangent; /* tangent vector in object coordinates */
      
      varying vec2 fTexCoord;
      
      void main()
      {
          gl_Position = projectionMatrix*modelViewMatrix*vPosition;
      
          fTexCoord = vTexCoord;
      
          vec3 eyePosition = (modelViewMatrix*vPosition).xyz;
          vec3 eyeLightPos = (modelViewMatrix*lightPosition).xyz;
      
         /* normal, tangent and binormal in eye coordinates */
      
          vec3 N = normalize(normalMatrix*normal.xyz);
          vec3 T  = normalize(normalMatrix*objTangent);
          vec3 B = cross(N, T);
      
          /* light vector in texture space */
      
          L.x = dot(T, eyeLightPos-eyePosition);
          L.y = dot(B, eyeLightPos-eyePosition);
          L.z = dot(N, eyeLightPos-eyePosition);
      
          L = normalize(L);
      
          /* view vector in texture space */
      
          V.x = dot(T, -eyePosition);
          V.y = dot(B, -eyePosition);
          V.z = dot(N, -eyePosition);
      
          V = normalize(V);
          
      }`;
    }
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexCode); // Attach vertex shader source code
    gl.compileShader(vertexShader);
    return vertexShader;
  },

  createFragmentShader: function (gl, type="Bump") {
    let fragCode =  `
    precision mediump float;
    void main()
    {
        gl_FragColor = vec4(1.0, 0.2, 0.2, 0.5);

    }`;
    if(type=="Bump"){
      fragCode = `
      precision mediump float;
  
      varying vec3 L;
      varying vec3 V;
      varying vec2 fTexCoord;
      
      uniform sampler2D texMap;
      uniform vec4 diffuseProduct;
      
      void main()
      {
         vec4 N = texture2D(texMap, fTexCoord);
         vec3 NN =  normalize(2.0*N.xyz-1.0);
         vec3 LL = normalize(L);
         float Kd = max(dot(NN, LL), 0.0);
         vec4 ambient = vec4(0.2, 0.2, 0.2, 0.0);
         gl_FragColor = ambient + vec4(Kd*diffuseProduct.xyz, 1.0);
      }`;
    }
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    return fragShader;
  },

  clearCanvas: function (gl) {
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  },

  createShaderProgram: function(gl, vertexShader, fragmentShader) {
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    return shaderProgram;
  },
  
  associateShaderToObjBuffer: function(gl, shaderProgram, vertexBuffer, colorBuffer, indexBuffer, normalBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    if (indexBuffer) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    var _position = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_position);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var _color = gl.getAttribLocation(shaderProgram, "color");
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_color);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    var _vertexNormal = gl.getAttribLocation(shaderProgram, "vertexNormal");
    gl.vertexAttribPointer(_vertexNormal, 3, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(_vertexNormal);
  }
};

const generalUtils = {
  degreeToRadian: function(degree) {
    return degree * Math.PI/180;
  },
  radianToDegree: function(rad) {
    return rad * 180/Math.PI;
  }
}

const matrixUtils = {
  orthogonalProjection: function(right, left, top, bottom, near, far) {
    return [
      2/(right-left),             0,                          0,                        0,
      0,                          2/(top-bottom),             0,                        0,
      0,                          0,                          2/(near-far),             0,
      (left+right)/(left-right),  (bottom+top)/(bottom-top),  (near + far)/(near-far),  1,
    ];
  },

  perspectiveProjection: function(angle, aspect=1, near=1, far=100) {
    var ang = Math.tan(generalUtils.degreeToRadian(angle*.5));//angle*.5
    const top = near * ang,
          right = top * aspect
    return [
       near/right,  0,          0,                         0,
       0,           near/top,   0,                         0,
       0,           0,         -(far+near)/(far-near),    -1,
       0,           0,          (-2*far*near)/(far-near),  0 
    ];
  },

  obliqueProjection: function(theta, phi) {
    const cotT = 1/Math.tan(generalUtils.degreeToRadian(theta)),
          cotP = 1/Math.tan(generalUtils.degreeToRadian(phi));
    return [
      1,    0,      0,    0,
      0,    1,      0,    0,
      -cotT, -cotP, 1,    0,
      0,    0,      0,    1
    ];
  },

  translate: function(m, tx, ty, tz) {
    return this.multiply(m, this.translation(tx, ty, tz));
  },
 
  xRotate: function(m, angleInRadians) {
    return this.multiply(m, this.xRotation(angleInRadians));
  },
 
  yRotate: function(m, angleInRadians) {
    return this.multiply(m, this.yRotation(angleInRadians));
  },
 
  zRotate: function(m, angleInRadians) {
    return this.multiply(m, this.zRotation(angleInRadians));
  },
 
  scale: function(m, sx, sy, sz) {
    return this.multiply(m, this.scaling(sx, sy, sz));
  },

  translation: function(tx, ty, tz) {
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  multiply: function(a, b) {
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];

    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  inverse: function(m) {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

  normalize: function(vector) {
    var length = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2]);
    return [vector[0]/length, vector[1]/length, vector[2]/length];
  },
  
  transpose: function(m) {
    return [
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15],
    ];
  }
}