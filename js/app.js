const apiBaseUrl = 'https://localhost:7155/api'; 


const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'index.html';
}


const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}


async function fetchTransactions() {

    console.log("Token recuperado:", token);
    console.log("Cabeçalho enviado:", `Bearer ${token}`);
    try {
        const response = await fetch(`${apiBaseUrl}/Transactions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        const transactions = await response.json();
        updateScreen(transactions); 

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar dashboard.");
    }
}

function updateScreen(transactions) {
    const tableBody = document.getElementById('transactionsTableBody');
    const incomeDisplay = document.getElementById('incomeDisplay');
    const expenseDisplay = document.getElementById('expenseDisplay');
    const totalDisplay = document.getElementById('totalDisplay');

    tableBody.innerHTML = ''; 
    
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

        if (t.type === "Income" || t.type === 0) {
            income += t.amount;
        } else {
            expense += t.amount;
        }


        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.description}</td>
            <td>${t.categoryName || 'Sem Categoria'}</td>
            <td>${formatDate(t.date)}</td>
            <td style="color: ${t.type === "Income" || t.type === 0 ? 'green' : 'red'}">
                ${formatter.format(t.amount)}
            </td>
            <td>
                <button class="btn-delete" onclick="deleteTransaction(${t.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    incomeDisplay.textContent = formatter.format(income);
    expenseDisplay.textContent = formatter.format(expense);
    totalDisplay.textContent = formatter.format(income - expense);
}

async function deleteTransaction(id) {
    if(!confirm("Tem certeza que deseja excluir?")) return;

    try {
        await fetch(`${apiBaseUrl}/Transactions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchTransactions(); 
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});


fetchTransactions();