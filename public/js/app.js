// Toast Notification System
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Clear existing toasts to prevent stacking
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toast-out 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle Registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                uname: document.getElementById('uname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            };

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showToast('Registration successful! Redirecting to login...', 'success');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    const err = await response.json();
                    showToast(`Registration failed: ${err.error || err.message}`, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('An error occurred during registration.', 'error');
            }
        });
    }

    // Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                uname: document.getElementById('uname').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const resData = await response.json();
                    localStorage.setItem('kodbank_user', resData.uname || document.getElementById('uname').value);
                    showToast('Login successful! Welcome to Kodbank.', 'success');
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                } else {
                    const err = await response.json();
                    showToast(`Login failed: ${err.error || err.message}`, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('An error occurred during login.', 'error');
            }
        });
    }

    // Handle Check Balance
    const checkBalanceBtn = document.getElementById('checkBalanceBtn');
    if (checkBalanceBtn) {
        checkBalanceBtn.addEventListener('click', async () => {
            const balanceEl = document.getElementById('balanceValue');

            // If already shown, we can allow refreshing it
            checkBalanceBtn.disabled = true;
            checkBalanceBtn.textContent = 'Decrypting...';

            try {
                const response = await fetch('/getBalance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    const formattedBalance = data.balance.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    balanceEl.textContent = formattedBalance;
                    document.getElementById('balanceDisplay').style.display = 'block';
                    showToast('Balance retrieved securely.', 'success');
                    triggerPopper();

                    checkBalanceBtn.textContent = 'Check Balance';
                } else {
                    const err = await response.json();
                    showToast('Error fetching balance: ' + err.message, 'error');
                    checkBalanceBtn.textContent = 'Check Balance';
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('An error occurred while checking balance.', 'error');
                checkBalanceBtn.textContent = 'Check Balance';
            } finally {
                checkBalanceBtn.disabled = false;
            }
        });
    }

    // Set Username on Dashboard
    const userNameDisplay = document.getElementById('userName');
    if (userNameDisplay) {
        const storedUser = localStorage.getItem('kodbank_user');
        userNameDisplay.textContent = storedUser || 'Valued Member';
    }

    // Handle Logout
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('kodbank_user');
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            showToast('Logged out successfully.', 'info');
            setTimeout(() => window.location.href = 'login.html', 800);
        });
    }
});

// Party Popper Animation Logic
function triggerPopper() {
    const canvas = document.getElementById('popperCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#8B0000', '#F57F17', '#2E7D32', '#1565C0', '#D32F2F'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.random() * 4 + 2,
            alpha: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
            if (p.alpha > 0) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Gravity
                p.alpha -= 0.01;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                alive = true;
            }
        });

        if (alive) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}
