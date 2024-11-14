// Getter
const canvas = document.getElementById('simulationCanvas');
const canvasContainer = document.querySelector('.canvas-container');
const ctx = canvas.getContext('2d');

// Cannon
let cannonLength = 50; // Length
let cannonBaseWidth = 40; // Width
let cannonBaseHeight = 20; // Height

// gracitasi
let g = 9.81;
let interval;

//Getter html
let timeDisplay = document.getElementById('timeElapsed');
let distanceDisplay = document.getElementById('distance');
let maximumHeightDisplay = document.getElementById('maximumHeight');

// Array simpan
let path = [];
let stopBall = false; 
let highestPoint = { posX: 0, posY: canvas.height - 70, y: 0 }; 
let maxCanvasWidth = 2000; 

// canvas auto scroll
function adjustCanvasWidth(posX) {
    if (posX > canvas.width) {
        let newWidth = Math.min(posX + 100, maxCanvasWidth);
        canvas.width = newWidth;
        canvasContainer.scrollLeft = newWidth - canvasContainer.clientWidth; 
    }
}

function startSimulation() {
    path = [];
    stopBall = false; // Reset
    highestPoint = { posX: 0, posY: canvas.height - 70, y: 0 }; // Reset
    canvas.width = 800; // Reset canvas

    // Get input values from the HTML form
    let velocity = parseFloat(document.getElementById('velocity').value);
    let angle = parseFloat(document.getElementById('angle').value);

    //puter cannon
    angle = angle * Math.PI / 180; //radian
    let velocityX = velocity * Math.cos(angle);
    let velocityY = velocity * Math.sin(angle);

    
    let cannonTipX = 10 + cannonLength * Math.cos(angle);
    let cannonTipY = canvas.height - 70 - cannonLength * Math.sin(angle); 

    let posX = cannonTipX; 
    let posY = cannonTipY;
    let t = 0;
    let timeStep = 0.05;

    if (interval) clearInterval(interval);

    interval = setInterval(function() {
        if (stopBall) {
            clearInterval(interval);
            return;
        }

        t += timeStep;
        let x = velocityX * t; //hitung jarak
        let y = (velocityY * t) - (0.5 * g * t * t); // tinggi

        posX = cannonTipX + x; 
        posY = cannonTipY - y; 

        // Update highest point
        if (y > highestPoint.y) {
            highestPoint = { posX, posY, y }; 
        }

        // Stop bola
        if (posY >= canvas.height - 70) {
            posY = canvas.height - 70; 
            stopBall = true;
        }

        
        path.push({ posX, posY, t, x, y });

        adjustCanvasWidth(posX); 

        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        
        drawLandscape();
        drawTickMarks();
        drawCannon(angle);

        //posisi tertinggi
        if (highestPoint) {
            drawShadowBall(highestPoint.posX, highestPoint.posY);
        }

        // traject
        drawPath();

        // bola
        ctx.beginPath();
        ctx.arc(posX, posY, 5, 0, 2 * Math.PI); // Ball radius is 5
        ctx.fillStyle = 'blue';
        ctx.fill();

        // Update
        timeDisplay.textContent = `Waktu: ${t.toFixed(2)}s`;
        distanceDisplay.textContent = `Jarak: ${x.toFixed(2)}m`;
        maximumHeightDisplay.textContent = `Ketinggian Maksimum: ${highestPoint.y.toFixed(2)}m`;

        // Stop
        if (stopBall) {
            clearInterval(interval);
        }
    }, 1000 / 60); // FPS
}

// gambar
function drawLandscape() {
    
    ctx.fillStyle = '#87CEEB'; // Light blue 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // rumput
    ctx.fillStyle = '#228B22'; // Green color 
    ctx.fillRect(0, canvas.height - 70, canvas.width, 70); 

    // pohon
    drawTrees();
}

//pohon
function drawTrees() {
    
    let treeSpacing = 200;
    for (let i = 100; i < canvas.width; i += treeSpacing) {
        
        ctx.fillStyle = '#8B4513'; // Brown 
        ctx.fillRect(i, canvas.height - 100, 10, 30); // Trunk

        // folliage
        ctx.beginPath();
        ctx.arc(i + 5, canvas.height - 110, 20, 0, Math.PI * 2); // Foliage radius 
        ctx.fillStyle = '#006400'; // Dark green
        ctx.fill();
    }
}

// tick
function drawTickMarks() {
    // Draw the tick marks and numbers on the x-axis for every 50 meters
    for (let i = 50; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, canvas.height - 55);
        ctx.lineTo(i, canvas.height - 40);
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Add the numbers
        ctx.font = "12px Arial";
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(`${i}m`, i, canvas.height - 20);
    }
}

// meriam ngikut
function drawCannon(angle) {
    // cannon
    ctx.fillStyle = '#333'; // Dark gray 
    ctx.fillRect(0, canvas.height - 70, cannonBaseWidth, cannonBaseHeight); // Fixed at the bottom-left corner

    // Draw the cannon barrel
    ctx.save(); 
    ctx.translate(10, canvas.height - 70); 
    ctx.rotate(-angle); 
    ctx.fillStyle = '#444'; 
    ctx.fillRect(0, -5, cannonLength, 10); 
    ctx.restore(); 
}

// bola tinggi
function drawShadowBall(posX, posY) {
    ctx.beginPath();
    ctx.arc(posX, posY, 5, 0, 2 * Math.PI); // Same size
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'; 
    ctx.fill();
}

// path
function drawPath() {
    if (path.length < 2) return;

    ctx.beginPath();
    ctx.setLineDash([5, 5]); //path
    ctx.moveTo(path[0].posX, path[0].posY);

    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].posX, path[i].posY);
    }

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]); // Reset
}

// hover
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check 
    for (let i = 0; i < path.length; i++) {
        let point = path[i];
        let distance = Math.sqrt(
            Math.pow(mouseX - point.posX, 2) + Math.pow(mouseY - point.posY, 2)
        );

        // If mouse is close to a point, display a tooltip
        if (distance < 10) {
            showTooltip(e.clientX, e.clientY, point);
            return;
        }
    }
    hideTooltip(); 
});

// Function to show the tooltip with data
function showTooltip(x, y, point) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = '#333';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        document.body.appendChild(tooltip);
    }
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
    tooltip.innerHTML = `
        <strong>Waktu:</strong> ${point.t.toFixed(2)}s<br>
        <strong>Jarak dari meriam:</strong> ${point.x.toFixed(2)}m<br>
        <strong>Ketinggian:</strong> ${point.y.toFixed(2)}m
    `;
    tooltip.style.display = 'block';
}

// hide tooltip
function hideTooltip() {
    let tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// popup var
const massInfoBtn = document.getElementById('massInfoBtn');
const massInfoPopup = document.getElementById('massInfoPopup');
const closePopupBtn = document.getElementById('closePopupBtn');

// mass info popup
massInfoBtn.addEventListener('click', function() {
    massInfoPopup.classList.remove('hidden');
});

// buat nutup
closePopupBtn.addEventListener('click', function() {
    massInfoPopup.classList.add('hidden');
});

// gambar awal
drawLandscape();
drawTickMarks();
drawCannon(0); // meriamnya lurus