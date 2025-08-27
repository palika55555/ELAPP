const { createCanvas } = require('canvas');
const fs = require('fs');

// Create a 256x256 canvas
const canvas = createCanvas(256, 256);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
gradient.addColorStop(0, '#667eea');
gradient.addColorStop(1, '#764ba2');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 256, 256);

// Add a subtle border
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 4;
ctx.strokeRect(2, 2, 252, 252);

// Warehouse building
ctx.fillStyle = '#ffffff';
ctx.strokeStyle = '#333333';
ctx.lineWidth = 3;
ctx.fillRect(68, 100, 120, 80);
ctx.strokeRect(68, 100, 120, 80);

// Roof
ctx.beginPath();
ctx.moveTo(68, 100);
ctx.lineTo(128, 60);
ctx.lineTo(188, 100);
ctx.closePath();
ctx.fillStyle = '#ffffff';
ctx.fill();
ctx.stroke();

// Door
ctx.fillStyle = '#667eea';
ctx.fillRect(108, 140, 40, 40);
ctx.strokeStyle = '#333333';
ctx.lineWidth = 2;
ctx.strokeRect(108, 140, 40, 40);

// Windows
ctx.fillStyle = '#87ceeb';
ctx.fillRect(80, 110, 20, 20);
ctx.fillRect(156, 110, 20, 20);
ctx.strokeStyle = '#333333';
ctx.lineWidth = 1;
ctx.strokeRect(80, 110, 20, 20);
ctx.strokeRect(156, 110, 20, 20);

// Inventory boxes
const boxColors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#a8e6cf'];
boxColors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(70 + index * 20, 160, 15, 15);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.strokeRect(70 + index * 20, 160, 15, 15);
});

// Plus symbol
ctx.fillStyle = '#28a745';
ctx.beginPath();
ctx.arc(220, 40, 15, 0, 2 * Math.PI);
ctx.fill();
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 2;
ctx.stroke();

// Plus lines
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.beginPath();
ctx.moveTo(220, 32);
ctx.lineTo(220, 48);
ctx.moveTo(212, 40);
ctx.lineTo(228, 40);
ctx.stroke();

// App name
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 16px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'bottom';
ctx.fillText('INVENTORY', 128, 240);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('assets/icon.png', buffer);

console.log('Icon generated successfully as assets/icon.png');
console.log('You can now convert it to ICO format using an online converter or rename it to icon.ico');
