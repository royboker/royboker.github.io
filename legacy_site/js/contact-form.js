// Contact Form Module - Handles form submission via Formspree

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset messages
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    // Disable button and show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        form.reset();
        if (successMessage) {
          successMessage.style.display = 'block';
          successMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error
      console.error('Form error:', error);
      if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Something went wrong. Please try again or email me directly.';
      }
    } finally {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorText = '';

  // Remove existing error
  field.classList.remove('error');
  const existingError = field.parentElement.querySelector('.field-error');
  if (existingError) existingError.remove();

  // Check if required
  if (field.required && !value) {
    isValid = false;
    errorText = 'This field is required';
  }

  // Email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorText = 'Please enter a valid email address';
    }
  }

  // Min length validation
  if (field.minLength && value.length < field.minLength) {
    isValid = false;
    errorText = `Please enter at least ${field.minLength} characters`;
  }

  // Show error if invalid
  if (!isValid) {
    field.classList.add('error');
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error form-error';
    errorEl.textContent = errorText;
    field.parentElement.appendChild(errorEl);
  }

  return isValid;
}
