/* ==========================================
   SIDEBURN - Library Management System Logic
   Strictly Vanilla JavaScript
========================================== */

// 1. GLOBAL STATE & CONTEXT
const CURRENT_DATE_STRING = "2026-09-09";
const CURRENT_DATE = new Date(CURRENT_DATE_STRING);
const FINE_PER_DAY = 10; // ₹10 per late day

// Used to track which book is being issued in the modal
let selectedBookIdForIssue = null;

// 2. SAMPLE DATA
let books = [
    { id: 101, title: "Clean Code", author: "Robert C. Martin", category: "💻 Computing", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 102, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "👨‍💻 Coding", status: "Issued", issuedTo: "Aarav Sharma", issueDate: "2026-09-01", dueDate: "2026-09-10" },
    { id: 103, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "💻 Computing", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 104, title: "Java: The Complete Reference", author: "Herbert Schildt", category: "👨‍💻 Coding", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 105, title: "The Silent Patient", author: "Alex Michaelides", category: "🔪 Thriller", status: "Issued", issuedTo: "Ishita Kapoor", issueDate: "2026-08-25", dueDate: "2026-09-05" }, // Overdue
    { id: 106, title: "Gone Girl", author: "Gillian Flynn", category: "🔪 Thriller", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 107, title: "A Walk to Remember", author: "Nicholas Sparks", category: "❤️ Love", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 108, title: "The Fault in Our Stars", author: "John Green", category: "💔 Sad", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 109, title: "A Little Life", author: "Hanya Yanagihara", category: "💔 Sad", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 110, title: "Dune", author: "Frank Herbert", category: "⚔️ Action", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 111, title: "The Hunger Games", author: "Suzanne Collins", category: "⚔️ Action", status: "Issued", issuedTo: "Aditya Verma", issueDate: "2026-09-01", dueDate: "2026-09-15" },
    { id: 112, title: "Verity", author: "Colleen Hoover", category: "🔪 Thriller", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 113, title: "Pride and Prejudice", author: "Jane Austen", category: "❤️ Love", status: "Issued", issuedTo: "Ananya Singh", issueDate: "2026-08-25", dueDate: "2026-09-08" }, // Overdue
    { id: 114, title: "Cracking the Coding Interview", author: "Gayle Laakmann", category: "👨‍💻 Coding", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 115, title: "Design Patterns", author: "Gang of Four", category: "💻 Computing", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 116, title: "Me Before You", author: "Jojo Moyes", category: "💔 Sad", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 117, title: "Die Hard", author: "Roderick Thorp", category: "⚔️ Action", status: "Available", issuedTo: null, issueDate: null, dueDate: null },
    { id: 118, title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "👨‍💻 Coding", status: "Available", issuedTo: null, issueDate: null, dueDate: null }
];

let returnHistory = [
    { title: "Atomic Habits", borrower: "Rohan Gupta", issueDate: "2026-08-10", returnDate: "2026-08-20", daysLate: 0, fine: 0 },
    { title: "The Alchemist", borrower: "Priya Sharma", issueDate: "2026-08-01", returnDate: "2026-08-20", daysLate: 5, fine: 50 }
];

// 3. INITIALIZATION
window.onload = function() {
    updateDashboard();
    renderBooks(books);
    renderIssuedBooks();
    renderHistory();
};

// 4. NAVIGATION LOGIC
function navigate(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.add('hidden'));
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    document.getElementById('section-' + sectionName).classList.remove('hidden');
    
    navItems.forEach(item => {
        if(item.getAttribute('onclick').includes(sectionName)) {
            item.classList.add('active');
        }
    });

    document.querySelector('.nav-links').classList.remove('show');
}

function toggleMobileMenu() {
    document.querySelector('.nav-links').classList.toggle('show');
}

// 5. DASHBOARD STATS LOGIC
function updateDashboard() {
    let total = books.length;
    let available = 0;
    let issued = 0;
    let overdue = 0;

    books.forEach(book => {
        if (book.status === "Available") {
            available++;
        } else if (book.status === "Issued") {
            issued++;
            let due = new Date(book.dueDate);
            if (CURRENT_DATE > due) {
                overdue++;
            }
        }
    });

    document.getElementById('stat-total').innerHTML = total;
    document.getElementById('stat-available').innerHTML = available;
    document.getElementById('stat-issued').innerHTML = issued;
    document.getElementById('stat-overdue').innerHTML = overdue;
}

// 6. LIBRARY & BOOK RENDERING LOGIC
function renderBooks(bookList) {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = ""; 

    if(bookList.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--text-secondary);'>No books found.</p>";
        return;
    }

    bookList.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        let statusClass = book.status === "Available" ? "status-available" : "status-issued";
        let buttonHTML = "";

        if (book.status === "Available") {
            buttonHTML = `<button class="btn btn-primary full-width" onclick="openIssueModal(${book.id})">Issue Book</button>`;
        } else {
            buttonHTML = `<button class="btn btn-secondary full-width" disabled>Issued to ${book.issuedTo}</button>`;
        }

        card.innerHTML = `
            <div class="book-cover">
                <span class="category-badge">${book.category}</span>
                <i class="fa-solid fa-book"></i>
            </div>
            <div class="book-info">
                <div class="status-badge ${statusClass}">${book.status}</div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                ${buttonHTML}
            </div>
        `;
        grid.appendChild(card);
    });
}

// 7. SEARCH & FILTER LOGIC
function searchBooks() {
    let query = document.getElementById('search-input').value.toLowerCase();
    
    let filtered = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) || 
        book.category.toLowerCase().includes(query)
    );
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn').classList.add('active'); 

    renderBooks(filtered);
}

