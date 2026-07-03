// LocalStorage se users ki list nikalne ka helper function
function getUsers() {
    return JSON.parse(localStorage.getItem("fintrack_users")) || [];
}

// 1. REGISTER LOGIC: Naya user save karne ke liye
function registerUser(username, password) {
    let users = getUsers();

    // Check karo ki username pehle se toh nahi bana hua
    let userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());

    if (userExists) {
        return { success: false, message: "Username already exists! Choose another one." };
    }

    // Agar unique hai, toh naya user array mein push karo
    users.push({ username: username, password: password });
    localStorage.setItem("fintrack_users", JSON.stringify(users));

    return { success: true, message: "Registration successful! Plz login now." };
}

// 2. LOGIN LOGIC: Username aur Password verify karne ke liye
function loginUser(username, password) {
    let users = getUsers();

    // Match dhoodho array ke andar
    let foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
        // Dynamic User login session hold karne ke liye
        localStorage.setItem("currentUser", username);
        return { success: true };
    } else {
        return { success: false, message: "Invalid username or password!" };
    }
}