// Storage Manager for Finance Planner
class StorageManager {
    constructor() {
        this.defaultData = {
            earnings: 0,
            currency: '$',
            basicExpenses: {
                rent: 0,
                wifi: 0,
                water: 0,
                electricity: 0
            },
            luxuryExpenses: [],
            monthlyGoals: [],
            expenseHistory: {
                daily: [],
                weekly: [],
                monthly: [],
                annual: []
            },
            settings: {
                notifications: true,
                currency: '$'
            }
        };
    }

    async initialize() {
        const result = await chrome.storage.local.get(['financeData']);
        
        if (!result.financeData) {
            await this.saveData(this.defaultData);
            return this.defaultData;
        }
        
        return result.financeData;
    }


    async getData() {
        const result = await chrome.storage.local.get(['financeData']);
        return result.financeData || this.defaultData;
    }

    // Save all data
    async saveData(data) {
        await chrome.storage.local.set({ financeData: data });
    }

    async updateEarnings(amount) {
        const data = await this.getData();
        data.earnings = parseFloat(amount) || 0;
        await this.saveData(data);
        return data;
    }

    async updateBasicExpenses(expenses) {
        const data = await this.getData();
        data.basicExpenses = { ...data.basicExpenses, ...expenses };
        await this.saveData(data);
        return data;
    }

    async addLuxuryExpense(name, amount) {
        const data = await this.getData();
        data.luxuryExpenses.push({
            id: Date.now(),
            name: name,
            amount: parseFloat(amount) || 0
        });
        await this.saveData(data);
        return data;
    }

    async updateLuxuryExpense(id, name, amount) {
        const data = await this.getData();
        const index = data.luxuryExpenses.findIndex(e => e.id === id);
        if (index !== -1) {
            data.luxuryExpenses[index] = {
                id: id,
                name: name,
                amount: parseFloat(amount) || 0
            };
        }
        await this.saveData(data);
        return data;
    }

    async deleteLuxuryExpense(id) {
        const data = await this.getData();
        data.luxuryExpenses = data.luxuryExpenses.filter(e => e.id !== id);
        await this.saveData(data);
        return data;
    }

    async addMonthlyGoal(name, amount) {
        const data = await this.getData();
        data.monthlyGoals.push({
            id: Date.now(),
            name: name,
            amount: parseFloat(amount) || 0
        });
        await this.saveData(data);
        return data;
    }

    async updateMonthlyGoal(id, name, amount) {
        const data = await this.getData();
        const index = data.monthlyGoals.findIndex(g => g.id === id);
        if (index !== -1) {
            data.monthlyGoals[index] = {
                id: id,
                name: name,
                amount: parseFloat(amount) || 0
            };
        }
        await this.saveData(data);
        return data;
    }

    async deleteMonthlyGoal(id) {
        const data = await this.getData();
        data.monthlyGoals = data.monthlyGoals.filter(g => g.id !== id);
        await this.saveData(data);
        return data;
    }

    calculateTotalExpenses(data) {
        let total = 0;
        
        Object.values(data.basicExpenses).forEach(amount => {
            total += parseFloat(amount) || 0;
        });
        
        data.luxuryExpenses.forEach(expense => {
            total += parseFloat(expense.amount) || 0;
        });
        
        data.monthlyGoals.forEach(goal => {
            total += parseFloat(goal.amount) || 0;
        });
        
        return total;
    }

    calculateCategoryTotals(data) {
        let basic = 0;
        let luxury = 0;
        let goals = 0;
        
        Object.values(data.basicExpenses).forEach(amount => {
            basic += parseFloat(amount) || 0;
        });
        
        data.luxuryExpenses.forEach(expense => {
            luxury += parseFloat(expense.amount) || 0;
        });
        

        data.monthlyGoals.forEach(goal => {
            goals += parseFloat(goal.amount) || 0;
        });
        
        return { basic, luxury, goals };
    }


    async recordExpense(amount, category) {
        const data = await this.getData();
        const now = new Date();
        
        const expense = {
            amount: parseFloat(amount) || 0,
            category: category,
            date: now.toISOString()
        };
        

        if (!data.expenseHistory.daily) data.expenseHistory.daily = [];
        data.expenseHistory.daily.push(expense);
        

        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        data.expenseHistory.daily = data.expenseHistory.daily.filter(e => 
            new Date(e.date) > thirtyDaysAgo
        );
        
        await this.saveData(data);
        return data;
    }

    async updateSettings(settings) {
        const data = await this.getData();
        data.settings = { ...data.settings, ...settings };
        await this.saveData(data);
        return data;
    }

    async resetAllData() {
        await this.saveData(this.defaultData);
        return this.defaultData;
    }
}


window.StorageManager = StorageManager;
