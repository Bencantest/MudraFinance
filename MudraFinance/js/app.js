
class FinancePlannerApp {
    constructor() {
        this.apiKeyManager = new APIKeyManager();
        this.storageManager = new StorageManager();
        this.aiAssistant = new AIAssistant(this.apiKeyManager, this.storageManager);
        this.analyticsManager = new AnalyticsManager(this.storageManager);
        
        this.currentTab = 'dashboard';
        this.financeData = null;
    }

    
    async init() {
        // Initialize storage
        this.financeData = await this.storageManager.initialize();
        
       
        this.setupEventListeners();
        
        await this.loadDashboard();
        await this.loadExpenses();
        await this.analyticsManager.initializeChart();
        await this.updateAnalytics();
    }

    setupEventListeners() {
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        
        document.getElementById('editEarningsBtn').addEventListener('click', () => {
            document.getElementById('earningsDisplay').classList.add('hidden');
            document.getElementById('earningsInput').classList.remove('hidden');
            document.getElementById('earningsValue').value = this.financeData.earnings;
            document.getElementById('earningsValue').focus();
        });

        document.getElementById('saveEarningsBtn').addEventListener('click', () => this.saveEarnings());

        
        document.getElementById('saveExpensesBtn').addEventListener('click', () => this.saveAllExpenses());

        
        document.getElementById('addLuxuryBtn').addEventListener('click', () => this.addLuxuryExpense());

        
        document.getElementById('addGoalBtn').addEventListener('click', () => this.addMonthlyGoal());

     
        document.getElementById('chartPeriod').addEventListener('change', (e) => {
            this.analyticsManager.updateChart(e.target.value);
        });

        document.getElementById('aiSendBtn').addEventListener('click', () => this.sendAIMessage());
        document.getElementById('aiInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendAIMessage();
            }
        });

        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.getElementById('aiInput').value = chip.textContent;
                this.sendAIMessage();
            });
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetDataBtn').addEventListener('click', () => this.resetData());
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

   
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        if (tabName === 'analytics') {
            this.updateAnalytics();
        }
    }

    async loadDashboard() {
        this.financeData = await this.storageManager.getData();
        const currency = this.financeData.currency || '$';
        

        document.getElementById('earningsDisplay').textContent = 
            `${currency}${this.financeData.earnings.toLocaleString()}`;

        const totals = this.storageManager.calculateCategoryTotals(this.financeData);
        const totalExpenses = this.storageManager.calculateTotalExpenses(this.financeData);
        const balance = this.financeData.earnings - totalExpenses;

        document.getElementById('totalIncome').textContent = 
            `${currency}${this.financeData.earnings.toLocaleString()}`;
        document.getElementById('totalExpenses').textContent = 
            `${currency}${totalExpenses.toLocaleString()}`;
        document.getElementById('balance').textContent = 
            `${currency}${balance.toLocaleString()}`;

        const maxExpense = Math.max(totals.basic, totals.luxury, totals.goals, 1);
        
        document.getElementById('basicBar').style.width = 
            `${(totals.basic / maxExpense) * 100}%`;
        document.getElementById('basicValue').textContent = 
            `${currency}${totals.basic.toLocaleString()}`;

        document.getElementById('luxuryBar').style.width = 
            `${(totals.luxury / maxExpense) * 100}%`;
        document.getElementById('luxuryValue').textContent = 
            `${currency}${totals.luxury.toLocaleString()}`;

        document.getElementById('goalsBar').style.width = 
            `${(totals.goals / maxExpense) * 100}%`;
        document.getElementById('goalsValue').textContent = 
            `${currency}${totals.goals.toLocaleString()}`;
    }

    async saveEarnings() {
        const amount = document.getElementById('earningsValue').value;
        await this.storageManager.updateEarnings(amount);
        
        document.getElementById('earningsDisplay').classList.remove('hidden');
        document.getElementById('earningsInput').classList.add('hidden');
        
        await this.loadDashboard();
        await this.updateAnalytics();
    }

    async loadExpenses() {
        this.financeData = await this.storageManager.getData();

        // Load basic expenses
        document.querySelector('[data-expense="rent"]').value = this.financeData.basicExpenses.rent || '';
        document.querySelector('[data-expense="wifi"]').value = this.financeData.basicExpenses.wifi || '';
        document.querySelector('[data-expense="water"]').value = this.financeData.basicExpenses.water || '';
        document.querySelector('[data-expense="electricity"]').value = this.financeData.basicExpenses.electricity || '';
        //luxury Exp
        this.renderLuxuryExpenses();

		//monthly goal
        this.renderMonthlyGoals();
    }

   
    renderLuxuryExpenses() {
        const container = document.getElementById('luxuryExpensesList');
        container.innerHTML = '';

        this.financeData.luxuryExpenses.forEach(expense => {
            const item = this.createExpenseItem(expense, 'luxury');
            container.appendChild(item);
        });
    }


    renderMonthlyGoals() {
        const container = document.getElementById('monthlyGoalsList');
        container.innerHTML = '';

        this.financeData.monthlyGoals.forEach(goal => {
            const item = this.createExpenseItem(goal, 'goal');
            container.appendChild(item);
        });
    }

    createExpenseItem(data, type) {
        const div = document.createElement('div');
        div.className = 'expense-item custom';
        div.innerHTML = `
            <input type="text" class="expense-input" value="${data.name}" 
                   data-id="${data.id}" data-field="name" 
                   placeholder="Name" style="width: 140px;">
            <input type="number" class="expense-input" value="${data.amount}" 
                   data-id="${data.id}" data-field="amount" 
                   placeholder="Amount" style="width: 100px;">
            <button class="delete-expense-btn" data-id="${data.id}" data-type="${type}">
                Delete
            </button>
        `;

        div.querySelector('.delete-expense-btn').addEventListener('click', (e) => {
            this.deleteExpenseItem(e.target.dataset.id, e.target.dataset.type);
        });

        return div;
    }

    async addLuxuryExpense() {
        await this.storageManager.addLuxuryExpense('New Expense', 0);
        await this.loadExpenses();
    }

    async addMonthlyGoal() {
        await this.storageManager.addMonthlyGoal('New Goal', 0);
        await this.loadExpenses();
    }

    async deleteExpenseItem(id, type) {
        const numId = parseInt(id);
        
        if (type === 'luxury') {
            await this.storageManager.deleteLuxuryExpense(numId);
        } else if (type === 'goal') {
            await this.storageManager.deleteMonthlyGoal(numId);
        }
        
        await this.loadExpenses();
        await this.loadDashboard();
    }

    async saveAllExpenses() {
        
        const basicExpenses = {
            rent: parseFloat(document.querySelector('[data-expense="rent"]').value) || 0,
            wifi: parseFloat(document.querySelector('[data-expense="wifi"]').value) || 0,
            water: parseFloat(document.querySelector('[data-expense="water"]').value) || 0,
            electricity: parseFloat(document.querySelector('[data-expense="electricity"]').value) || 0
        };
        await this.storageManager.updateBasicExpenses(basicExpenses);

        
        const luxuryInputs = document.querySelectorAll('#luxuryExpensesList .expense-item');
        for (const item of luxuryInputs) {
            const id = parseInt(item.querySelector('[data-field="name"]').dataset.id);
            const name = item.querySelector('[data-field="name"]').value;
            const amount = parseFloat(item.querySelector('[data-field="amount"]').value) || 0;
            await this.storageManager.updateLuxuryExpense(id, name, amount);
        }

        
        const goalInputs = document.querySelectorAll('#monthlyGoalsList .expense-item');
        for (const item of goalInputs) {
            const id = parseInt(item.querySelector('[data-field="name"]').dataset.id);
            const name = item.querySelector('[data-field="name"]').value;
            const amount = parseFloat(item.querySelector('[data-field="amount"]').value) || 0;
            await this.storageManager.updateMonthlyGoal(id, name, amount);
        }

        // Check if goals are realistic with AI
        const aiWarning = await this.aiAssistant.checkGoalsRealistic();
        if (aiWarning) {
            this.showNotification('Budget Warning', aiWarning, 'warning');
        } else {
            this.showNotification('Success', 'All expenses saved successfully!', 'success');
        }

        await this.loadDashboard();
        await this.updateAnalytics();
    }

    async updateAnalytics() {
        const stats = await this.analyticsManager.calculateStats();
        const currency = this.financeData.currency || '$';

        document.getElementById('avgDaily').textContent = `${currency}${stats.avgDaily}`;
        document.getElementById('highestExpense').textContent = `${currency}${stats.highestExpense}`;
        document.getElementById('savingsRate').textContent = `${stats.savingsRate}%`;
        document.getElementById('budgetStatus').textContent = stats.budgetStatus;

        // Update color based on status
        const statusEl = document.getElementById('budgetStatus');
        statusEl.style.color = stats.budgetStatus === 'Over Budget' ? '#ef4444' : 
                               stats.budgetStatus === 'Excellent' ? '#10b981' : '#667eea';
    }

    async sendAIMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Check if API key is set
        const isUsingBuiltIn = await this.apiKeyManager.isUsingBuiltInKey();
        if (isUsingBuiltIn) {

            console.log('Using built-in API key');
        }


        this.addChatMessage(message, 'user');
        input.value = '';


        const loadingId = this.addChatMessage('Thinking...', 'assistant', true);

        try {

            const response = await this.aiAssistant.callGroqAPI(message);
            
            document.getElementById(loadingId).remove();
            this.addChatMessage(response, 'assistant');
        } catch (error) {
            document.getElementById(loadingId).remove();
            
            if (error.message.includes('API key')) {
                this.addChatMessage('⚠️ API Error: Please check your API key in settings or use the built-in free tier.', 'assistant');
                this.openSettings();
            } else {
                this.addChatMessage('⚠️ Sorry, I encountered an error. Please try again.', 'assistant');
            }
            
            console.error('AI Error:', error);
        }
    }

    addChatMessage(text, role, isLoading = false) {
        const chat = document.getElementById('aiChat');
        const messageDiv = document.createElement('div');
        const messageId = `msg-${Date.now()}`;
        messageDiv.id = messageId;
        messageDiv.className = `ai-message ${role}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isLoading) {
            bubble.innerHTML = `
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
        } else {
            bubble.textContent = text;
        }
        
        messageDiv.appendChild(bubble);
        chat.appendChild(messageDiv);
        

        chat.scrollTop = chat.scrollHeight;
        
        return messageId;
    }


    async openSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('hidden');

        const data = await this.storageManager.getData();
        const apiKey = await chrome.storage.local.get(['groqApiKey']);
        
        if (apiKey.groqApiKey) {
            document.getElementById('apiKeyInput').value = apiKey.groqApiKey;
        }
        
        document.getElementById('currencySelect').value = data.settings?.currency || '$';
        document.getElementById('notificationsToggle').checked = data.settings?.notifications !== false;
    }

    closeSettings() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    async saveSettings() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const currency = document.getElementById('currencySelect').value;
        const notifications = document.getElementById('notificationsToggle').checked;

        if (apiKey) {
            await this.apiKeyManager.saveAPIKey(apiKey);
        } else {
            await this.apiKeyManager.clearAPIKey();
        }

        await this.storageManager.updateSettings({ currency, notifications });

        this.closeSettings();
        this.showNotification('Success', 'Settings saved successfully!', 'success');
        

        await this.loadDashboard();
    }

    async resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            await this.storageManager.resetAllData();
            this.aiAssistant.clearHistory();
            
            this.closeSettings();
            await this.loadDashboard();
            await this.loadExpenses();
            await this.updateAnalytics();
            
            this.showNotification('Success', 'All data has been reset.', 'success');
        }
    }

    showNotification(title, message, type = 'info') {

        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FinancePlannerApp();
    app.init();
});
