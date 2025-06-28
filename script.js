const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

let coins = 1000;
const coinsDisplay = document.getElementById('coins');
const betInput = document.getElementById('bet');
const betDisplay = document.getElementById('bet-display');

function updateCoinsDisplay() {
    if (coinsDisplay) coinsDisplay.textContent = coins;
    if (betInput) betInput.max = coins.toString();
}
updateCoinsDisplay();

// Set initial bet value and display
if (betInput && (!betInput.value || isNaN(parseInt(betInput.value, 10)) || parseInt(betInput.value, 10) < 1)) {
    betInput.value = 1;
}
if (betDisplay && betInput) betDisplay.textContent = `Einsatz: ${betInput.value}`;

if (betInput) {
    betInput.addEventListener('input', () => {
        let bet = parseInt(betInput.value, 10);
        if (isNaN(bet) || bet < 1) bet = 1;
        if (bet > coins) bet = coins;
        betInput.value = bet; // Ensure input value is valid
        if (betDisplay) betDisplay.textContent = `Einsatz: ${bet}`;
    });
}
const spinButton = document.getElementById('spin');
if (spinButton) {
    spinButton.addEventListener('click', () => {
        const bet = parseInt(betInput.value, 10);
        if (betDisplay) betDisplay.textContent = `Einsatz: ${bet}`;
        const resultElem = document.getElementById('result');
        if (isNaN(bet) || bet < 1 || bet > coins) {
            if (resultElem) resultElem.textContent = 'Ungültiger Einsatz!';
            return;
        }
        coins -= bet;
        updateCoinsDisplay();
        spinButton.disabled = true;
        if (resultElem) resultElem.textContent = '';
        const slotElements = [
            document.getElementById('slot1'),
            document.getElementById('slot2'),
            document.getElementById('slot3')
        ];
        slotElements.forEach(slot => {
            if (slot) slot.classList.add('spinning');
        });

    // Animation/Spinning logic
    const intervals = [80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
    const stopTimes = [
        600 + Math.random() * 400,
        1200 + Math.random() * 400,
        1800 + Math.random() * 400
    ];
    let running = [true, true, true];
    let elapsed = 0;
    let current = 0;

    function spinStep() {
        for (let i = 0; i < 3; i++) {
            if (running[i] && slotElements[i]) {
                slotElements[i].textContent = randomSymbol();
            }
        }
        let interval = intervals[Math.min(current, intervals.length - 1)];
        elapsed += interval;
        current++;
        for (let i = 0; i < 3; i++) {
            if (running[i] && elapsed >= stopTimes[i]) {
                running[i] = false;
                if (slotElements[i]) slotElements[i].classList.remove('spinning');
                // Endgültiges Symbol setzen
                if (slotElements[i]) slotElements[i].textContent = randomSymbol();
            }
        }
        if (running.some(Boolean)) {
            setTimeout(spinStep, interval);
        } else {
            // Auswertung
            const slot1 = slotElements[0] ? slotElements[0].textContent : '';
            const slot2 = slotElements[1] ? slotElements[1].textContent : '';
            const slot3 = slotElements[2] ? slotElements[2].textContent : '';
            let result = '';
            let win = 0;
            if (slot1 === slot2 && slot2 === slot3) {
                win = bet * 10;
                result = `Jackpot! Du hast ${win} Münzen gewonnen! 🎉`;
            } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
                win = bet * 2;
                result = `Fast! Zwei Symbole stimmen überein. Gewinn: ${win} Münzen.`;
            } else {
                if (coins === 0) {
                    result = 'Kein Guthaben mehr!';
                } else {
                    result = 'Leider verloren. Versuche es nochmal!';
                }
            }
            coins += win;
            updateCoinsDisplay();
            const resultElem = document.getElementById('result');
            if (resultElem) resultElem.textContent = result;
            spinButton.disabled = false;
        }
    }
    spinStep();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && spinButton && !spinButton.disabled) {
        spinButton.click();
    }
    if (document.activeElement === betInput) {
        if (e.key === 'ArrowUp') {
            betStep('up');
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            betStep('down');
            e.preventDefault();
        }
    }
});
const betUp = document.getElementById('bet-up');
const betDown = document.getElementById('bet-down');

let betInterval;
function betStep(direction) {
    let bet = parseInt(betInput.value, 10) || 1;
    if (direction === 'up' && bet < coins) bet++;
    if (direction === 'down' && bet > 1) bet--;
    betInput.value = bet;
    if (betDisplay) betDisplay.textContent = `Einsatz: ${bet}`;
}
if (betUp && betInput) {
    betUp.addEventListener('mousedown', () => {
        betStep('up');
        betInterval = setInterval(() => betStep('up'), 120);
    });
    betUp.addEventListener('mouseup', () => clearInterval(betInterval));
    betUp.addEventListener('mouseleave', () => clearInterval(betInterval));
    betUp.addEventListener('touchend', () => clearInterval(betInterval));
}
if (betDown && betInput) {
    betDown.addEventListener('mousedown', () => {
        betStep('down');
        betInterval = setInterval(() => betStep('down'), 120);
    });
    betDown.addEventListener('mouseup', () => clearInterval(betInterval));
    betDown.addEventListener('mouseleave', () => clearInterval(betInterval));
    betDown.addEventListener('touchend', () => clearInterval(betInterval));
}