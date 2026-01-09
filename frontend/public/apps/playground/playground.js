// Code Playground

class CodePlayground {
  constructor() {
    this.htmlEditor = document.getElementById('html-editor');
    this.cssEditor = document.getElementById('css-editor');
    this.jsEditor = document.getElementById('js-editor');
    this.previewFrame = document.getElementById('preview-frame');
    this.consoleOutput = document.getElementById('console-output');
    this.autoRunCheckbox = document.getElementById('auto-run');

    this.templates = {
      blank: {
        html: '',
        css: '',
        js: ''
      },
      hello: {
        html: `<div class="container">
  <h1>Hello, World!</h1>
  <p>Welcome to the Code Playground</p>
  <button id="btn">Click me!</button>
</div>`,
        css: `.container {
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  padding: 40px;
}

h1 {
  color: #3b82f6;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #2563eb;
}`,
        js: `const btn = document.getElementById('btn');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  console.log('Button clicked ' + count + ' times!');
  btn.textContent = 'Clicked ' + count + ' times';
});

console.log('Hello from JavaScript!');`
      },
      button: {
        html: `<div class="buttons">
  <button class="btn primary">Primary</button>
  <button class="btn secondary">Secondary</button>
  <button class="btn success">Success</button>
  <button class="btn danger">Danger</button>
</div>`,
        css: `.buttons {
  display: flex;
  gap: 12px;
  padding: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn:active {
  transform: translateY(0);
}

.primary { background: #3b82f6; color: white; }
.secondary { background: #6b7280; color: white; }
.success { background: #10b981; color: white; }
.danger { background: #ef4444; color: white; }`,
        js: `document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const text = e.target.textContent;
    console.log(text + ' button clicked!');

    // Add ripple effect
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 100);
  });
});`
      },
      animation: {
        html: `<div class="scene">
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
</div>`,
        css: `.scene {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 20px;
}

.box {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  animation: bounce 1s ease-in-out infinite;
}

.box:nth-child(2) { animation-delay: 0.1s; }
.box:nth-child(3) { animation-delay: 0.2s; }
.box:nth-child(4) { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}`,
        js: `console.log('Animation is running!');

// Click a box to change its color
document.querySelectorAll('.box').forEach(box => {
  box.addEventListener('click', () => {
    const hue = Math.random() * 360;
    box.style.background = \`linear-gradient(135deg, hsl(\${hue}, 70%, 60%), hsl(\${hue + 40}, 70%, 40%))\`;
    console.log('Box color changed!');
  });
});`
      },
      form: {
        html: `<form class="contact-form" id="form">
  <h2>Contact Form</h2>

  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Your name" required>
  </div>

  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="your@email.com" required>
  </div>

  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" placeholder="Your message..." required></textarea>
  </div>

  <button type="submit">Send Message</button>
</form>`,
        css: `.contact-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 30px;
  background: #f9fafb;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  margin-bottom: 20px;
  color: #1f2937;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

input, textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #2563eb;
}`,
        js: `const form = document.getElementById('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  console.log('Form submitted!');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);

  alert('Message sent! (This is a demo)');
  form.reset();
});`
      }
    };

    this.debounceTimer = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadTemplate('hello');
    this.updatePreview();
    this.initNavigation();
  }

  bindEvents() {
    // Editor input with debounce
    [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
      editor.addEventListener('input', () => {
        if (this.autoRunCheckbox.checked) {
          this.debounceUpdate();
        }
      });

      // Tab key support
      editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
          editor.selectionStart = editor.selectionEnd = start + 2;
        }
      });
    });

    // Run button
    document.getElementById('run-btn').addEventListener('click', () => {
      this.updatePreview();
    });

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
      this.htmlEditor.value = '';
      this.cssEditor.value = '';
      this.jsEditor.value = '';
      this.clearConsole();
      this.updatePreview();
    });

    // Template selector
    document.getElementById('template-select').addEventListener('change', (e) => {
      this.loadTemplate(e.target.value);
    });

    // Clear console button
    document.getElementById('clear-console').addEventListener('click', () => {
      this.clearConsole();
    });
  }

  debounceUpdate() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updatePreview();
    }, 500);
  }

  loadTemplate(name) {
    const template = this.templates[name];
    if (template) {
      this.htmlEditor.value = template.html;
      this.cssEditor.value = template.css;
      this.jsEditor.value = template.js;
      this.clearConsole();
      this.updatePreview();
    }
  }

  updatePreview() {
    const html = this.htmlEditor.value;
    const css = this.cssEditor.value;
    const js = this.jsEditor.value;

    // Create console interceptor script
    const consoleScript = `
      <script>
        (function() {
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };

          function sendToParent(type, args) {
            window.parent.postMessage({
              type: 'console',
              method: type,
              args: Array.from(args).map(arg => {
                if (typeof arg === 'object') {
                  try { return JSON.stringify(arg); }
                  catch { return String(arg); }
                }
                return String(arg);
              })
            }, '*');
          }

          console.log = function() {
            sendToParent('log', arguments);
            originalConsole.log.apply(console, arguments);
          };
          console.error = function() {
            sendToParent('error', arguments);
            originalConsole.error.apply(console, arguments);
          };
          console.warn = function() {
            sendToParent('warn', arguments);
            originalConsole.warn.apply(console, arguments);
          };
          console.info = function() {
            sendToParent('info', arguments);
            originalConsole.info.apply(console, arguments);
          };

          window.onerror = function(msg, url, line) {
            sendToParent('error', ['Error: ' + msg + ' (line ' + line + ')']);
            return false;
          };
        })();
      <\/script>
    `;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
          ${consoleScript}
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `;

    // Clear console before running
    this.clearConsole();

    // Listen for console messages
    window.removeEventListener('message', this.handleMessage);
    this.handleMessage = (e) => {
      if (e.data && e.data.type === 'console') {
        this.logToConsole(e.data.method, e.data.args.join(' '));
      }
    };
    window.addEventListener('message', this.handleMessage);

    // Update iframe
    this.previewFrame.srcdoc = content;
  }

  logToConsole(type, message) {
    const log = document.createElement('div');
    log.className = `console-log ${type}`;
    log.textContent = `> ${message}`;
    this.consoleOutput.appendChild(log);
    this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
  }

  clearConsole() {
    this.consoleOutput.innerHTML = '';
  }

  initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CodePlayground();
});
