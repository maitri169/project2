document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expenseForm');
    const monthlyTransactions = document.getElementById('monthlyTransactions');
    const balanceBlocks = document.getElementById('balanceBlocks');

    let transactions = [];
    let balances = {};

    // Handle form submission to add expense
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const amount = parseFloat(document.getElementById('amount').value);
      const description = document.getElementById('description').value;
      const date = document.getElementById('date').value;
      const category = document.getElementById('category').value;
      const friends = document.getElementById('friends').value.split(',').map(f => f.trim());

      if (amount && description && date && category && friends.length > 0) {
        const newTransaction = { amount, description, date, category, friends };
        transactions.push(newTransaction);
        updateBalances(amount, friends);
        displayMonthlyTransactions();
        displayBalances();
        expenseForm.reset();
      }
    });

    // Update balances based on expense splitting
    function updateBalances(amount, friends) {
      const splitAmount = amount / friends.length;
      friends.forEach(friend => {
        if (!balances[friend]) {
          balances[friend] = {};
        }
        const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!balances[friend][month]) {
          balances[friend][month] = 0;
        }
        balances[friend][month] += splitAmount;
      });
    }

    // Display monthly transactions grouped by month
    function displayMonthlyTransactions() {
      monthlyTransactions.innerHTML = '';
      const groupedTransactions = groupByMonth(transactions);

      Object.keys(groupedTransactions).forEach(month => {
        const monthDiv = document.createElement('div');
        const monthTitle = document.createElement('h3');
        monthTitle.textContent = month;
        monthDiv.appendChild(monthTitle);

        const ul = document.createElement('ul');
        groupedTransactions[month].forEach(transaction => {
          const li = document.createElement('li');
          li.textContent = `${transaction.date}: ${transaction.description} - ₹${transaction.amount} [${transaction.friends.join(', ')}]`;
          ul.appendChild(li);
        });

        monthDiv.appendChild(ul);
        monthlyTransactions.appendChild(monthDiv);
      });
    }

    // Group transactions by month
    function groupByMonth(transactions) {
      return transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[month]) acc[month] = [];
        acc[month].push(transaction);
        return acc;
      }, {});
    }

    // Display separate balance blocks for each friend
    function displayBalances() {
      balanceBlocks.innerHTML = '';
      Object.keys(balances).forEach(friend => {
        const friendBlock = document.createElement('div');
        friendBlock.className = 'balance-block';

        const friendTitle = document.createElement('h3');
        friendTitle.textContent = `Balance for ${friend}`;
        friendBlock.appendChild(friendTitle);

        const ul = document.createElement('ul');
        Object.keys(balances[friend]).forEach(month => {
          const li = document.createElement('li');
          li.textContent = `${month}: ₹${balances[friend][month].toFixed(2)}`;
          ul.appendChild(li);
        });

        friendBlock.appendChild(ul);
        balanceBlocks.appendChild(friendBlock);
      });
    }
});

// Page transitions
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}
