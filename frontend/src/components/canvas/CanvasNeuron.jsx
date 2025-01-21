import React, { useRef, useEffect } from 'react';

const CanvasNeuron = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots = [];
    const maxDots = 100; // Number of dots
    const maxDistance = 40; // Maximum distance for connecting lines
    const dotSpeed = 3; // Speed of dot movement
    let gradientOffset = 0; // Offset for gradient animation
    let gradient = createGradient(); // Initial gradient

    // Generate gradient for dots and connections
    function createGradient() {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ff7eb3');
      gradient.addColorStop(0.5, '#ff758c');
      gradient.addColorStop(1, '#845ec2');
      return gradient;
    }

    // Dot class
    class Dot {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * dotSpeed;
        this.vy = (Math.random() - 0.5) * dotSpeed;
        this.radius = 5; // Larger radius for better neuron effect
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
      }

      update() {
        // Bounce off canvas edges
        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

        this.x += this.vx;
        this.y += this.vy;

        this.draw();
      }
    }

    // Place dots like neurons (clusters)
    const createNeuronClusters = () => {
      for (let i = 0; i < maxDots; i++) {
        const clusterX = Math.random() * canvas.width;
        const clusterY = Math.random() * canvas.height;

        const clusterSize = Math.floor(Math.random() * 5 + 3); // Number of dots in a cluster
        for (let j = 0; j < clusterSize; j++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 50; // Cluster radius
          const x = clusterX + Math.cos(angle) * distance;
          const y = clusterY + Math.sin(angle) * distance;
          dots.push(new Dot(x, y));
        }
      }
    };

    createNeuronClusters();

    // Connect dots with lines
    const connectDots = () => {
      ctx.strokeStyle = gradient;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    };

    // Animate gradient flow
    const updateGradient = () => {
      gradientOffset += 0.01; // Adjust speed
      gradient = ctx.createLinearGradient(
        0 + gradientOffset * 100,
        0,
        canvas.width - gradientOffset * 100,
        canvas.height
      );
      gradient.addColorStop(0, '#ff7eb3');
      gradient.addColorStop(0.5, '#ff758c');
      gradient.addColorStop(1, '#845ec2');
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => dot.update());
      updateGradient();
      connectDots();

      requestAnimationFrame(animate);
    };

    animate();

    // Resize canvas on window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gradient = createGradient(); // Recreate gradient on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', background: '#f0f0f0', width: '100%', height: '100%' }}
    />
  );
};

export default CanvasNeuron;
