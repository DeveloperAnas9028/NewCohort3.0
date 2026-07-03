const usernameDisplay = document.querySelector(".logindet p");
const profileInputName = document.querySelector("#profileFullName");
const profileForm = document.querySelector("#profileForm");
const logoutBtn = document.querySelector(".logout");

// Auth Navigation Guard + Pre-fill Mechanics
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.replace("login.html");
} else {
    // Navbar mein naam dikhao
    if (usernameDisplay) usernameDisplay.innerText = currentUser;

    // Settings Form ke andar asli username pre-fill karo!
    if (profileInputName) profileInputName.value = currentUser;
}

//Settings Form Submit Listener (Save Changes Mechanism)
if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const oldUsername = localStorage.getItem("currentUser"); // Purana naam jise dhoodhna hai
        const newUsername = profileInputName.value.trim();

        if (newUsername === "") {
            alert("Username cannot be empty!");
            return;
        }

        // Database (Stored Users Array) se data nikalo
        let usersArr = JSON.parse(localStorage.getItem("fintrack_users")) || [];

        // Check karo ki naya naam kisi aur ne toh nahi le rakha (Sirf tab jab naam sach mein badla ho)
        if (oldUsername.toLowerCase() !== newUsername.toLowerCase()) {
            let nameExists = usersArr.some(u => u.username.toLowerCase() === newUsername.toLowerCase());
            if (nameExists) {
                alert("This username is already taken by someone else! ❌");
                return;
            }
        }

        // Array ke andar purane user ko dhoodh kar uska naam update karo
        let userIndex = usersArr.findIndex(u => u.username === oldUsername);
        if (userIndex !== -1) {
            usersArr[userIndex].username = newUsername; // Object ke andar username key badal di

            // Updated array ko wapas LocalStorage mein dal do
            localStorage.setItem("fintrack_users", JSON.stringify(usersArr));
        }

        // Current Session aur Navbar UI ko update karo
        localStorage.setItem("currentUser", newUsername);
        if (usernameDisplay) usernameDisplay.innerText = newUsername;

        alert("Profile details updated successfully everywhere! Stored array updated. 👍");
    });
}

// Logout Logic
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.replace("login.html");
    });
}



const TableBody = document.querySelector('.tableBody');
const addTrans = document.querySelector(".addtrans");
const addTransForm = document.querySelector('.modal-overlay');
const addTransac = document.querySelector(".addTransac");
const saveTransactionBtn = document.querySelector(".save-transaction-btn");
const closeForm = document.querySelector('#closeModalBtn')

const inp_type = document.querySelector("#transType");
const inp_desc = document.querySelector("#transDesc");
const inp_amount = document.querySelector("#amount");
const inp_date = document.querySelector("#date");
const inp_category = document.querySelector("#category");

const amount_col = document.querySelector(".amount-col");

const Transactions = document.querySelector("#transaction");
const Income_amount = document.querySelector("#income");
const Expense_amount = document.querySelector("#expense");
const Balance = document.querySelector("#bal");

const DeleteAllTransaction = document.querySelector(".reset");

const darkModeToggle = document.querySelector("#darkModeToggle");


const settingBtn = document.querySelector(".setting");
const SettingUI = document.querySelector(".settings-view");

const dashboardBtn = document.querySelector(".dashboard");

const NavBar = document.querySelector('nav');
const Section = document.querySelector('section')



// Transaction Array (Creating Every transaction as an Index in array) 
let TransacArr = JSON.parse(localStorage.getItem("fintrack_transactions")) || [];
let editIndex = null;

// For Chart instance tracking 
let cashFlowChartInstance = null;


function saveToStorage() {
    localStorage.setItem("fintrack_transactions", JSON.stringify(TransacArr));
}

