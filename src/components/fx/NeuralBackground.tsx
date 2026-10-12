import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DISTANCE = 130;
const MOUSE_DISTANCE = 190;

/**
 * Interactive particle network. Nodes drift, link to neighbours and to the
 * cursor, and gently get pulled toward it. Colours follow the active theme.
 * Pauses when off-screen / tab hidden; renders a single static frame when
 * the user prefers reduced motion.
 */
const NeuralBackground = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const mouse = { x: -9999, y: -9999, active: false };

    // Cache the theme colour (CSS var holds "H S% L%")
    let primary = "172 66% 50%";
    const readTheme = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      if (v) primary = v;
    };
    readTheme();
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (!running) draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const seed = () => {
      const count = Math.min(90, Math.max(24, Math.floor((width * height) / 15000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.8,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (!running) draw();
    };

    const step = () => {
      for (const p of particles) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DISTANCE && dist > 1) {
            // Soft attraction toward the cursor
            const force = (1 - dist / MOUSE_DISTANCE) * 0.012;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        // Damping + speed clamp keeps motion calm
        p.vx *= 0.995;
        p.vy *= 0.995;
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 0.8) {
          p.vx = (p.vx / speed) * 0.8;
          p.vy = (p.vy / speed) * 0.8;
        }
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }
    };

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `hsl(${primary} / ${(1 - dist / LINK_DISTANCE) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (dist < MOUSE_DISTANCE) {
            ctx.strokeStyle = `hsl(${primary} / ${(1 - dist / MOUSE_DISTANCE) * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `hsl(${primary} / 0.7)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const loop = () => {
      if (!running) return;
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.x = x;
      mouse.y = y;
    };
    const onPointerLeave = () => {
      mouse.active = false;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      themeObserver.disconnect();
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export default NeuralBackground;
