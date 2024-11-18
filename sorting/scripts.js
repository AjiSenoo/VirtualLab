const arrayContainer = document.getElementById('array-container');

// Generate a random array
function generateArray() {
  arrayContainer.innerHTML = ''; // Clear existing bars
  const arraySize = 20;
  for (let i = 0; i < arraySize; i++) {
    const barHeight = Math.floor(Math.random() * 200) + 50; // Random height between 50px and 250px
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${barHeight}px`;

    // Add number label to the bar
    const barLabel = document.createElement('span');
    barLabel.classList.add('bar-label');
    barLabel.textContent = barHeight;
    bar.appendChild(barLabel);

    arrayContainer.appendChild(bar);
  }
}

// Bubble Sort Visualization
async function bubbleSort() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < bars.length - 1; i++) {
    for (let j = 0; j < bars.length - i - 1; j++) {
      bars[j].style.backgroundColor = '#ff6b6b'; // Highlight bars being compared
      bars[j + 1].style.backgroundColor = '#ff6b6b';

      const height1 = parseInt(bars[j].style.height);
      const height2 = parseInt(bars[j + 1].style.height);

      if (height1 > height2) {
        await swapBars(bars[j], bars[j + 1]);
      }

      bars[j].style.backgroundColor = '#6c63ff'; // Reset color
      bars[j + 1].style.backgroundColor = '#6c63ff';
    }
    bars[bars.length - i - 1].classList.add('sorted'); // Mark sorted bar
  }
  bars[0].classList.add('sorted'); // Mark the last bar as sorted
}

// Swap two bars
function swapBars(bar1, bar2) {
  return new Promise((resolve) => {
    // Swap heights
    const tempHeight = bar1.style.height;
    const tempLabel = bar1.querySelector('.bar-label').textContent;

    bar1.style.height = bar2.style.height;
    bar1.querySelector('.bar-label').textContent = bar2.querySelector('.bar-label').textContent;

    bar2.style.height = tempHeight;
    bar2.querySelector('.bar-label').textContent = tempLabel;

    setTimeout(() => {
      resolve();
    }, 500); // Animation speed (500ms)
  });
}

// Initialize with a random array
generateArray();