function updateCashFlowChart(incomeTotal, expenseTotal) {
    const ctx = document.getElementById('cashFlowChart');
    if (!ctx) return;

    // Agar pehle se chart bana hua hai, toh use destroy karo taaki naya data fresh load ho
    if (cashFlowChartInstance) {
        cashFlowChartInstance.destroy();
    }

    // Chart.js ka direct config logic (image_600d21.png ke exact colors ke sath)
    cashFlowChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income vs Expenses'],
            datasets: [
                {
                    label: 'Income',
                    data: [incomeTotal],
                    backgroundColor: '#10b981', // Premium Green color from your dark mode image
                    borderRadius: 6,
                },
                {
                    label: 'Expenses',
                    data: [expenseTotal],
                    backgroundColor: '#ef4444', // Premium Red color from your dark mode image
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: document.body.classList.contains('dark-mode') ? '#f8fafc' : '#1e293b'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    // Agat income aur expense dono 0 hain, toh max boundary 1.0 set hogi, nahi toh automatic adjust hoga
                    max: (incomeTotal === 0 && expenseTotal === 0) ? 1.0 : undefined,
                    grid: {
                        color: document.body.classList.contains('dark-mode') ? '#334155' : '#e2e8f0'
                    },
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? '#94a3b8' : '#64748b',
                        // Shuruat mein 0.1, 0.2 waale steps dikhane ke liye, transaction aane par automatic scales chalenge
                        stepSize: (incomeTotal === 0 && expenseTotal === 0) ? 0.1 : undefined
                    }
                },
                x: {
                    ticks: {
                        color: document.body.classList.contains('dark-mode') ? '#94a3b8' : '#64748b'
                    }
                }
            }
        }
    });
}


// Transaction Function (Dynamic Transaction UI Function)
function CreateTransac() {
    TableBody.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    // If there is no transaction in Array apply this condition
    if (TransacArr.length === 0) {
        Transactions.innerText = "0";
        Income_amount.innerText = "₹0.00";
        Expense_amount.innerText = "₹0.00";
        Balance.innerText = "₹0.00";
    }
    else {
        TransacArr.forEach((transaction, index) => {

            let isIncome = (transaction.type === "income");

            //Converts the string value of Amount string into integer/number
            let currentAmount = Number(transaction.amount);

            if (isIncome) {
                totalIncome += currentAmount;
            } else {
                totalExpense += currentAmount;
            }


            // Dynamic Transaction(element) Creation Process: 
            let table_row = document.createElement("tr");

            let table_desc1 = document.createElement("td");
            table_desc1.classList.add("date-col");
            table_desc1.innerText = transaction.date;

            let table_desc2 = document.createElement("td");
            table_desc2.classList.add("desc-col");
            table_desc2.innerText = transaction.desc;

            let table_desc3 = document.createElement("td");
            let span = document.createElement('span');
            span.classList.add('badge', 'badge-salary');
            span.innerText = transaction.category;

            let table_desc4 = document.createElement('td');
            if (isIncome) {
                table_desc4.classList.add("income-amount");
                table_desc4.innerText = `+${transaction.amount}`;
            } else {
                table_desc4.classList.add("expense-amount");
                table_desc4.innerText = `-${transaction.amount}`;
            }

            let table_desc5 = document.createElement("td");
            table_desc5.classList.add("actions-col");

            let edit_button = document.createElement("button");
            edit_button.classList.add("action-btn", "edit-btn");
            edit_button.dataset.index = index;

            let editlogo = document.createElement('i');
            editlogo.classList.add('fa-solid', 'fa-pen');
            editlogo.dataset.index = index;

            let del_button = document.createElement("button");
            del_button.classList.add("action-btn", "delete-btn");
            del_button.dataset.index = index;

            let dellogo = document.createElement('i');
            dellogo.classList.add('fa-solid', 'fa-trash');
            dellogo.dataset.index = index;


            //Transactions count 
            Transactions.innerText = TransacArr.length;


            table_row.append(table_desc1, table_desc2, table_desc3, table_desc4, table_desc5);
            table_desc3.append(span);
            edit_button.append(editlogo);
            del_button.append(dellogo);
            table_desc5.append(edit_button, del_button);

            TableBody.append(table_row);
        });
    }

    // Balance Logic.
    let totalBalance = totalIncome - totalExpense;
    Income_amount.innerText = `₹${totalIncome.toFixed(2)}`;
    Expense_amount.innerText = `₹${totalExpense.toFixed(2)}`;
    Balance.innerText = `₹${totalBalance.toFixed(2)}`;

    updateCashFlowChart(totalIncome, totalExpense);
}


