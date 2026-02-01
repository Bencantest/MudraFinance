# Developer Guide - AI Finance Planner Pro

## 🛠️ For Developers

This guide is for developers who want to understand, modify, or extend the AI Finance Planner Pro Chrome extension.

## Architecture Overview

### Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Charts**: Chart.js 4.4.0
- **AI**: Groq API (GPT-OSS-120B model)
- **Storage**: Chrome Storage API (chrome.storage.local)
- **Build**: No build process - pure vanilla JS

### File Structure

```
finance-planner-extension/
│
├── manifest.json              # Extension configuration
├── popup.html                 # Main UI (420x600px)
│
├── css/
│   └── styles.css            # All styling (responsive)
│
├── js/
│   ├── app.js                # Main application controller
│   ├── api-key-manager.js    # API key handling & obfuscation
│   ├── storage.js            # Data persistence layer
│   ├── ai-assistant.js       # Groq API integration
│   ├── analytics.js          # Chart.js & statistics
│   └── background.js         # Service worker (notifications)
│
└── icons/
    ├── icon16.png            # Toolbar icon
    ├── icon48.png            # Extension management
    └── icon128.png           # Chrome Web Store
```

## Module Breakdown

### 1. api-key-manager.js
**Purpose**: Secure API key management

**Key Features:**
- Obfuscation algorithm for built-in API key
- Encoding/decoding functions
- Storage of user's custom API key
- Fallback to built-in key

**Algorithm Details:**
```javascript
Character Mapping:
- Letters: Custom substitution (a→q, b→w, etc.)
- Numbers: Reverse mapping (0→9, 1→8, etc.)
- Underscores: Preserved

Decode at Runtime: O(n) complexity
Security: Obfuscation, not encryption
```

**API:**
```javascript
const apiManager = new APIKeyManager();

// Get active API key (user's or built-in)
await apiManager.getAPIKey();

// Save user's API key
await apiManager.saveAPIKey(apiKey);

// Check if using built-in
await apiManager.isUsingBuiltInKey();

// Clear user's API key
await apiManager.clearAPIKey();
```

### 2. storage.js
**Purpose**: Data persistence and management

**Data Structure:**
```javascript
{
  earnings: Number,
  currency: String,
  basicExpenses: {
    rent: Number,
    wifi: Number,
    water: Number,
    electricity: Number
  },
  luxuryExpenses: [
    { id: Number, name: String, amount: Number }
  ],
  monthlyGoals: [
    { id: Number, name: String, amount: Number }
  ],
  expenseHistory: {
    daily: Array,
    weekly: Array,
    monthly: Array,
    annual: Array
  },
  settings: {
    notifications: Boolean,
    currency: String
  }
}
```

**API:**
```javascript
const storage = new StorageManager();

// Initialize storage
await storage.initialize();

// Get all data
const data = await storage.getData();

// Update earnings
await storage.updateEarnings(amount);

// Add/update/delete expenses
await storage.addLuxuryExpense(name, amount);
await storage.updateLuxuryExpense(id, name, amount);
await storage.deleteLuxuryExpense(id);

// Calculate totals
const totals = storage.calculateCategoryTotals(data);
const total = storage.calculateTotalExpenses(data);
```

### 3. ai-assistant.js
**Purpose**: AI integration and context building

**Key Features:**
- Groq API integration
- Conversation history (last 5 messages)
- Financial context building
- Budget validation

**API Call Structure:**
```javascript
POST https://api.groq.com/openai/v1/chat/completions
Headers:
  - Content-Type: application/json
  - Authorization: Bearer {API_KEY}

Body:
{
  model: "openai/gpt-oss-120b",
  temperature: 0.7,
  max_completion_tokens: 1024,
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

**Context Building:**
The AI receives structured financial data in the system prompt:
```
Monthly Earnings: $5000

Basic Expenses (Total: $2000):
- Rent: $1500
- WiFi: $50
...

