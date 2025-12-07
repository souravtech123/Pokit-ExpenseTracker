// ===================== GLOBAL VARIABLES ===================== //
let salary = 0;
let totalSpent = 0;

// Select fields
const salaryInput = document.querySelector("#salary");
const itemInput = document.querySelector("#item");
const amountInput = document.querySelector("#amount");
const listContainer = document.querySelector("#expense-list");
const leftAmountBox = document.querySelector("#left-amount");


// ===================== SALARY INPUT EVENTS ===================== //

// When salary changes
salaryInput.addEventListener("input", () => {
    salary = Number(salaryInput.value);
    updateLeftAmount();
});


// ===================== ADD EXPENSE FUNCTION ===================== //
function addExpense() {
    const item = itemInput.value.trim();
    const amount = Number(amountInput.value);

    // Validate
    if (item === "" || amount === 0) {
        alert("Please enter valid item and amount");
        return;
    }

    const moneyLeft = salary - totalSpent;
    if (amount > moneyLeft) {
        alert(`You only have ₹${moneyLeft} left! Cannot add this expense.`);
        return;
    }

    totalSpent += amount;

    // Add to list
    const li = document.createElement("li");
    li.innerHTML = `${item} - ₹${amount}`;
    listContainer.appendChild(li);

    // Add to chart
    let categoryIndex = categories.indexOf(item);

    if (categoryIndex === -1) {
        categories.push(item);
        amounts.push(amount);
    } else {
        amounts[categoryIndex] += amount;
    }

    updateChart();

    // Clear inputs
    itemInput.value = "";
    amountInput.value = "";

    updateLeftAmount();
}


// ===================== DOWNLOAD PDF ===================== //
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(20);
    doc.text("Expense List", 10, 20);

    doc.setFontSize(12);

    const listItems = document.querySelectorAll("#expense-list li");
    let y = 35;

    listItems.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.innerText}`, 10, y);
        y += 10;

        // If content exceeds page
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("expenses.pdf");
}


// ===================== LOCAL STORAGE HANDLING ===================== //

// Load salary from LocalStorage
window.onload = function () {
    const savedSalary = localStorage.getItem("salary");

    if (savedSalary) {
        salaryInput.value = savedSalary;
        salary = Number(savedSalary);
        updateLeftAmount();
    }
};

// Save salary on typing
salaryInput.addEventListener("input", function () {
    const value = this.value;
    localStorage.setItem("salary", value);
    salary = Number(value);
    updateLeftAmount();
});


// ===================== CONFIRM SALARY BUTTON ===================== //
document.getElementById("confirm-salary-btn").addEventListener("click", function () {
    const inputSalary = salaryInput.value;

    if (!inputSalary || inputSalary <= 0) {
        alert("Please enter a valid salary amount.");
        return;
    }

    const isConfirmed = confirm(`Are you sure ₹${inputSalary} is your monthly salary?`);

    if (isConfirmed) {
        salary = Number(inputSalary);
        localStorage.setItem("salary", inputSalary);

        updateLeftAmount();
        alert("Salary confirmed and saved successfully!");
    }
});


// ===================== CHART JS DATA SETUP ===================== //
let categories = [];
let amounts = [];

let ctx = document.getElementById("expenseChart").getContext("2d");

let expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: categories,
        datasets: [{
            label: "Expenses",
            data: amounts,
            backgroundColor: [
                "#3a86ff", "#ff006e", "#fb5607",
                "#ffbe0b", "#8338ec", "#06d6a0"
            ],
            borderWidth: 1
        }]
    },
    options: { responsive: true }
});


// ===================== UPDATE CHART ===================== //
function updateChart() {
    expenseChart.data.labels = categories;
    expenseChart.data.datasets[0].data = amounts;
    expenseChart.update();
}


// ===================== UPDATE MONEY LEFT ===================== //
function updateLeftAmount() {
    const left = salary - totalSpent;
    leftAmountBox.innerText = `Money Left: ₹${left}`;
}
