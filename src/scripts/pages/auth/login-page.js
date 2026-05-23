import { login } from '../../data/api';

export default class LoginPage {
  async render() {
    return `
      <section class="container auth-container">
        <div class="auth-box">
          <h1 class="page-title">Masuk</h1>
          <p class="page-subtitle">Silakan masuk untuk berbagi cerita</p>
          
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                aria-required="true"
                autocomplete="email"
                placeholder="Masukkan email Anda"
              />
              <span class="error-message" id="email-error"></span>
            </div>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required
                aria-required="true"
                autocomplete="current-password"
                placeholder="Masukkan password Anda"
              />
              <span class="error-message" id="password-error"></span>
            </div>
            
            <div id="login-message" class="form-message" role="alert" aria-live="polite"></div>
            
            <button type="submit" class="btn-primary">Masuk</button>
          </form>
          
          <p class="auth-link">
            Belum punya akun? <a href="#/register">Daftar di sini</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      window.location.hash = '#/';
      return;
    }

    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    if (!email) {
      document.getElementById('email-error').textContent = 'Email harus diisi';
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      document.getElementById('email-error').textContent = 'Format email tidak valid';
      isValid = false;
    }
    
    if (!password) {
      document.getElementById('password-error').textContent = 'Password harus diisi';
      isValid = false;
    }
    
    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Memproses...';
    
    try {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      const result = await login({ email, password });
      
      if (result.error) {
        this.showMessage(`Login gagal: ${result.message}`, 'error');
      } else {
        // Save token to localStorage
        localStorage.setItem('token', result.loginResult.token);
        
        this.showMessage('Login berhasil! Mengalihkan...', 'success');
        
        // Redirect to home after 1.5 seconds
        setTimeout(() => {
          window.location.hash = '#/';
        }, 1500);
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.showMessage('Terjadi kesalahan saat login', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Masuk';
    }
  }

  showMessage(message, type) {
    const messageElement = document.getElementById('login-message');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'form-message';
    }, 5000);
  }
}
