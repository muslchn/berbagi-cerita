import { register } from '../../data/api';

export default class RegisterPage {
  async render() {
    return `
      <section class="container auth-container">
        <div class="auth-box">
          <h1 class="page-title">Daftar</h1>
          <p class="page-subtitle">Buat akun untuk mulai berbagi cerita</p>
          
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Nama:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                aria-required="true"
                autocomplete="name"
                placeholder="Masukkan nama Anda"
              />
              <span class="error-message" id="name-error"></span>
            </div>
            
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
                autocomplete="new-password"
                minlength="8"
                placeholder="Minimal 8 karakter"
              />
              <span class="error-message" id="password-error"></span>
            </div>
            
            <div id="register-message" class="form-message" role="alert" aria-live="polite"></div>
            
            <button type="submit" class="btn-primary">Daftar</button>
          </form>
          
          <p class="auth-link">
            Sudah punya akun? <a href="#/login">Masuk di sini</a>
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

    const form = document.getElementById('register-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    if (!name) {
      document.getElementById('name-error').textContent = 'Nama harus diisi';
      isValid = false;
    }
    
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
    } else if (password.length < 8) {
      document.getElementById('password-error').textContent = 'Password minimal 8 karakter';
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
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      const result = await register({ name, email, password });
      
      if (result.error) {
        this.showMessage(`Pendaftaran gagal: ${result.message}`, 'error');
      } else {
        this.showMessage('Pendaftaran berhasil! Silakan login.', 'success');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      this.showMessage('Terjadi kesalahan saat mendaftar', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Daftar';
    }
  }

  showMessage(message, type) {
    const messageElement = document.getElementById('register-message');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'form-message';
    }, 5000);
  }
}
