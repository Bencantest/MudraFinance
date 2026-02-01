// API Key Manager with obfuscation
class APIKeyManager {
    constructor() {
       
        this.obfuscatedKey = this.encodeKey();
    }

    // Encoding algorithm for obfuscation
    encodeKey() {
        // Character mapping for obfuscation
        const charMap = {
            'a': 'q', 'b': 'w', 'c': 'e', 'd': 'r', 'e': 't', 'f': 'y', 'g': 'u',
            'h': 'i', 'i': 'o', 'j': 'p', 'k': 'a', 'l': 's', 'm': 'd', 'n': 'f',
            'o': 'g', 'p': 'h', 'q': 'j', 'r': 'k', 's': 'l', 't': 'z', 'u': 'x',
            'v': 'c', 'w': 'v', 'x': 'b', 'y': 'n', 'z': 'm',
            'A': 'Q', 'B': 'W', 'C': 'E', 'D': 'R', 'E': 'T', 'F': 'Y', 'G': 'U',
            'H': 'I', 'I': 'O', 'J': 'P', 'K': 'A', 'L': 'S', 'M': 'D', 'N': 'F',
            'O': 'G', 'P': 'H', 'Q': 'J', 'R': 'K', 'S': 'L', 'T': 'Z', 'U': 'X',
            'V': 'C', 'W': 'V', 'X': 'B', 'Y': 'N', 'Z': 'M',
            '0': '9', '1': '8', '2': '7', '3': '6', '4': '5', '5': '4',
            '6': '3', '7': '2', '8': '1', '9': '0',
            '_': '_'
        };

        const originalKey = "gsk_GotYouAssHoleZdThd0ktcVKu9TSpiYU_CANFuckOFFWGdyb3FYXiJWUJrZE4kbBM2mvexcnl1";
        
        let encoded = '';
        for (let char of originalKey) {
            encoded += charMap[char] || char;
        }
        
        return encoded;
    }

    // Decoding algorithm
    decodeKey(encodedKey) {
        const reverseMap = {
            'q': 'a', 'w': 'b', 'e': 'c', 'r': 'd', 't': 'e', 'y': 'f', 'u': 'g',
            'i': 'h', 'o': 'i', 'p': 'j', 'a': 'k', 's': 'l', 'd': 'm', 'f': 'n',
            'g': 'o', 'h': 'p', 'j': 'q', 'k': 'r', 'l': 's', 'z': 't', 'x': 'u',
            'c': 'v', 'v': 'w', 'b': 'x', 'n': 'y', 'm': 'z',
            'Q': 'A', 'W': 'B', 'E': 'C', 'R': 'D', 'T': 'E', 'Y': 'F', 'U': 'G',
            'I': 'H', 'O': 'I', 'P': 'J', 'A': 'K', 'S': 'L', 'D': 'M', 'F': 'N',
            'G': 'O', 'H': 'P', 'J': 'Q', 'K': 'R', 'L': 'S', 'Z': 'T', 'X': 'U',
            'C': 'V', 'V': 'W', 'B': 'X', 'N': 'Y', 'M': 'Z',
            '9': '0', '8': '1', '7': '2', '6': '3', '5': '4', '4': '5',
            '3': '6', '2': '7', '1': '8', '0': '9',
            '_': '_'
        };

        let decoded = '';
        for (let char of encodedKey) {
            decoded += reverseMap[char] || char;
        }
        
        return decoded;
    }

    async getAPIKey() {
        const result = await chrome.storage.local.get(['groqApiKey']);
        
        if (result.groqApiKey && result.groqApiKey.trim() !== '') {
            return result.groqApiKey;
        }
        
        return this.decodeKey(this.obfuscatedKey);
    }

    async saveAPIKey(apiKey) {
        await chrome.storage.local.set({ groqApiKey: apiKey });
    }


    async isUsingBuiltInKey() {
        const result = await chrome.storage.local.get(['groqApiKey']);
        return !result.groqApiKey || result.groqApiKey.trim() === '';
    }

    
    async clearAPIKey() {
        await chrome.storage.local.remove('groqApiKey');
    }
}

// Export for use in other modules
window.APIKeyManager = APIKeyManager;
