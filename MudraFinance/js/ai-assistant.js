// AI Assistant powered by Groq
class AIAssistant {
    constructor(apiKeyManager, storageManager) {
        this.apiKeyManager = apiKeyManager;
        this.storageManager = storageManager;
        this.conversationHistory = [];
    }

   
    async callGroqAPI(userMessage) {
        const apiKey = await this.apiKeyManager.getAPIKey();
        const financeData = await this.storageManager.getData();
        
        const context = this.buildFinanceContext(financeData);
        
        const messages = [
            {
                role: "system",
                content: `You are an expert AI financial advisor. You help users manage their personal finances, create budgets, and achieve their financial goals. 

Current user financial data:
${context}

Your role be brief and straight to the point:
1. Analyze the user's financial situation
2. Provide practical advice on budgeting and saving
3. Alert users if their expenses exceed their income
4. Suggest ways to optimize spending
5. Help users prioritize their financial goals
6. Be encouraging but realistic about financial decisions

Always be specific, actionable, and use the actual numbers from their financial data. If their goals are unrealistic given their earnings, politely explain why and suggest alternatives.`
            },
            ...this.conversationHistory.slice(-5), // Keep last 5 messages for context
            {
                role: "user",
                content: userMessage
            }
        ];

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: messages,
                    model: "openai/gpt-oss-120b",
                    temperature: 0.7,
                    max_completion_tokens: 1024,
                    top_p: 1,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            // Update conversation history
            this.conversationHistory.push({
                role: "user",
                content: userMessage
            });
            this.conversationHistory.push({
                role: "assistant",
                content: assistantMessage
            });

            return assistantMessage;
        } catch (error) {
            console.error('Groq API error:', error);
            throw error;
        }
    }


    buildFinanceContext(data) {
        const totals = this.storageManager.calculateCategoryTotals(data);
        const totalExpenses = this.storageManager.calculateTotalExpenses(data);
        const balance = data.earnings - totalExpenses;
        
        let context = `Monthly Earnings: ${data.currency}${data.earnings.toLocaleString()}\n\n`;
        
        context += `Basic Expenses (Total: ${data.currency}${totals.basic.toLocaleString()}):\n`;
        context += `- Rent: ${data.currency}${data.basicExpenses.rent}\n`;
        context += `- WiFi: ${data.currency}${data.basicExpenses.wifi}\n`;
        context += `- Water: ${data.currency}${data.basicExpenses.water}\n`;
        context += `- Electricity: ${data.currency}${data.basicExpenses.electricity}\n\n`;
        
        if (data.luxuryExpenses.length > 0) {
            context += `Luxury Expenses (Total: ${data.currency}${totals.luxury.toLocaleString()}):\n`;
            data.luxuryExpenses.forEach(expense => {
                context += `- ${expense.name}: ${data.currency}${expense.amount}\n`;
            });
            context += '\n';
        }
        
        if (data.monthlyGoals.length > 0) {
            context += `Monthly Goals (Total: ${data.currency}${totals.goals.toLocaleString()}):\n`;
            data.monthlyGoals.forEach(goal => {
                context += `- ${goal.name}: ${data.currency}${goal.amount}\n`;
            });
            context += '\n';
        }
        
        context += `Total Expenses: ${data.currency}${totalExpenses.toLocaleString()}\n`;
        context += `Remaining Balance: ${data.currency}${balance.toLocaleString()}\n`;
        
        if (balance < 0) {
            context += `⚠️ WARNING: Expenses exceed earnings by ${data.currency}${Math.abs(balance).toLocaleString()}\n`;
        }
        
        return context;
    }

    async analyzeBudget() {
        const message = "Please analyze my current budget and financial situation. Are my expenses reasonable? Do I have any concerning spending patterns? What can I improve?";
        return await this.callGroqAPI(message);
    }

    // 
    async checkGoalsRealistic() {
        const financeData = await this.storageManager.getData();
        const totalExpenses = this.storageManager.calculateTotalExpenses(financeData);
        
        if (totalExpenses > financeData.earnings) {
            const overage = totalExpenses - financeData.earnings;
            const message = `My total expenses (${financeData.currency}${totalExpenses.toLocaleString()}) exceed my earnings (${financeData.currency}${financeData.earnings.toLocaleString()}) by ${financeData.currency}${overage.toLocaleString()}. Please help me understand which expenses I should reduce or eliminate, and suggest a more realistic budget.`;
            return await this.callGroqAPI(message);
        }
        
        return null;
    }

    
    async getSavingsSuggestions() {
        const message = "Based on my current financial situation, what are the best ways I can save money? Please provide specific, actionable suggestions.";
        return await this.callGroqAPI(message);
    }

    
    clearHistory() {
        this.conversationHistory = [];
    }
}


window.AIAssistant = AIAssistant;
