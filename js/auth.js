const apiBaseUrl = 'https://localhost:7155/api';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

if(loginForm){
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const loginData = {
            email: email,
            password: password
        };

        try {

            const response = await fetch(`${apiBaseUrl}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

        
            if (response.ok) {

        const data = await response.json(); 
        
        const tokenLimpo = data.token; 

        console.log("Token puro salvo:", tokenLimpo);
        
        localStorage.setItem('token', tokenLimpo);  
        
        window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = "Email ou senha inválidos!";
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro:', error);
            errorMessage.textContent = "Erro ao conectar com o servidor.";
            errorMessage.style.display = 'block';
        }
    });
}