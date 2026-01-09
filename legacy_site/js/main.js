// Main JavaScript - Initializes all modules

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initContactForm } from './contact-form.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initContactForm();

  console.log('Portfolio initialized successfully!');
});
