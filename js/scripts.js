document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');

    usernameInput.addEventListener('input', function () {
        const username = usernameInput.value;
        const isValid = validateUsername(username);

        if (isValid) {
            usernameInput.style.borderColor = 'green';
        } else {
            usernameInput.style.borderColor = 'red';
        }
    });

    function validateUsername(username) {
        // Regex to check all conditions:
        // - At least 8 characters
        // - At least one lowercase letter
        // - At least one uppercase letter
        // - At least one number
        // - At least one special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        return regex.test(username);
    }

    const ctx = document.getElementById('incomeExpensesChart').getContext('2d');
    let incomeExpensesChart;

    function getData() {
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const incomeData = months.map(month => parseFloat(document.getElementById(`${month}-income`).value) || 0);
        const expensesData = months.map(month => parseFloat(document.getElementById(`${month}-expenses`).value) || 0);
        return { incomeData, expensesData };
    }

    function updateChart() {
        const { incomeData, expensesData } = getData();
        if (incomeExpensesChart) {
            incomeExpensesChart.data.datasets[0].data = incomeData;
            incomeExpensesChart.data.datasets[1].data = expensesData;
            incomeExpensesChart.update();
        } else {
            incomeExpensesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: expensesData,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    document.getElementById('chart-tab').addEventListener('shown.bs.tab', updateChart);

    document.getElementById('download').addEventListener('click', function () {
        const link = document.createElement('a');
        link.href = incomeExpensesChart.toBase64Image();
        link.download = 'income-expenses-chart.png';
        link.click();
    });
});