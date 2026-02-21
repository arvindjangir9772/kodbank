// Kodbank Client-Side Logic

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
                    alert('Registration successful! Redirecting to login...');
                    window.location.href = 'login.html';
                } else {
                    const err = await response.json();
                    alert('Registration failed: ' + err.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration.');
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
                    localStorage.setItem('kodbank_user', data.uname || document.getElementById('uname').value);
                    alert('Login successful! Welcome to Kodbank.');
                    window.location.href = 'dashboard.html';
                } else {
                    const err = await response.json();
                    alert('Login failed: ' + err.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login.');
            }
        });
    }

    // Handle Check Balance
    const checkBalanceBtn = document.getElementById('checkBalanceBtn');
    if (checkBalanceBtn) {
        checkBalanceBtn.addEventListener('click', async () => {
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
                    document.getElementById('balanceValue').textContent = formattedBalance;
                    document.getElementById('balanceDisplay').style.display = 'block';
                    triggerPopper();
                } else {
                    const err = await response.json();
                    alert('Error fetching balance: ' + err.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while checking balance.');
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
            // Clear cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = 'login.html';
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
