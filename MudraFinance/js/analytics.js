
class AnalyticsManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.chart = null;
    }


    async initializeChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const chartData = await this.getMonthlyChartData();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Basic Expenses',
                        data: chartData.basic,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Luxury Expenses',
                        data: chartData.luxury,
                        borderColor: 'rgb(245, 158, 11)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Goals',
                        data: chartData.goals,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 12
                        },
                        bodyFont: {
                            size: 11
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    async updateChart(period) {
        if (!this.chart) return;

        let chartData;
        switch (period) {
            case 'daily':
                chartData = await this.getDailyChartData();
                break;
            case 'weekly':
                chartData = await this.getWeeklyChartData();
                break;
            case 'monthly':
                chartData = await this.getMonthlyChartData();
                break;
            case 'annual':
                chartData = await this.getAnnualChartData();
                break;
            default:
                chartData = await this.getMonthlyChartData();
        }

        this.chart.data.labels = chartData.labels;
        this.chart.data.datasets[0].data = chartData.basic;
        this.chart.data.datasets[1].data = chartData.luxury;
        this.chart.data.datasets[2].data = chartData.goals;
        this.chart.update();
    }

    async getDailyChartData() {
        const data = await this.storageManager.getData();
        const labels = [];
        const basic = [];
        const luxury = [];
        const goals = [];

        const totals = this.storageManager.calculateCategoryTotals(data);
        const dailyBasic = totals.basic / 30;
        const dailyLuxury = totals.luxury / 30;
        const dailyGoals = totals.goals / 30;

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            // Add some variation
            const variance = Math.random() * 0.3 + 0.85;
            basic.push(parseFloat((dailyBasic * variance).toFixed(2)));
            luxury.push(parseFloat((dailyLuxury * variance).toFixed(2)));
            goals.push(parseFloat((dailyGoals * variance).toFixed(2)));
        }

        return { labels, basic, luxury, goals };
    }

    async getWeeklyChartData() {
        const data = await this.storageManager.getData();
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const totals = this.storageManager.calculateCategoryTotals(data);
        
        const weeklyBasic = totals.basic / 4;
        const weeklyLuxury = totals.luxury / 4;
        const weeklyGoals = totals.goals / 4;

        const basic = [];
        const luxury = [];
        const goals = [];

        for (let i = 0; i < 4; i++) {
            const variance = Math.random() * 0.3 + 0.85;
            basic.push(parseFloat((weeklyBasic * variance).toFixed(2)));
            luxury.push(parseFloat((weeklyLuxury * variance).toFixed(2)));
            goals.push(parseFloat((weeklyGoals * variance).toFixed(2)));
        }

        return { labels, basic, luxury, goals };
    }

    async getMonthlyChartData() {
        const data = await this.storageManager.getData();
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const totals = this.storageManager.calculateCategoryTotals(data);
        
        const weeklyBasic = totals.basic / 4;
        const weeklyLuxury = totals.luxury / 4;
        const weeklyGoals = totals.goals / 4;

        const basic = [weeklyBasic, weeklyBasic, weeklyBasic, weeklyBasic];
        const luxury = [weeklyLuxury, weeklyLuxury, weeklyLuxury, weeklyLuxury];
        const goals = [weeklyGoals, weeklyGoals, weeklyGoals, weeklyGoals];

        return { labels, basic, luxury, goals };
    }

    async getAnnualChartData() {
        const data = await this.storageManager.getData();
        const labels = [];
        const basic = [];
        const luxury = [];
        const goals = [];

        const totals = this.storageManager.calculateCategoryTotals(data);

        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
            
            const variance = Math.random() * 0.4 + 0.8;
            basic.push(parseFloat((totals.basic * variance).toFixed(2)));
            luxury.push(parseFloat((totals.luxury * variance).toFixed(2)));
            goals.push(parseFloat((totals.goals * variance).toFixed(2)));
        }

        return { labels, basic, luxury, goals };
    }

    async calculateStats() {
        const data = await this.storageManager.getData();
        const totals = this.storageManager.calculateCategoryTotals(data);
        const totalExpenses = this.storageManager.calculateTotalExpenses(data);
        const balance = data.earnings - totalExpenses;

        const avgDaily = totalExpenses / 30;

        let highestExpense = 0;
        let highestCategory = '';
        
        if (totals.basic > highestExpense) {
            highestExpense = totals.basic;
            highestCategory = 'Basic';
        }
        if (totals.luxury > highestExpense) {
            highestExpense = totals.luxury;
            highestCategory = 'Luxury';
        }
        if (totals.goals > highestExpense) {
            highestExpense = totals.goals;
            highestCategory = 'Goals';
        }

        const savingsRate = data.earnings > 0 ? (balance / data.earnings) * 100 : 0;

        // Budget status
        let budgetStatus = 'On Track';
        if (balance < 0) {
            budgetStatus = 'Over Budget';
        } else if (savingsRate < 10) {
            budgetStatus = 'Tight Budget';
        } else if (savingsRate > 30) {
            budgetStatus = 'Excellent';
        }

        return {
            avgDaily: avgDaily.toFixed(2),
            highestExpense: highestExpense.toFixed(2),
            highestCategory: highestCategory,
            savingsRate: savingsRate.toFixed(1),
            budgetStatus: budgetStatus
        };
    }
}


window.AnalyticsManager = AnalyticsManager;
