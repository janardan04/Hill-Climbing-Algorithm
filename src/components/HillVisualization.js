import React, { useEffect, useRef } from 'react';

const HillVisualization = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 300;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the hill
    ctx.beginPath();
    ctx.moveTo(0, 250);
    
    // Create a hill with local maxima
    for (let x = 0; x < canvas.width; x++) {
      const mainHill = Math.sin(x * 0.01) * 100 + 150;
      const localBumps = Math.sin(x * 0.05) * 30;
      const y = mainHill + localBumps;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, 250);
    ctx.closePath();
    
    // Fill the hill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#4a9');
    gradient.addColorStop(1, '#172');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw the path of hill climbing
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    
    let x = 100;
    let prevY = Math.sin(x * 0.01) * 100 + 150 + Math.sin(x * 0.05) * 30;
    ctx.moveTo(x, prevY);
    
    // Simulate hill climbing steps
    for (let i = 0; i < 15; i++) {
      // Try left and right directions
      const leftX = x - 10;
      const rightX = x + 10;
      
      const leftY = Math.sin(leftX * 0.01) * 100 + 150 + Math.sin(leftX * 0.05) * 30;
      const rightY = Math.sin(rightX * 0.01) * 100 + 150 + Math.sin(rightX * 0.05) * 30;
      
      // Move in the direction of lower y value (climbing up the hill)
      if (leftY < rightY && leftY < prevY) {
        x = leftX;
        prevY = leftY;
      } else if (rightY < leftY && rightY < prevY) {
        x = rightX;
        prevY = rightY;
      } else {
        // Local maximum reached
        break;
      }
      
      ctx.lineTo(x, prevY);
    }
    
    ctx.stroke();
    
    // Draw circles at each step
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'red';
    
    // Reset x and prevY for drawing the steps
    x = 100;
    prevY = Math.sin(x * 0.01) * 100 + 150 + Math.sin(x * 0.05) * 30;
    ctx.beginPath();
    ctx.arc(x, prevY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    for (let i = 0; i < 15; i++) {
      const leftX = x - 10;
      const rightX = x + 10;
      
      const leftY = Math.sin(leftX * 0.01) * 100 + 150 + Math.sin(leftX * 0.05) * 30;
      const rightY = Math.sin(rightX * 0.01) * 100 + 150 + Math.sin(rightX * 0.05) * 30;
      
      if (leftY < rightY && leftY < prevY) {
        x = leftX;
        prevY = leftY;
      } else if (rightY < leftY && rightY < prevY) {
        x = rightX;
        prevY = rightY;
      } else {
        // Draw final position as a larger circle
        ctx.beginPath();
        ctx.arc(x, prevY, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
        break;
      }
      
      ctx.beginPath();
      ctx.arc(x, prevY, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
    }
    
    // Add text labels
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Starting Point', 50, 280);
    ctx.fillText('Local Maximum', x - 20, prevY - 15);
    ctx.fillText('Global Maximum', canvas.width - 150, 100);
    
  }, []);

  return (
    <div className="hill-visualization">
      <canvas ref={canvasRef} className="w-100" style={{ height: '300px' }}></canvas>
      <p className="mt-3 text-center">
        This visualization shows how hill climbing moves towards a local maximum.
        Note that it may get stuck in a local optimum instead of finding the global optimum.
      </p>
    </div>
  );
};

export default HillVisualization;