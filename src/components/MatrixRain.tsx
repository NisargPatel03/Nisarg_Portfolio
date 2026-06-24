import React, { useEffect, useRef } from 'react';

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  fontSize: number;
  depth: 0 | 1 | 2; // 0 = distant, 1 = mid, 2 = near
  color: string;
  blur: number;
}

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let cols: MatrixColumn[] = [];

    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns();
    };

    const initColumns = () => {
      // Spacing density parameter
      const numColumns = Math.floor(canvas.width / 14) + 10;
      cols = [];
      for (let i = 0; i < numColumns; i++) {
        const rand = Math.random();
        let depth: 0 | 1 | 2 = 1;
        let fontSize = 14;
        let speed = 0.7;
        let color = 'rgba(0, 255, 65, 0.7)';
        let blur = 0;

        if (rand < 0.45) {
          // Distant streams (background layer, slow, small, dark)
          depth = 0;
          fontSize = 9;
          speed = 0.2 + Math.random() * 0.25;
          color = 'rgba(0, 95, 25, 0.42)';
          blur = 0;
        } else if (rand < 0.85) {
          // Midground streams (normal depth, medium size, pure green)
          depth = 1;
          fontSize = 15;
          speed = 0.65 + Math.random() * 0.4;
          color = 'rgba(0, 255, 65, 0.75)';
          blur = 0;
        } else {
          // Foreground streams (large, fast, bright, blurred out-of-focus)
          depth = 2;
          fontSize = 24;
          speed = 1.35 + Math.random() * 0.65;
          color = 'rgba(145, 255, 185, 0.95)';
          blur = 1.8;
        }

        cols.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * -1.5,
          speed,
          fontSize,
          depth,
          color,
          blur
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      // Semitransparent black background overlay for letter fade trails
      ctx.fillStyle = 'rgba(12, 12, 12, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];

        ctx.font = `${col.fontSize}px monospace`;
        ctx.fillStyle = col.color;

        // Apply CSS canvas rendering filter for depth of field
        if (col.blur > 0) {
          ctx.filter = `blur(${col.blur}px)`;
        } else {
          ctx.filter = 'none';
        }

        ctx.fillText(char, col.x, col.y);

        // Advance character position
        col.y += col.fontSize * col.speed;

        // Reset if stream runs past the screen bottom
        if (col.y > canvas.height) {
          col.y = -col.fontSize * 2;
          col.x = Math.random() * canvas.width;
          
          if (col.depth === 0) {
            col.speed = 0.2 + Math.random() * 0.25;
          } else if (col.depth === 1) {
            col.speed = 0.65 + Math.random() * 0.4;
          } else {
            col.speed = 1.35 + Math.random() * 0.65;
          }
        }
      }

      // Reset filter for subsequent operations
      ctx.filter = 'none';
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.25]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
