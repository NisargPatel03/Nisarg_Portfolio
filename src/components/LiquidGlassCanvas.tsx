import React, { useEffect, useRef, useState } from 'react';
import { soundFX } from '../utils/terminalAudio';

interface LiquidGlassCanvasProps {
  activeTheme: 'project' | 'toxic-radar' | 'vapor-matrix' | 'amber-console' | 'blueprint-arctic';
  isMatrixActive: boolean;
}

interface Ripple {
  x: number;
  y: number;
  time: number;
  intensity: number;
}

// Vertex shader
const VS_SOURCE = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Fragment shader
const FS_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_theme_color;
uniform float u_scroll_offset;
uniform float u_warp_progress;
uniform float u_audio_intensity;
uniform float u_matrix_active;

// Ripple queue
uniform vec2 u_ripple_pos[6];
uniform float u_ripple_time[6];
uniform float u_ripple_intensity[6];

uniform sampler2D u_matrix_tex;

void main() {
  vec2 uv = v_uv;
  
  // 1. Calculate refraction displacement
  vec2 displacement = vec2(0.0);
  
  // Aspect ratio correction
  float aspect = u_resolution.x / u_resolution.y;
  
  // A. Mouse magnifying glass lens
  vec2 mouse_uv = u_mouse / u_resolution;
  vec2 to_mouse = uv - mouse_uv;
  to_mouse.x *= aspect;
  float dist_to_mouse = length(to_mouse);
  
  float lens_radius = 0.18;
  if (dist_to_mouse < lens_radius) {
    float lens_factor = smoothstep(lens_radius, 0.0, dist_to_mouse);
    float refract_strength = sin(lens_factor * 3.14159) * 0.025;
    displacement += normalize(to_mouse) * refract_strength;
  }
  
  // B. Speed-induced wave ripples
  for (int i = 0; i < 6; i++) {
    float age = u_time - u_ripple_time[i];
    if (age > 0.0 && age < 1.8) {
      vec2 ripple_uv = u_ripple_pos[i] / u_resolution;
      vec2 to_ripple = uv - ripple_uv;
      to_ripple.x *= aspect;
      float dist = length(to_ripple);
      
      float wave_speed = 0.45;
      float wave_front = age * wave_speed;
      
      if (dist < wave_front) {
        float damp = exp(-age * 1.8) * exp(-dist * 2.0) * u_ripple_intensity[i];
        float wave = sin((dist - wave_front) * 45.0) * damp * 0.03;
        displacement += normalize(to_ripple) * wave;
      }
    }
  }
  
  vec2 displaced_uv = uv + displacement;
  
  // 2. Draw Grid Pattern
  vec2 grid_uv = displaced_uv;
  grid_uv.x *= aspect;
  
  // Apply scrolling parallax offset
  grid_uv.y += u_scroll_offset * 0.00015;
  
  // 3D perspective warp
  if (u_warp_progress > 0.0) {
    grid_uv.x -= aspect * 0.5;
    float z = 1.0 + grid_uv.y * 1.5 * u_warp_progress;
    grid_uv.x /= z;
    grid_uv.x += aspect * 0.5;
    grid_uv.y += u_scroll_offset * 0.0002 * u_warp_progress;
  }
  
  // Anti-aliased grid lines drawing
  float grid_scale = 12.0;
  grid_scale *= (1.0 - u_audio_intensity * 0.04);
  
  vec2 cell = abs(fract(grid_uv * grid_scale - 0.5) - 0.5) / fwidth(grid_uv * grid_scale);
  float line = min(cell.x, cell.y);
  float thickness = 1.2 + u_audio_intensity * 1.2;
  float grid_strength = 1.0 - min(line / thickness, 1.0);
  
  // Soft border vignette
  float edge_fade = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x) *
                    smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
  
  vec3 grid_color = u_theme_color * grid_strength * (0.07 + u_audio_intensity * 0.08) * edge_fade;
  
  // 3. Sample distorted Matrix Rain texture
  vec3 final_color = grid_color;
  if (u_matrix_active > 0.0) {
    vec4 rain = texture(u_matrix_tex, displaced_uv);
    vec3 rain_tinted = rain.rgb;
    // If not default green matrix color, color-blend to match current active theme
    if (u_theme_color != vec3(0.0, 1.0, 0.25)) {
      float luminance = dot(rain.rgb, vec3(0.299, 0.587, 0.114));
      rain_tinted = u_theme_color * luminance * 1.5;
    }
    final_color += rain_tinted * 0.22;
  }
  
  // 4. Subtle ambient backlight glow centered on mouse
  float cursor_glow = smoothstep(0.25, 0.0, dist_to_mouse);
  final_color += u_theme_color * cursor_glow * 0.08;
  
  outColor = vec4(final_color, 0.20 + u_audio_intensity * 0.10);
}
`;

export const LiquidGlassCanvas: React.FC<LiquidGlassCanvasProps> = ({
  activeTheme,
  isMatrixActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWarping, setIsWarping] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, velocity: 0 });
  const ripplesRef = useRef<Ripple[]>(
    Array.from({ length: 6 }, () => ({ x: -999, y: -999, time: 0, intensity: 0 }))
  );
  const rippleIndexRef = useRef(0);
  const isWarpingRef = useRef(false);
  const warpProgressRef = useRef(0);

  // Convert theme name to normalized float RGB values
  const getThemeColor = () => {
    switch (activeTheme) {
      case 'toxic-radar':
        return [0.0, 1.0, 0.25]; // neon green
      case 'vapor-matrix':
        return [1.0, 0.0, 0.78]; // pink/purple
      case 'amber-console':
        return [1.0, 0.69, 0.0]; // amber gold
      case 'blueprint-arctic':
        return [0.0, 0.95, 1.0]; // arctic cyan
      default:
        return [0.0, 0.95, 1.0]; // default cyan
    }
  };

  // Synchronize CSS warping state
  useEffect(() => {
    isWarpingRef.current = isWarping;
  }, [isWarping]);

  // Scroll and warp event handlers
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let warpTimeout: any;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const timeDiff = currentTime - lastTime;

      if (timeDiff > 0) {
        const velocity = Math.abs(currentScrollY - lastScrollY) / timeDiff;
        if (velocity > 1.8) {
          setIsWarping(true);
          clearTimeout(warpTimeout);
          warpTimeout = setTimeout(() => {
            setIsWarping(false);
          }, 350);
        }
      }

      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleWarpStart = () => setIsWarping(true);
    const handleWarpEnd = () => setIsWarping(false);

    window.addEventListener('grid-warp-start', handleWarpStart);
    window.addEventListener('grid-warp-end', handleWarpEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('grid-warp-start', handleWarpStart);
      window.removeEventListener('grid-warp-end', handleWarpEnd);
      clearTimeout(warpTimeout);
    };
  }, []);

  // WebGL 2 pipeline setup and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL 2 is not supported on this browser.');
      return;
    }

    // Helper: compile shader
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VS_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(FS_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Buffers and geometry setup (full-screen quad)
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations lookup
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uColorLoc = gl.getUniformLocation(program, 'u_theme_color');
    const uScrollLoc = gl.getUniformLocation(program, 'u_scroll_offset');
    const uWarpLoc = gl.getUniformLocation(program, 'u_warp_progress');
    const uAudioLoc = gl.getUniformLocation(program, 'u_audio_intensity');
    const uMatrixActiveLoc = gl.getUniformLocation(program, 'u_matrix_active');
    const uMatrixTexLoc = gl.getUniformLocation(program, 'u_matrix_tex');

    // Ripple locations lookup
    const uRipplePosLocs = Array.from({ length: 6 }, (_, i) =>
      gl.getUniformLocation(program, `u_ripple_pos[${i}]`)
    );
    const uRippleTimeLocs = Array.from({ length: 6 }, (_, i) =>
      gl.getUniformLocation(program, `u_ripple_time[${i}]`)
    );
    const uRippleIntensLocs = Array.from({ length: 6 }, (_, i) =>
      gl.getUniformLocation(program, `u_ripple_intensity[${i}]`)
    );

    // Setup Matrix Rain Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Set texture slot
    gl.uniform1i(uMatrixTexLoc, 0);

    let animationId: number;
    const startTime = performance.now();

    // Mouse movement velocity listener
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top); // invert Y for WebGL coords

      const mouse = mouseRef.current;
      const dx = x - mouse.lastX;
      const dy = y - mouse.lastY;
      mouse.velocity = Math.sqrt(dx * dx + dy * dy);

      mouse.x = x;
      mouse.y = y;
      mouse.lastX = x;
      mouse.lastY = y;

      // Fast movements trigger waves
      if (mouse.velocity > 18) {
        const index = rippleIndexRef.current;
        ripplesRef.current[index] = {
          x,
          y,
          time: (performance.now() - startTime) / 1000.0,
          intensity: Math.min(mouse.velocity / 35.0, 0.8),
        };
        rippleIndexRef.current = (index + 1) % 6;
      }
    };

    // Clicking triggers deep focal ripples
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);

      const index = rippleIndexRef.current;
      ripplesRef.current[index] = {
        x,
        y,
        time: (performance.now() - startTime) / 1000.0,
        intensity: 1.0,
      };
      rippleIndexRef.current = (index + 1) % 6;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    // Resize handler with performance pixel density capping
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation frames loop
    const render = () => {
      const now = (performance.now() - startTime) / 1000.0;

      // Update 3D warp transition smoothly
      const targetWarp = isWarpingRef.current ? 1.0 : 0.0;
      warpProgressRef.current += (targetWarp - warpProgressRef.current) * 0.1;

      // Clear viewport
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Upload Matrix Rain texture if active
      if (isMatrixActive) {
        const matrixCanvas = document.getElementById('matrix-rain-canvas') as HTMLCanvasElement;
        if (matrixCanvas) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          // Upload pixels
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, matrixCanvas);
          gl.uniform1f(uMatrixActiveLoc, 1.0);
        } else {
          gl.uniform1f(uMatrixActiveLoc, 0.0);
        }
      } else {
        gl.uniform1f(uMatrixActiveLoc, 0.0);
      }

      // Fetch live audio analyser values
      let audioIntensity = 0;
      const analyser = soundFX.getAnalyser();
      if (analyser && soundFX.enabled) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        audioIntensity = sum / bufferLength / 255.0;
      }

      // Set resolution, time, scroll and colors
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      
      // Scaling mouse coordinates to match DPR/resolution
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      gl.uniform2f(uMouseLoc, mouseRef.current.x * dpr, mouseRef.current.y * dpr);
      gl.uniform1f(uTimeLoc, now);
      
      const themeColor = getThemeColor();
      gl.uniform3f(uColorLoc, themeColor[0], themeColor[1], themeColor[2]);
      
      // Pass scroll position to scroll offset uniform
      gl.uniform1f(uScrollLoc, window.scrollY);
      gl.uniform1f(uWarpLoc, warpProgressRef.current);
      gl.uniform1f(uAudioLoc, audioIntensity);

      // Pass traveling ripples array
      for (let i = 0; i < 6; i++) {
        const ripple = ripplesRef.current[i];
        gl.uniform2f(uRipplePosLocs[i], ripple.x * dpr, ripple.y * dpr);
        gl.uniform1f(uRippleTimeLocs[i], ripple.time);
        gl.uniform1f(uRippleIntensLocs[i], ripple.intensity);
      }

      // Draw quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      // Clean up buffers and WebGL assets
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [activeTheme, isMatrixActive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
