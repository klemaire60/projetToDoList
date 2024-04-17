document.getElementById('panneaubienvenue').classList.remove('hidden');
document.getElementById('panneaurevue').classList.remove('hidden');

document.getElementById('registerBtn').addEventListener('click', function() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('panneaubienvenue').classList.add('hidden');
    document.getElementById('panneaurevue').classList.remove('hidden');
});

document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('panneaurevue').classList.add('hidden');
    document.getElementById('panneaubienvenue').classList.remove('hidden');
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('http://192.168.64.243:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        alert(data.message);

        // Vérifier si un token a été reçu et rediriger vers la page index
        if (data.token) {
            window.location.href = 'index.html'; // Redirection vers la page index
        }

    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('http://192.168.64.243:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log(data.message);
        console.log(data.token);
        localStorage.setItem('token', data.token); // Utilisez data.token pour stocker le token

        // Vérifier si un token a été reçu et rediriger vers la page index
        if (data.token) {
            window.location.href = 'index.html'; // Redirection vers la page index
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
});
