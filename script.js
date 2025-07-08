
// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top when switching sections
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = 0;
        
        // Add a typing effect to the prompt
        typewritePrompt(targetSection);
    }
}

function showPost(postId) {
    showSection(postId);
}

function showMain() {
    showSection('main');
}

// Typewriter effect for prompts
function typewritePrompt(section) {
    const prompt = section.querySelector('.prompt');
    if (!prompt) return;
    
    const originalText = prompt.textContent;
    prompt.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        prompt.textContent = originalText.slice(0, i);
        i++;
        
        if (i > originalText.length) {
            clearInterval(typeInterval);
        }
    }, 20);
}

// Enhanced cursor blinking
function enhanceCursor() {
    const cursors = document.querySelectorAll('.cursor');
    cursors.forEach(cursor => {
        // Add random blinking delays for more realistic effect
        const delay = Math.random() * 2;
        cursor.style.animationDelay = `${delay}s`;
    });
}

// Terminal sound effects (optional)
function playTypingSound() {
    // Create a subtle typing sound effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add keyboard navigation
function handleKeyboard(event) {
    // ESC key goes back to main
    if (event.key === 'Escape') {
        showMain();
    }
    
    // Number keys 1-4 to navigate to posts
    const postNumber = parseInt(event.key);
    if (postNumber >= 1 && postNumber <= 4) {
        showPost(`post${postNumber}`);
    }
    
    // Add typing sound on any key press
    if (event.key.length === 1) {
        playTypingSound();
    }
}

// Matrix-style background effect (subtle)
function createMatrixEffect() {
    const chars = '01';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const span = document.createElement('span');
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
            span.style.position = 'fixed';
            span.style.left = Math.random() * window.innerWidth + 'px';
            span.style.top = '-20px';
            span.style.color = 'rgba(255, 140, 0, 0.1)';
            span.style.fontSize = '12px';
            span.style.fontFamily = 'Fira Code, monospace';
            span.style.pointerEvents = 'none';
            span.style.zIndex = '-1';
            
            document.body.appendChild(span);
            
            // Animate falling
            const fallDuration = 3000 + Math.random() * 2000;
            span.animate([
                { transform: 'translateY(-20px)', opacity: 0.3 },
                { transform: `translateY(${window.innerHeight + 20}px)`, opacity: 0 }
            ], {
                duration: fallDuration,
                easing: 'linear'
            }).onfinish = () => {
                document.body.removeChild(span);
            };
        }, Math.random() * 5000);
    }
}

// Command system
const commands = {
    'help': {
        description: 'Show available commands',
        execute: () => {
            return `Available commands:
- ls: List files in current directory
- cd <filename>: Open a blog post
- cat <filename>: Display file contents
- clear: Clear the terminal
- help: Show this help message

Available files:
- "Grow A Garden.md"
- "Rivals.md"
- "Dead Rails.md"
- "Do Big Studios.md"

Examples:
- cd rivals.md
- cd "Dead Rails.md"
- cat "Grow A Garden.md"`;
        }
    },
    'ls': {
        description: 'List files',
        execute: () => {
            return `total 4
-rw-r--r-- 1 user user 1024 Dec 15 10:30 Grow A Garden.md
-rw-r--r-- 1 user user 2048 Dec 14 14:22 Rivals.md
-rw-r--r-- 1 user user 1536 Dec 13 09:15 Dead Rails.md
-rw-r--r-- 1 user user  892 Dec 12 16:45 Do Big Studios.md`;
        }
    },
    'clear': {
        description: 'Clear terminal',
        execute: () => {
            const output = document.querySelector('#commandOutput');
            if (output) {
                output.innerHTML = '';
            }
            return '';
        }
    }
};

// File mappings
const fileMap = {
    'grow a garden.md': 'post1',
    'rivals.md': 'post2',
    'dead rails.md': 'post3',
    'do big studios.md': 'post4'
};

function executeCommand(input) {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ').replace(/['"]/g, '').toLowerCase();
    
    if (command === 'cd') {
        if (!args) {
            return { type: 'error', message: 'cd: missing operand' };
        }
        
        const postId = fileMap[args];
        if (postId) {
            setTimeout(() => showPost(postId), 100);
            return { type: 'success', message: `Opening ${args}...` };
        } else {
            return { type: 'error', message: `cd: ${args}: No such file or directory` };
        }
    }
    
    if (command === 'cat') {
        if (!args) {
            return { type: 'error', message: 'cat: missing operand' };
        }
        
        const postId = fileMap[args];
        if (postId) {
            setTimeout(() => showPost(postId), 100);
            return { type: 'success', message: `Displaying contents of ${args}...` };
        } else {
            return { type: 'error', message: `cat: ${args}: No such file or directory` };
        }
    }
    
    if (commands[command]) {
        const result = commands[command].execute();
        return { type: 'output', message: result };
    }
    
    return { type: 'error', message: `${command}: command not found. Type 'help' for available commands.` };
}

function handleCommandInput(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim();
        if (!input) return;
        
        // Add command to output
        addCommandToOutput(input);
        
        // Execute command
        const result = executeCommand(input);
        if (result.message) {
            addOutputMessage(result.message, result.type);
        }
        
        // Clear input
        event.target.value = '';
        
        // Play typing sound
        playTypingSound();
    }
}

function addCommandToOutput(command) {
    let output = document.querySelector('#commandOutput');
    if (!output) {
        output = document.createElement('div');
        output.id = 'commandOutput';
        const mainSection = document.querySelector('#main .output');
        mainSection.appendChild(output);
    }
    
    const commandDiv = document.createElement('div');
    commandDiv.className = 'command-output';
    commandDiv.innerHTML = `<span class="user">guest@BloxyTerminal</span><span class="separator">:</span><span class="path">~</span><span class="dollar">$</span> ${command}`;
    output.appendChild(commandDiv);
}

function addOutputMessage(message, type = 'output') {
    const output = document.querySelector('#commandOutput');
    if (!output) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `command-${type}`;
    messageDiv.textContent = message;
    output.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    const terminalBody = document.querySelector('.terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Set up command input
    const commandInput = document.querySelector('#commandInput');
    if (commandInput) {
        commandInput.addEventListener('keydown', handleCommandInput);
        commandInput.focus();
    }
    
    // Enhanced cursor effects
    enhanceCursor();
    
    // Start subtle matrix effect
    setInterval(createMatrixEffect, 2000);
    
    // Add click handlers for file links (backup to onclick)
    const fileLinks = document.querySelectorAll('.file-link');
    fileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            playTypingSound();
        });
    });
    
    // Add click handlers for back links
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            playTypingSound();
        });
    });
    
    // Show welcome message in console
    console.log('%cWelcome to Orange Terminal Blog!', 'color: #ff8c00; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard shortcuts:', 'color: #ffb84d; font-weight: bold;');
    console.log('%c- ESC: Return to main directory', 'color: #d4af37;');
    console.log('%c- 1-4: Navigate to posts directly', 'color: #d4af37;');
    console.log('%c- Type commands like: cd rivals.md', 'color: #d4af37;');
    console.log('%c- Type "help" for all available commands', 'color: #d4af37;');
});

// Add some fun Easter eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg: Matrix rain effect
        document.body.style.background = 'linear-gradient(45deg, #1a0f0a, #2a1f1a)';
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createMatrixEffect(), i * 100);
        }
        
        console.log('%c🎉 Konami Code activated! Matrix mode enabled!', 'color: #ff8c00; font-size: 18px; font-weight: bold;');
        konamiCode = [];
    }
});