function filterCategory(categoryName) {
    let btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        if(btn.innerText === categoryName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.getElementById('search-input').value = "";

    if (categoryName === 'All') {
        renderBooks(books);
    } else {
        let filtered = books.filter(book => book.category === categoryName);
        renderBooks(filtered);
    }
}

// 8. ISSUE BOOK LOGIC (MODAL)
function openIssueModal(id) {
    selectedBookIdForIssue = id;
    
    let book = books.find(b => b.id === id);
    if(!book) return;

    // Fixed: Now only shows the clean book title without the ID
    document.getElementById('modal-book-title').innerHTML = book.title;
    
    document.getElementById('issue-date').value = CURRENT_DATE_STRING;
    
    let due = new Date(CURRENT_DATE);
    due.setDate(due.getDate() + 14);
    document.getElementById('due-date').value = due.toISOString().split('T')[0];

    // Clear the student input field
    document.getElementById('borrower-name').value = "";

    document.getElementById('issue-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('issue-modal').classList.remove('active');
    selectedBookIdForIssue = null;
}

function confirmIssue() {
    // Read the text from the input field and remove extra spaces
    let borrower = document.getElementById('borrower-name').value.trim();
    
    if(borrower === "") {
        showToast("Please enter a borrower name ❌", "error");
        return;
    }

    let issueDate = document.getElementById('issue-date').value;
    let dueDate = document.getElementById('due-date').value;

    for(let i=0; i<books.length; i++) {
        if(books[i].id === selectedBookIdForIssue) {
            books[i].status = "Issued";
            books[i].issuedTo = borrower;
            books[i].issueDate = issueDate;
            books[i].dueDate = dueDate;
            break;
        }
    }

    closeModal();
    showToast("Book issued successfully 📚", "success");
    
    updateDashboard();
    renderBooks(books);
    renderIssuedBooks();
    
    document.getElementById('search-input').value = "";
    filterCategory('All');
}

// 9. ISSUED BOOKS & FINE CALCULATION LOGIC
function renderIssuedBooks() {
    const tbody = document.getElementById('issued-table-body');
    tbody.innerHTML = "";

    let issuedBooks = books.filter(b => b.status === "Issued");

    if(issuedBooks.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No books are currently issued.</td></tr>";
        return;
    }

    issuedBooks.forEach(book => {
        let dueDateObj = new Date(book.dueDate);
        let timeDiff = CURRENT_DATE.getTime() - dueDateObj.getTime();
        let daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let fine = 0;
        let fineText = "₹0";
        let fineClass = "fine-none";

        if (daysLate > 0) {
            fine = daysLate * FINE_PER_DAY;
            fineText = `Late by ${daysLate} days — Fine: ₹${fine}`;
            fineClass = "fine-some";
        }

        let formattedIssue = book.issueDate.split('-').reverse().join('/');
        let formattedDue = book.dueDate.split('-').reverse().join('/');

        let tr = document.createElement('tr');
        
        // Fixed: Removed the small ID text below the book title
        tr.innerHTML = `
            <td><strong>${book.title}</strong></td>
            <td>${book.issuedTo}</td>
            <td>${formattedIssue}</td>
            <td>${formattedDue}</td>
            <td><span class="fine-badge ${fineClass}">${fineText}</span></td>
            <td><button class="btn btn-danger" onclick="returnBook(${book.id})">Return Book</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// 10. RETURN BOOK LOGIC
function returnBook(id) {
    let bookIndex = books.findIndex(b => b.id === id);
    if(bookIndex === -1) return;

    let book = books[bookIndex];

    let dueDateObj = new Date(book.dueDate);
    let timeDiff = CURRENT_DATE.getTime() - dueDateObj.getTime();
    let daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let actualDaysLate = daysLate > 0 ? daysLate : 0;
    let actualFine = actualDaysLate * FINE_PER_DAY;

    let historyRecord = {
        title: book.title,
        borrower: book.issuedTo,
        issueDate: book.issueDate,
        returnDate: CURRENT_DATE_STRING,
        daysLate: actualDaysLate,
        fine: actualFine
    };
    
    returnHistory.unshift(historyRecord); 

    books[bookIndex].status = "Available";
    books[bookIndex].issuedTo = null;
    books[bookIndex].issueDate = null;
    books[bookIndex].dueDate = null;

    if (actualFine > 0) {
        showToast(`Book returned. Late fine: ₹${actualFine} ⚠️`, "warning");
    } else {
        showToast("Book returned successfully ✅", "success");
    }

    updateDashboard();
    renderBooks(books);
    renderIssuedBooks();
    renderHistory();
    
    filterCategory('All');
}

// 11. RETURN HISTORY LOGIC
function renderHistory() {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = "";

    if(returnHistory.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No return history available.</td></tr>";
        return;
    }

    returnHistory.forEach(record => {
        let fIssue = record.issueDate.split('-').reverse().join('/');
        let fReturn = record.returnDate.split('-').reverse().join('/');

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${record.title}</strong></td>
            <td>${record.borrower}</td>
            <td>${fIssue}</td>
            <td>${fReturn}</td>
            <td>${record.daysLate}</td>
            <td style="color: ${record.fine > 0 ? 'var(--danger)' : 'var(--success)'}; font-weight: bold;">₹${record.fine}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 12. TOAST NOTIFICATION SYSTEM
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = "fa-check-circle";
    if (type === "error") icon = "fa-times-circle";
    if (type === "warning") icon = "fa-exclamation-circle";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => {
            if(container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300); 
    }, 3000);
}
