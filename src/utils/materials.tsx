import * as THREE from "three";

export const basicFresnelFragment = `
precision highp float;
varying vec3 fPosition;
varying vec3 fNormal;
varying vec3 vPosition;

uniform vec3 diffuseColor;
uniform vec3 fresnelColor;
uniform float contrast;

void main()
{
    vec3 viewDir = normalize(vPosition - fPosition);

    float fresnelFactor = dot(viewDir, fNormal);
    fresnelFactor = 1.0 - clamp(fresnelFactor, 0.0, 1.0);
  
    fresnelFactor = pow(fresnelFactor, 1.0);

    vec3 color = mix(diffuseColor.rgb, fresnelColor.rgb, fresnelFactor);

    color = (color - 0.5) * contrast + 0.5;
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
`

export const basicFresnelVertex = `
precision highp float;
varying vec3 fNormal;
varying vec3 fPosition;
varying vec3 vPosition;

void main()
{
  fNormal = normalize(normalMatrix * normal);
  vec4 pos = modelViewMatrix * vec4(position, 1.0);
  fPosition = pos.xyz;
  vPosition = position;
  vec4 finalPosition = projectionMatrix * pos;
  
  if(length(pos.xyz) < 10.0){
    finalPosition.z = finalPosition.w * 0.01;
  }

  gl_Position = finalPosition;
}
`

export const mouseDownMaterial = new THREE.ShaderMaterial({
    fragmentShader: basicFresnelFragment,
    vertexShader: basicFresnelVertex,
    uniforms: {
      diffuseColor: {value: new THREE.Color('gray').toArray()},
      fresnelColor: { value: new THREE.Color('lime').toArray()},
      contrast: { value: 2.0 },
    }
  });
export const mouseUpMaterial = new THREE.ShaderMaterial({
  fragmentShader: basicFresnelFragment,
  vertexShader: basicFresnelVertex,
  uniforms: {
    diffuseColor: {value: new THREE.Color('gray').toArray()},
    fresnelColor: { value: new THREE.Color('lightblue').toArray()},
    contrast: { value: 2.0 },
  }
});


