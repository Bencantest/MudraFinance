// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Finance Planner Pro installed');
    
    // Set up monthly reminder alarm
    chrome.alarms.create('monthlyReminder', {
        when: getNextMonthStart(),
        periodInMinutes: 43200 // 30 days
    });
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'monthlyReminder') {
        sendMonthlyReminder();
    }
});

// Get timestamp for start of next month
function getNextMonthStart() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.getTime();
}

// Send monthly reminder notification
async function sendMonthlyReminder() {
    const data = await chrome.storage.local.get(['financeData']);
    
    if (!data.financeData || !data.financeData.settings?.notifications) {
        return;
    }

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Monthly Budget Planning',
        message: 'Time to plan your expenses for the new month! Set your monthly goals and review your budget.',
        priority: 2
    });
}

// Listen for notification clicks
chrome.notifications.onClicked.addListener(() => {
    chrome.action.openPopup();
});
