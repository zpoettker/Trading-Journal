// Sample data for charts and tables
const tradeData = {
    totalPnL: 256.36,
    avgWinningTrade: 256.36,
    avgLosingTrade: 112.36,
    trades: [
        { date: "11/10/2023", symbol: "RVN", volume: 1650.0, execs: 28, pnl: 0.00 },
        { date: "11/10/2023", symbol: "TSLA", volume: 1120.0, execs: 12, pnl: 0.00 },
    ],
    winningTrades: 108,
    losingTrades: 108,
    dailyPnL: [
        { date: "2021-06-01", pnl: 100 },
        { date: "2021-06-02", pnl: -50 },
    ]
};

// Update metrics
document.querySelector('.metric-card:nth-child(1) .value').textContent = `$${tradeData.totalPnL.toFixed(2)}`;
document.querySelector('.metric-card:nth-child(2) .value').textContent = `$${tradeData.avgWinningTrade.toFixed(2)}`;
document.querySelector('.metric-card:nth-child(3) .value').textContent = `$${tradeData.avgLosingTrade.toFixed(2)}`;

// Populate recent trades table
const tableBody = document.querySelector('.trade-log tbody');
tradeData.trades.forEach(trade => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${trade.date}</td>
        <td>${trade.symbol}</td>
        <td>${trade.volume}</td>
        <td>${trade.execs}</td>
        <td>$${trade.pnl.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
});

// Charts with Chart.js
const winningTradesChart = new Chart(document.getElementById('winningTradesChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        labels: ['Winners', 'Losers'],
        datasets: [{
            data: [tradeData.winningTrades, tradeData.losingTrades],
            backgroundColor: ['#4caf50', '#f44336']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: false }
        }
    }
});

const dailyPnlChart = new Chart(document.getElementById('dailyPnlChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: tradeData.dailyPnL.map(d => d.date),
        datasets: [{
            label: 'Daily Net P&L',
            data: tradeData.dailyPnL.map(d => d.pnl),
            borderColor: '#1a1a2e',
            fill: true,
            backgroundColor: 'rgba(76, 175, 80, 0.2)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

// Generate calendar for June 2021 in the metrics section
const calendarGrid = document.getElementById('calendarGrid');
const june2021 = new Date(2021, 5, 1); // June 1, 2021
const daysInJune = new Date(2021, 6, 0).getDate(); // Number of days in June

// Add day headers (Sun, Mon, Tue, etc.)
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
daysOfWeek.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day calendar-day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
});

// Start from the first day of the week (adjust for Sunday start)
const firstDay = new Date(june2021);
firstDay.setDate(1 - firstDay.getDay()); // Go to the first Sunday before June 1

for (let i = 0; i < 42; i++) { // 6 weeks to fill the grid
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + i);
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';

    if (day.getMonth() === 5) { // June
        dayDiv.textContent = day.getDate();
        // Simulate trade data (green for positive, red for negative) or show neutral if no trades
        const tradeCount = Math.floor(Math.random() * 10); // Random trades for demo
        if (tradeCount > 0) {
            dayDiv.textContent += ` (+$${tradeCount * 10})`;
            if (tradeCount % 2 === 0) dayDiv.classList.add('green');
            else dayDiv.classList.add('red');
        }
    } else {
        dayDiv.textContent = day.getDate();
        dayDiv.classList.add('inactive'); // Style inactive (non-June) days differently
    }
    calendarGrid.appendChild(dayDiv);
}

// Full Calendar Widget Logic
let currentMonth = new Date(2021, 5, 1); // Starting with June 2021

function renderFullCalendar(date) {
    const fullCalendarGrid = document.getElementById('fullCalendarGrid');
    const monthDisplay = document.getElementById('calendarMonth');
    fullCalendarGrid.innerHTML = ''; // Clear previous content

    // Update month display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    // Add day headers (Sun, Mon, Tue, etc.)
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        fullCalendarGrid.appendChild(dayHeader);
    });

    // Calculate first day of the month and days in month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

    // Add empty cells before the first day of the month
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day-full inactive';
        emptyDay.innerHTML = '<span></span>'; // Empty cell
        fullCalendarGrid.appendChild(emptyDay);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day-full';

        // Check tradeData.dailyPnL for this date
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = tradeData.dailyPnL.find(d => d.date === dateStr);
        let pnl = dayData ? dayData.pnl : 0;

        dayDiv.innerHTML = `${day}<br><span>$${pnl.toFixed(2)}</span>`;
        if (pnl > 0) dayDiv.classList.add('green');
        else if (pnl < 0) dayDiv.classList.add('red');

        fullCalendarGrid.appendChild(dayDiv);
    }

    // Fill remaining cells to complete the 6-row grid (up to 42 cells total)
    const totalCellsFilled = startDay + daysInMonth;
    const cellsToFill = 42 - totalCellsFilled; // 6 rows * 7 columns = 42
    for (let i = 1; i <= cellsToFill; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day-full inactive';
        emptyDay.innerHTML = `${i}<br><span>$0</span>`;
        fullCalendarGrid.appendChild(emptyDay);
    }
}

// Initial render
renderFullCalendar(currentMonth);

// Navigation buttons
document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderFullCalendar(currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderFullCalendar(currentMonth);
});