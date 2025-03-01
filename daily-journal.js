// Sample data for daily journal (can be expanded with backend integration)
const journalData = {
    "2023-04-17": {
        netPnl: -554.67,
        winRate: 60.00,
        totalTrades: 5,
        winners: 3,
        losers: 2,
        volume: 530,
        profitFactor: 0.81,
        grossPnl: -382.02,
        commissions: 172.65,
        notes: "Traded during FOMC, which was against my plan. Felt FOMO on FOMC."
    },
    "2023-03-21": {
        netPnl: 0,
        winRate: 0,
        totalTrades: 0,
        winners: 0,
        losers: 0,
        volume: 0,
        profitFactor: 0,
        grossPnl: 0,
        commissions: 0,
        notes: ""
    },
    // Add more dates as needed
};

document.addEventListener('DOMContentLoaded', () => {
    const dateLinks = document.querySelectorAll('#dateList a');
    const selectedDate = document.getElementById('selectedDate');
    const netPnl = document.getElementById('netPnl');
    const winRate = document.getElementById('winRate');
    const totalTrades = document.getElementById('totalTrades');
    const winners = document.getElementById('winners');
    const losers = document.getElementById('losers');
    const volume = document.getElementById('volume');
    const profitFactor = document.getElementById('profitFactor');
    const grossPnl = document.getElementById('grossPnl');
    const commissions = document.getElementById('commissions');
    const journalNotes = document.getElementById('journalNotes');
    const dailyChart = document.getElementById('dailyChart').getContext('2d');
    let dailyChartInstance = null;

    // Handle date selection
    dateLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            dateLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const date = link.getAttribute('data-date');
            selectedDate.textContent = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            const data = journalData[date] || {
                netPnl: 0,
                winRate: 0,
                totalTrades: 0,
                winners: 0,
                losers: 0,
                volume: 0,
                profitFactor: 0,
                grossPnl: 0,
                commissions: 0,
                notes: ""
            };

            netPnl.textContent = `$${data.netPnl.toFixed(2)}`;
            winRate.textContent = `${data.winRate.toFixed(2)}%`;
            totalTrades.textContent = data.totalTrades;
            winners.textContent = data.winners;
            losers.textContent = data.losers;
            volume.textContent = data.volume;
            profitFactor.textContent = data.profitFactor.toFixed(2);
            grossPnl.textContent = `$${data.grossPnl.toFixed(2)}`;
            commissions.textContent = `$${data.commissions.toFixed(2)}`;
            journalNotes.value = data.notes;

            // Update daily chart
            if (dailyChartInstance) {
                dailyChartInstance.destroy();
            }
            dailyChartInstance = new Chart(dailyChart, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Net P&L',
                        data: Array(12).fill(0).map((_, i) => i === 3 ? data.netPnl : 0), // Example: April spike
                        borderColor: '#1a1a2e',
                        fill: true,
                        backgroundColor: 'rgba(76, 175, 80, 0.2)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Allow the chart to fit the container
                    scales: { 
                        y: { 
                            beginAtZero: true,
                            ticks: { font: { size: 10 } } // Smaller font for tighter fit
                        },
                        x: { 
                            ticks: { font: { size: 10 } } // Smaller font for tighter fit
                        }
                    },
                    plugins: { 
                        legend: { display: false },
                        title: { display: false } // Remove title if present
                    },
                    layout: {
                        padding: {
                            top: 5,
                            bottom: 5,
                            left: 5,
                            right: 5
                        }
                    }
                }
            });
        });
    });

    // Load default date (first in list)
    if (dateLinks.length > 0) {
        dateLinks[0].click();
    }

    // Save notes
    document.getElementById('saveNotesBtn').addEventListener('click', () => {
        const activeLink = document.querySelector('#dateList a.active');
        if (activeLink) {
            const date = activeLink.getAttribute('data-date');
            journalData[date] = {
                ...journalData[date],
                notes: journalNotes.value
            };
            alert('Notes saved successfully!');
        }
    });
});