Luxury Expenses (Total: $500):
...

Total Expenses: $2500
Remaining Balance: $2500
```

**API:**
```javascript
const ai = new AIAssistant(apiKeyManager, storageManager);

// Send message and get response
const response = await ai.callGroqAPI(userMessage);

// Analyze budget
const analysis = await ai.analyzeBudget();

// Check if goals are realistic
const warning = await ai.checkGoalsRealistic();

// Get savings suggestions
const suggestions = await ai.getSavingsSuggestions();

// Clear conversation history
ai.clearHistory();
```

### 4. analytics.js
**Purpose**: Data visualization and statistics

**Chart Configuration:**
```javascript
Chart.js Line Chart:
- Type: line
- Datasets: 3 (Basic, Luxury, Goals)
- Options:
  - Responsive: true
  - Animations: smooth (tension: 0.4)
  - Fill: gradient under lines
  - Tooltips: on hover
  - Legend: bottom
```

**Time Periods:**
- **Daily**: Last 7 days with variance
- **Weekly**: Last 4 weeks with variance
- **Monthly**: Current month by weeks
- **Annual**: Last 12 months with variance

**Statistics Calculation:**
```javascript
avgDaily = totalExpenses / 30
savingsRate = (balance / earnings) * 100
budgetStatus = 
  balance < 0 ? "Over Budget"
  : savingsRate < 10 ? "Tight Budget"
  : savingsRate > 30 ? "Excellent"
  : "On Track"
```

**API:**
```javascript
const analytics = new AnalyticsManager(storageManager);

// Initialize chart
await analytics.initializeChart();

// Update chart period
await analytics.updateChart('monthly');

// Calculate statistics
const stats = await analytics.calculateStats();
// Returns: {avgDaily, highestExpense, savingsRate, budgetStatus}
```

### 5. app.js
**Purpose**: Main application controller and event handling

**Initialization Flow:**
```
1. Create manager instances
2. Initialize storage
3. Setup event listeners
4. Load dashboard data
5. Load expenses
6. Initialize chart
7. Update analytics
```

**Event Listeners:**
- Tab navigation
- Earnings edit/save
- Expense management (add/delete/save)
- Chart period change
- AI message send
- Settings modal
- Keyboard shortcuts

### 6. background.js
**Purpose**: Service worker for background tasks

**Features:**
- Monthly reminder alarm
- Notification creation
- Extension lifecycle management

**Alarm Schedule:**
```javascript
chrome.alarms.create('monthlyReminder', {
  when: getNextMonthStart(),
  periodInMinutes: 43200  // 30 days
});
```

## Customization Guide

### Adding New Expense Categories

1. **Update HTML** (popup.html):
```html
<div class="expense-item">
    <span>Your New Category</span>
    <input type="number" class="expense-input" 
           data-expense="newcategory" placeholder="0">
</div>
```

2. **Update Storage** (storage.js):
```javascript
basicExpenses: {
    rent: 0,
    wifi: 0,
    water: 0,
    electricity: 0,
    newcategory: 0  // Add here
}
```

3. **Update Load Function** (app.js):
```javascript
document.querySelector('[data-expense="newcategory"]').value = 
    this.financeData.basicExpenses.newcategory || '';
```

4. **Update Save Function** (app.js):
```javascript
const basicExpenses = {
    rent: parseFloat(document.querySelector('[data-expense="rent"]').value) || 0,
    // ... other expenses
    newcategory: parseFloat(document.querySelector('[data-expense="newcategory"]').value) || 0
};
```

### Changing Color Scheme

Edit `css/styles.css`:
```css
:root {
    --primary: #667eea;      /* Main color */
    --secondary: #764ba2;    /* Secondary color */
    --success: #10b981;      /* Success states */
    --danger: #ef4444;       /* Error states */
    --warning: #f59e0b;      /* Warning states */
}
```

### Adding New Chart Types

1. **Add option to select** (popup.html):
```html
<select id="chartType">
    <option value="line">Line Chart</option>
    <option value="bar">Bar Chart</option>
    <option value="pie">Pie Chart</option>
