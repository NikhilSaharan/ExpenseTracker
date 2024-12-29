var form = document.getElementById('expenses-form');
var expensename = document.getElementById('expense-name');
var amount = document.getElementById('amount');
var category = document.getElementById('category');
var date = document.getElementById('ex-date');
var tableItems = document.getElementById('tableitems');
var totalValue = document.getElementById('totalValue');

// Event Listeners
form.addEventListener('submit', addExpense);

// Add Expense function
function addExpense(e) {
    e.preventDefault();

    const expense = {
        expenseName: expensename.value,
        amount: amount.value,
        category: category.value,
        date: date.value
    };

    fetch('http://localhost:5000/addExpense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add expense');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.message === 'Expense added successfully') {
            updateTable();
            totalValues();
            resetForm();
        } else {
            console.error('Error:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Update table with new expenses
function updateTable() {
    fetch('http://localhost:5000/getExpenses', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        tableItems.innerHTML = ''; // Clear the table before re-populating
        data.forEach(expense => {
            var tr = document.createElement('tr');
            tr.className = 'item';
            tr.setAttribute('data-id', expense.id); // Set the expense ID on the row for reference
            
            var td1 = document.createElement('td');
            td1.textContent = expense.expense_name;
            var td2 = document.createElement('td');
            td2.textContent = expense.amount;
            var td3 = document.createElement('td');
            td3.textContent = expense.category;
            var td4 = document.createElement('td');
            td4.textContent = expense.date;

            var td5 = document.createElement('td');
            td5.innerHTML = '<button class="btn btn-success">Update</button>';
            var td6 = document.createElement('td');
            td6.innerHTML = '<button class="btn btn-danger">Delete</button>';
            
            // Delete button event listener
            td6.querySelector('button').addEventListener('click', deleteExpense);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tableItems.appendChild(tr);
        });
    })
    .catch(error => console.log('Error fetching data:', error));
}

// Delete Expense function
function deleteExpense(e) {
    const row = e.target.closest('tr');
    const id = row.getAttribute('data-id'); // Get the ID of the expense

    fetch('http://localhost:5000/deleteExpense', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id }) // Send the ID to the backend for deletion
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Expense deleted successfully') {
            updateTable(); // Refresh the table
            totalValues(); // Refresh the total value
        } else {
            console.error('Error:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Calculate total value of all expenses
function totalValues() {
  fetch('http://localhost:5000/getExpenses', {
      method: 'GET',
  })
  .then(response => response.json())
  .then(data => {
      let total = 0;
      data.forEach(expense => {
          let amount = parseFloat(expense.amount);
          // Check if the amount is a valid number
          if (!isNaN(amount)) {
              total += amount;
          }
      });
      totalValue.textContent = `Total amount is: Rs.${total.toFixed(2)}`; // Display two decimals
  })
  .catch(error => console.log('Error fetching data:', error));
}

// Reset form
function resetForm() {
    form.reset();
}
