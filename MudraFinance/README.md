# AI Finance Planner Pro - Chrome Extension

A powerful, AI-powered personal finance planning Chrome extension with smart budgeting, expense tracking, and intelligent financial advice.

## 🌟 Features

### Core Features
- **Monthly Earnings Management**: Set and track your monthly income
- **Basic Expenses Tracking**: Manage essential expenses (Rent, WiFi, Water, Electricity)
- **Luxury Expenses**: Track discretionary spending (dates, clothes, entertainment, etc.)
- **Monthly Goals**: Set financial goals for each month
- **Real-time Balance Calculation**: See your remaining budget instantly

### AI-Powered Intelligence
- **Smart Budget Analysis**: AI analyzes your spending patterns and provides insights
- **Goal Validation**: AI checks if your monthly goals are realistic given your earnings
- **Financial Advice**: Get personalized recommendations for saving and budgeting
- **Natural Conversation**: Chat with the AI about your finances in plain language
- **Budget Warnings**: Automatic alerts when expenses exceed earnings

### Analytics & Visualization
- **Interactive Charts**: Beautiful Chart.js visualizations
- **Multiple Time Periods**: View expenses daily, weekly, monthly, or annually
- **Key Statistics**:
  - Average daily spending
  - Highest expense category
  - Savings rate
  - Budget status tracking

### Beautiful UI
- **Modern Gradient Design**: Stunning purple gradient theme
- **Smooth Animations**: Polished transitions and interactions
- **Responsive Layout**: Perfect fit in Chrome extension popup
- **Intuitive Navigation**: Tab-based interface for easy access

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download or Clone this repository**
   ```bash
   git clone <repository-url>
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click the puzzle icon → "Manage Extensions"

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `finance-planner-extension` folder

5. **Pin the Extension**
   - Click the puzzle icon in Chrome toolbar
   - Click the pin icon next to "AI Finance Planner Pro"

### Method 2: Install from ZIP

1. Download the extension as a ZIP file
2. Extract to a folder
3. Follow steps 2-5 from Method 1

## 📖 Usage Guide

### Getting Started

1. **Set Your Monthly Earnings**
   - Click the "Edit" button on the earnings card
   - Enter your monthly income
   - Click "Save"

2. **Add Basic Expenses**
   - Go to the "Expenses" tab
   - Fill in your regular monthly expenses (rent, utilities, etc.)

3. **Add Luxury Expenses** (Optional)
   - Click "+ Add" in the Luxury Expenses section
   - Name your expense (e.g., "Date nights", "Shopping")
   - Enter the monthly budget amount

4. **Set Monthly Goals**
   - Click "+ Add Goal" in the Monthly Goals section
   - Define what you want to save for
   - Set the target amount

5. **Save Your Budget**
   - Click "Save All Expenses"
   - The AI will automatically check if your budget is realistic

### Using the AI Assistant

#### Free Tier (Built-in API)
The extension comes with a built-in API key that allows free usage. Just start chatting!

#### Using Your Own Groq API Key (Recommended for Heavy Use)

1. **Get a Groq API Key**
   - Visit [Groq Console](https://console.groq.com)
   - Sign up for a free account
   - Generate an API key

2. **Add Your API Key**
   - Click the settings icon (⚙️)
   - Paste your Groq API key
   - Click "Save Settings"

#### AI Features

**Quick Suggestions:**
- "Analyze my budget"
- "Suggest savings plan"
- "Review monthly goals"

**Custom Questions:**
- "How can I save more money this month?"
- "Are my expenses reasonable?"
- "What should I cut from my budget?"
- "Help me plan for a $500 purchase"

### Analytics Dashboard

1. **View Expense Charts**
   - Navigate to the "Analytics" tab
   - Use the dropdown to switch between:
     - Daily (last 7 days)
     - Weekly (last 4 weeks)
     - Monthly (current month)
     - Annual (last 12 months)

2. **Check Statistics**
   - Average daily spending
   - Highest expense category
   - Savings rate percentage
   - Budget status

### Settings

Access settings by clicking the ⚙️ icon:

- **Groq API Key**: Add your personal API key
- **Currency**: Choose your preferred currency symbol
- **Budget Alerts**: Toggle notifications on/off
- **Reset Data**: Clear all stored information

## 🔒 Privacy & Security

- **Local Storage**: All your financial data is stored locally in Chrome
- **No Data Collection**: We don't collect or transmit your personal data
- **Encrypted API Keys**: API keys are stored securely in Chrome's storage
- **API Key Obfuscation**: Built-in API key is obfuscated in the code

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 4.4.0
- **AI**: Groq API (GPT-OSS-120B model)
- **Storage**: Chrome Storage API
- **Icons**: Custom generated with PIL

### File Structure
```
finance-planner-extension/
├── manifest.json                 # Extension configuration
├── popup.html                    # Main UI
├── css/
│   └── styles.css               # All styling
├── js/
│   ├── app.js                   # Main application logic
│   ├── api-key-manager.js       # API key handling & obfuscation
│   ├── storage.js               # Data storage management
│   ├── ai-assistant.js          # AI integration
│   ├── analytics.js             # Charts & statistics
│   └── background.js            # Service worker
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### API Key Obfuscation Algorithm

The built-in API key is obfuscated using a custom character mapping algorithm:
- Letters: Shifted using a custom substitution cipher
- Numbers: Reversed (0→9, 1→8, etc.)
- Underscores: Preserved
- Decoded at runtime for API calls

## 🎨 Customization

### Changing Colors
Edit `css/styles.css` and modify the CSS variables:
```css
:root {
    --primary: #667eea;        /* Main purple */
    --secondary: #764ba2;      /* Secondary purple */
    --success: #10b981;        /* Success green */
    --danger: #ef4444;         /* Danger red */
    /* ... */
}
```

### Adding New Expense Categories
Modify the `basicExpenses` section in `popup.html` to add new fixed expense types.

## 🐛 Troubleshooting

### AI Not Responding
1. Check your internet connection
2. Verify API key in settings (or use built-in free tier)
3. Check browser console for error messages

### Data Not Saving
1. Ensure Chrome has storage permissions
2. Check if extension is properly loaded
3. Try reloading the extension

### Chart Not Displaying
1. Ensure Chart.js CDN is accessible
2. Check browser console for errors
3. Try refreshing the extension popup

## 📝 Future Enhancements

Potential features for future versions:
- [ ] Export data to CSV/PDF
- [ ] Recurring expenses automation
- [ ] Bill payment reminders
- [ ] Category-based budgeting
- [ ] Multi-currency support
- [ ] Dark mode theme
- [ ] Income vs. Expenses comparison charts
- [ ] Goal progress tracking
- [ ] Integration with bank accounts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Best Results

1. **Be Honest with Numbers**: Enter accurate income and expenses
2. **Update Regularly**: Review and update your budget monthly
3. **Use AI Advice**: Leverage the AI assistant for better financial decisions
4. **Track Consistently**: Regular tracking leads to better insights
5. **Set Realistic Goals**: Start small and build up

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- Groq for powerful AI capabilities
- Chrome Extensions API for the platform

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the usage guide

---

**Happy Budgeting! 💰**

Made with ❤️ for better financial planning