// Transaction update and delete logic 
TableBody.addEventListener("click", (e) => {

    //Update Logic 
    if (e.target.classList.contains('edit-btn') || e.target.classList.contains('fa-pen')) {

        //This index variable below gives the index of the element(Transaction) which is currently updating.
        let index = e.target.dataset.index;
        console.log(index);
        editIndex = index;


        //currentTrans takes the index values of the updating transaction and filled it in form when clicked on Edit
        let currentTrans = TransacArr[index];

        inp_type.value = currentTrans.type;
        inp_desc.value = currentTrans.desc;
        inp_amount.value = currentTrans.amount;
        inp_date.value = currentTrans.date;
        inp_category.value = currentTrans.category;

        addTransForm.style.display = "flex";
    }

    //Delete Logic 
    if (e.target.classList.contains('delete-btn') || e.target.classList.contains('fa-trash')) {

        if (confirm("Are you sure you want to delete this transaction?")) {
            let del_index = e.target.dataset.index;
            let del = TransacArr.splice(del_index, 1);
            console.log(del);
            saveToStorage();
            CreateTransac();
        }
        else {
            return;
        }// confirm("Are You Sure you want to selete this transacttion?");

    }
});


//For deleting all transactions means (clearing all array elements)
DeleteAllTransaction.addEventListener("click", (e) => {
    if (TransacArr.length === 0) {
        alert("No Transaction Available");
        return;
    }
    else if (confirm("Are you sure you want to delete all transaction?")) {

        let arrlength = TransacArr.length;
        TransacArr.splice(0, arrlength);

        console.log(TransacArr.length);
        saveToStorage();
        CreateTransac();
        console.log(TransacArr);
    }
    else {
        return;
    }
})



// For Rendering Dashboard UI
dashboardBtn.addEventListener("click", () => {
    SettingUI.style.display = "none";
    Section.style.display = "flex";
    Section.style.flexDirection = "column";

    dashboardBtn.classList.add("active");
    settingBtn.classList.remove("active");
});

// For Rendering Setting UI 
settingBtn.addEventListener("click", () => {
    SettingUI.style.display = "flex";
    NavBar.style.display = "flex";
    Section.style.display = "none";

    settingBtn.classList.add("active"); // Setting select karo
    dashboardBtn.classList.remove("active");
});



//Dark Mode Switch Logic
darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
});



//Form Submit logic 
addTransac.addEventListener("submit", (events) => {
    events.preventDefault();

    // Validation for form
    if (!inp_type.value ||
        !inp_desc.value.trim() ||
        !inp_amount.value.trim() ||
        !inp_date.value.trim() ||
        !inp_category.value) {
        alert("Plz fill all the fields");
        return;
    }

    let TransObj = {
        type: inp_type.value,
        desc: inp_desc.value.trim(),
        amount: inp_amount.value,
        date: inp_date.value,
        category: inp_category.value
    };

    if (editIndex === null) {
        TransacArr.push(TransObj);
    } else {
        TransacArr[editIndex] = TransObj;
        editIndex = null;
    }

    saveToStorage();
    CreateTransac();
    addTransForm.style.display = "none";
    addTransac.reset();
});


addTrans.addEventListener('click', () => {
    editIndex = null;
    addTransac.reset();
    addTransForm.style.display = "flex";
});



//Form closing Event
closeForm.addEventListener('click', () => {
    addTransForm.style.display = "none";
});



updateCashFlowChart(0, 0);
CreateTransac();