#version 140

//-------------------------------------
// mandlebrot visualizer
// jess3jane (jess@jess.coffee)
// 21-MAY-2018
// ------------------------------------

//// Output variables
out vec4 color;

//// Input variables
uniform float time;
uniform vec2 resolution;

//// Defines
// the max zoom of the fractal
#define scale vec2(7.9e-5, 7.5e-5)
// the point offset of the center of the screen
#define off vec2(-0.840719, 0.22442)
// the maximum iteration
// adjust if the image gets washed out or seems bloby
#define max_iter 250

// shamelessly stolen from the audio example
vec4 viridis(float x) {
  const float e0 = 0.0;
  const vec4 v0 = vec4(0.26666666666666666,0.00392156862745098,0.32941176470588235,1);
  const float e1 = 0.13;
  const vec4 v1 = vec4(0.2784313725490196,0.17254901960784313,0.47843137254901963,1);
  const float e2 = 0.25;
  const vec4 v2 = vec4(0.23137254901960785,0.3176470588235294,0.5450980392156862,1);
  const float e3 = 0.38;
  const vec4 v3 = vec4(0.17254901960784313,0.44313725490196076,0.5568627450980392,1);
  const float e4 = 0.5;
  const vec4 v4 = vec4(0.12941176470588237,0.5647058823529412,0.5529411764705883,1);
  const float e5 = 0.63;
  const vec4 v5 = vec4(0.15294117647058825,0.6784313725490196,0.5058823529411764,1);
  const float e6 = 0.75;
  const vec4 v6 = vec4(0.3607843137254902,0.7843137254901961,0.38823529411764707,1);
  const float e7 = 0.88;
  const vec4 v7 = vec4(0.6666666666666666,0.8627450980392157,0.19607843137254902,1);
  const float e8 = 1.0;
  const vec4 v8 = vec4(0.9921568627450981,0.9058823529411765,0.1450980392156863,1);
  float a0 = smoothstep(e0,e1,x);
  float a1 = smoothstep(e1,e2,x);
  float a2 = smoothstep(e2,e3,x);
  float a3 = smoothstep(e3,e4,x);
  float a4 = smoothstep(e4,e5,x);
  float a5 = smoothstep(e5,e6,x);
  float a6 = smoothstep(e6,e7,x);
  float a7 = smoothstep(e7,e8,x);
  return max(mix(v0,v1,a0)*step(e0,x)*step(x,e1),
    max(mix(v1,v2,a1)*step(e1,x)*step(x,e2),
    max(mix(v2,v3,a2)*step(e2,x)*step(x,e3),
    max(mix(v3,v4,a3)*step(e3,x)*step(x,e4),
    max(mix(v4,v5,a4)*step(e4,x)*step(x,e5),
    max(mix(v5,v6,a5)*step(e5,x)*step(x,e6),
    max(mix(v6,v7,a6)*step(e6,x)*step(x,e7),mix(v7,v8,a7)*step(e7,x)*step(x,e8)
  )))))));
}

void main() {
  //// Setup the viewport
  // Screen coords go from -1.0 to 1.0
  vec2 uv = gl_FragCoord.xy / resolution.xy * 2.0 - 1.0;
  // Account for screen ratio
  uv.x *= resolution.x / resolution.y;
  
  // inital point with some kind of time based zoom
  vec2 p0 = uv*mix(scale, vec2(1.0, 1.0), pow(sin(time/10),10))+ off; 
  vec2 p	= vec2(0.0, 0.0);
  int i;
  
  // we iterate until it escapes (|p| < 2) or we hit the iteration limit
  // if we hit the limit we consider the point to be inside the set
  for(i = 0; i < max_iter && 4.0 > p.x*p.x + p.y*p.y; ++i) {
    // transform the vector and ensure that we aren't stuck at the same point 
    vec2 tmp = vec2(p.x*p.x - p.y*p.y + p0.x, 2*p.x*p.y + p0.y);
    if (p == tmp) {
      i = max_iter;
      break;
    }
    p = tmp;
  }
  
  // black if inside the set, otherwise color based on iteration count at escape
  if (i == max_iter) {
    color = vec4 (0,0,0,1.0);
  } else {
    color = viridis(i*1.0/max_iter);
  }
}