</select>
```

2. **Update chart initialization** (analytics.js):
```javascript
initializeChart(type = 'line') {
    this.chart = new Chart(ctx, {
        type: type,  // Use parameter
        // ... rest of config
    });
}
```

### Adding New AI Prompts

Update suggestion chips in popup.html:
```html
<button class="suggestion-chip">Your new prompt</button>
```

Add event listener in app.js (automatically handled by existing code).

### Extending Data Storage

1. **Add to default data** (storage.js):
```javascript
this.defaultData = {
    // ... existing fields
    newFeature: {
        data: []
    }
};
```

2. **Create methods**:
```javascript
async addToNewFeature(item) {
    const data = await this.getData();
    data.newFeature.data.push(item);
    await this.saveData(data);
    return data;
}
```

## API Integration

### Groq API Details

**Endpoint:**
```
https://api.groq.com/openai/v1/chat/completions
```

**Model:**
```
openai/gpt-oss-120b
```

**Parameters:**
- `temperature`: 0.7 (balanced creativity)
- `max_completion_tokens`: 1024
- `top_p`: 1
- `stream`: false

**Rate Limits:**
- Free tier: Limited requests/day
- Paid: Based on plan

### Error Handling

```javascript
try {
    const response = await fetch(API_URL, options);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API failed');
    }
    
    const data = await response.json();
    // Process data
} catch (error) {
    // Handle error
    console.error('API Error:', error);
}
```

## Testing

### Manual Testing Checklist

- [ ] Install extension
- [ ] Set earnings
- [ ] Add all expense types
- [ ] Save and verify persistence
- [ ] Switch between tabs
- [ ] Test chart period changes
- [ ] Send AI messages
- [ ] Check settings save
- [ ] Test data reset
- [ ] Verify calculations

### Chrome DevTools

1. Right-click extension popup
2. Select "Inspect"
3. Check Console for errors
4. Use Application tab to view storage

### Debug Mode

Add to app.js for debugging:
```javascript
const DEBUG = true;

if (DEBUG) {
    console.log('Data:', this.financeData);
    console.log('Totals:', totals);
}
```

## Performance Optimization

### Current Optimizations
- Minimal DOM manipulation
- Event delegation where possible
- Cached selectors
- Debounced inputs (where needed)
- Lazy chart initialization

### Future Improvements
- Virtual scrolling for long lists
- Web Workers for calculations
- IndexedDB for large datasets
- Service Worker caching

## Security Considerations

### API Key Storage
- User keys: Chrome Storage (encrypted)
- Built-in key: Obfuscated in code
- Never logged or transmitted outside API

### Data Privacy
- All data stored locally
- No external analytics
- No user tracking
- Manifest permissions minimal

### XSS Prevention
- No innerHTML with user data
- Text content only
- Input sanitization
- CSP headers (future)

## Contributing

### Code Style
- ES6+ features
- 4-space indentation
- Camel case variables
- Clear function names
- Comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add: Description"

# Push and create PR
git push origin feature/new-feature
```

### Pull Request Template
```markdown
## Description
What does this PR do?

## Changes
- Change 1
- Change 2

## Testing
How was this tested?

## Screenshots
If UI changes
```

## Debugging Common Issues

### Storage Not Persisting
- Check Chrome permissions
- Verify await on async calls
- Console log before/after save

### Chart Not Rendering
- Check Chart.js CDN loaded
- Verify canvas element exists
- Console log chart data

### AI Not Responding
- Verify internet connection
- Check API key validity
- Log request/response
- Check CORS (shouldn't be issue)

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Groq API Docs](https://console.groq.com/docs)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

## License

MIT License - See LICENSE file for details

---

**Happy Coding! 💻**

For questions or issues, please open a GitHub issue.
