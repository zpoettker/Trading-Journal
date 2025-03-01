// Sample data with trade counts and day counts
const tradeData = {
    totalPnL: 256.36,
    avgWinningTrade: 256.36,
    avgLosingTrade: 112.36,
    winningTrades: 108,
    losingTrades: 108,
    winningDays: 15,
    losingDays: 10,
    dailyPnL: [
        { date: "2021-06-01", pnl: 100, tradeCount: 2 },
        { date: "2021-06-02", pnl: -50, tradeCount: 1 },
        { date: "2021-06-15", pnl: 75, tradeCount: 3 },
    ],
    recentTrades: [
        { date: "2021-06-15", symbol: "AAPL", pnl: 75, type: "Buy" },
        { date: "2021-06-02", symbol: "TSLA", pnl: -50, type: "Sell" },
        { date: "2021-06-01", symbol: "GOOG", pnl: 100, type: "Buy" },
    ]
};

// Simulate loading states
function showLoading() {
    document.querySelectorAll('.metric-card, .chart-card').forEach(card => {
        card.classList.add('loading');
    });
    setTimeout(() => {
        document.querySelectorAll('.metric-card, .chart-card').forEach(card => {
            card.classList.remove('loading');
        });
    }, 1000);
}

// Update metrics
function updateMetrics(monthDate) {
    showLoading();
    document.querySelector('.metric-card:nth-child(1) .value').textContent = `$${tradeData.totalPnL.toFixed(2)}`;
    
    // Trade Win Rate
    const tradeWinRate = (tradeData.winningTrades / (tradeData.winningTrades + tradeData.losingTrades) * 100).toFixed(0);
    document.querySelector('.metric-card:nth-child(2) .value').textContent = `${tradeWinRate}%`;

    // Day Win Rate
    const totalDays = tradeData.winningDays + tradeData.losingDays;
    const dayWinRate = totalDays > 0 ? (tradeData.winningDays / totalDays * 100).toFixed(0) : 0;
    document.querySelector('.metric-card:nth-child(3) .value').textContent = `${dayWinRate}%`;

    // Calculate Risk/Reward for the current month
    let totalWinPnL = 0;
    let totalLossPnL = 0;
    tradeData.dailyPnL.forEach(trade => {
        const tradeDate = new Date(trade.date);
        if (monthDate && tradeDate.getMonth() === monthDate.getMonth() && tradeDate.getFullYear() === monthDate.getFullYear()) {
            if (trade.pnl > 0) totalWinPnL += trade.pnl;
            else if (trade.pnl < 0) totalLossPnL += Math.abs(trade.pnl);
        }
    });

    const riskReward = totalLossPnL === 0 ? 0 : (totalWinPnL / totalLossPnL).toFixed(2);
    document.querySelector('.metric-card:nth-child(4) .value').textContent = `${riskReward}`;

    // Trade Win Rate Chart
    const winRateChart = new Chart(document.getElementById('winRateChart').getContext('2d'), {
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
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    // Day Win Rate Chart
    const dayWinRateChart = new Chart(document.getElementById('dayWinRateChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Winning Days', 'Losing Days'],
            datasets: [{
                data: [tradeData.winningDays, tradeData.losingDays],
                backgroundColor: ['#4caf50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    // Risk/Reward Chart
    const riskRewardChart = new Chart(document.getElementById('riskRewardChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Wins', 'Losses'],
            datasets: [{
                data: [riskReward > 0 ? riskReward : 0, 1],
                backgroundColor: ['#4caf50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, display: false },
                x: { display: false }
            }
        }
    });
}

// Monthly P&L Chart
let currentMonth = new Date(2021, 5, 1); // June 2021
let monthlyPnlChart = null;

function updateMonthlyPnlChart(monthDate) {
    showLoading();
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    const data = Array(daysInMonth).fill(0);

    tradeData.dailyPnL.forEach(trade => {
        const tradeDate = new Date(trade.date);
        if (tradeDate.getMonth() === monthDate.getMonth() && tradeDate.getFullYear() === monthDate.getFullYear()) {
            data[tradeDate.getDate() - 1] = trade.pnl;
        }
    });

    const ctx = document.getElementById('monthlyPnlChart').getContext('2d');
    if (monthlyPnlChart) {
        monthlyPnlChart.destroy();
    }

    monthlyPnlChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Net P&L',
                data: data,
                borderColor: '#1a1a2e',
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.2)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

// Recent Trades List
function renderRecentTrades() {
    const list = document.getElementById('recentTradesList');
    list.innerHTML = '';
    tradeData.recentTrades.forEach(trade => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${trade.date} - ${trade.symbol} 
            <span class="trade-pnl" style="color: ${trade.pnl >= 0 ? '#4caf50' : '#f44336'}">
                $${trade.pnl.toFixed(2)}
            </span> 
            (${trade.type})
        `;
        list.appendChild(li);
    });
}

// Full Calendar Logic
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Week P&L'];

function renderFullCalendar(date) {
    const fullCalendarGrid = document.getElementById('fullCalendarGrid');
    const monthDisplay = document.getElementById('calendarMonth');
    fullCalendarGrid.innerHTML = '';

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    // Render header row (8 columns)
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        fullCalendarGrid.appendChild(dayHeader);
    });

    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay();

    // Fill in empty days before the month starts
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day-full inactive';
        emptyDay.innerHTML = '<span></span>';
        fullCalendarGrid.appendChild(emptyDay);
    }

    let weekPnL = 0; // Track P&L for current week

    // Render days and calculate weekly P&L
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day-full';
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = tradeData.dailyPnL.find(d => d.date === dateStr);
        let pnl = dayData ? dayData.pnl : 0;
        let tradeCount = dayData ? dayData.tradeCount : 0;

        dayDiv.innerHTML = `
            ${day}<br>
            <span>$${pnl.toFixed(2)}</span><br>
            <span>${tradeCount} trade${tradeCount === 1 ? '' : 's'}</span>
            <div class="tooltip">P&L on ${dateStr}: $${pnl.toFixed(2)} (${tradeCount} trade${tradeCount === 1 ? '' : 's'})</div>
        `;
        if (pnl > 0) dayDiv.classList.add('green');
        else if (pnl < 0) dayDiv.classList.add('red');
        fullCalendarGrid.appendChild(dayDiv);

        weekPnL += pnl; // Add to current week total

        // End of week (Saturday or last day of month)
        const isSaturday = (startDay + day - 1) % 7 === 6;
        const isLastDay = day === daysInMonth;
        if (isSaturday || isLastDay) {
            const weekDiv = document.createElement('div');
            weekDiv.className = 'calendar-day-full';
            weekDiv.innerHTML = `
                <span>$${weekPnL.toFixed(2)}</span>
                <div class="tooltip">Week P&L: $${weekPnL.toFixed(2)}</div>
            `;
            if (weekPnL > 0) weekDiv.classList.add('green');
            else if (weekPnL < 0) weekDiv.classList.add('red');
            fullCalendarGrid.appendChild(weekDiv);

            weekPnL = 0; // Reset for next week
        }
    }

    // Fill remaining cells to complete the 8-column x 6-row grid (48 cells total, including header)
    const totalDaysAndWeeks = startDay + daysInMonth + Math.ceil((startDay + daysInMonth) / 7); // Days + week P&L columns
    const totalCellsFilled = 8 + totalDaysAndWeeks; // Header + content
    const cellsToFill = 48 - totalCellsFilled; // Cap at 48 cells (6 rows)
    for (let i = 0; i < cellsToFill; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day-full inactive';
        emptyDay.innerHTML = `<span>$0</span>`;
        fullCalendarGrid.appendChild(emptyDay);
    }

    updateMonthlyPnlChart(date);
    updateMetrics(date);
    renderRecentTrades();
}

// Initial render
renderFullCalendar(currentMonth);

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderFullCalendar(currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderFullCalendar(currentMonth);
});

// Trade Form Submission
document.getElementById('tradeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newTrade = {
        date: document.getElementById('tradeDate').value,
        symbol: document.getElementById('tradeSymbol').value,
        pnl: parseFloat(document.getElementById('tradePnL').value),
        type: document.getElementById('tradeType').value
    };
    tradeData.recentTrades.unshift(newTrade);

    const existingDay = tradeData.dailyPnL.find(d => d.date === newTrade.date);
    if (existingDay) {
        existingDay.pnl += newTrade.pnl;
        existingDay.tradeCount += 1;
    } else {
        tradeData.dailyPnL.push({ date: newTrade.date, pnl: newTrade.pnl, tradeCount: 1 });
    }

    if (newTrade.pnl > 0) tradeData.winningTrades += 1;
    else if (newTrade.pnl < 0) tradeData.losingTrades += 1;
    tradeData.totalPnL += newTrade.pnl;

    renderFullCalendar(currentMonth);
    document.getElementById('tradeModal').style.display = 'none';
    document.getElementById('tradeForm').reset();
});