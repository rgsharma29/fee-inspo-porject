// --- 1. DATA MANAGEMENT (LocalStorage) ---
const DataStore = {
    init() {
        if (!localStorage.getItem('lms_books')) {
            this.seedData();
        }
        this.updateOverdueStatuses();
    },

    seedData() {
        // Balanced 20-Book Database categorized exactly as requested
        const books = [
            // Programming (5)
            { id: 'B1', title: 'HTML and CSS: Design and Build Websites', author: 'Jon Duckett', category: 'Programming', isbn: '9781118871645', totalCopies: 5, availableCopies: 4 },
            { id: 'B2', title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category: 'Programming', isbn: '9781593279509', totalCopies: 4, availableCopies: 4 },
            { id: 'B3', title: 'Head First Java', author: 'Kathy Sierra & Bert Bates', category: 'Programming', isbn: '9780596009205', totalCopies: 6, availableCopies: 5 },
            { id: 'B4', title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Programming', isbn: '9780073523323', totalCopies: 3, availableCopies: 3 },
            { id: 'B5', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose', category: 'Programming', isbn: '9780133594140', totalCopies: 4, availableCopies: 4 },
            
            // Romance (4)
            { id: 'B6', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', isbn: '9780141439518', totalCopies: 3, availableCopies: 3 },
            { id: 'B7', title: 'The Notebook', author: 'Nicholas Sparks', category: 'Romance', isbn: '9780446605236', totalCopies: 5, availableCopies: 4 },
            { id: 'B8', title: 'The Fault in Our Stars', author: 'John Green', category: 'Romance', isbn: '9780142424179', totalCopies: 4, availableCopies: 4 },
            { id: 'B9', title: 'Me Before You', author: 'Jojo Moyes', category: 'Romance', isbn: '9780143124542', totalCopies: 3, availableCopies: 3 },
            
            // Emotional / Drama (3)
            { id: 'B10', title: 'The Kite Runner', author: 'Khaled Hosseini', category: 'Drama', isbn: '9781594631931', totalCopies: 4, availableCopies: 3 },
            { id: 'B11', title: 'The Book Thief', author: 'Markus Zusak', category: 'Drama', isbn: '9780375842207', totalCopies: 5, availableCopies: 5 },
            { id: 'B12', title: 'Wonder', author: 'R.J. Palacio', category: 'Drama', isbn: '9780375869020', totalCopies: 3, availableCopies: 2 },
            
            // Spy / Thriller (3)
            { id: 'B13', title: 'Casino Royale', author: 'Ian Fleming', category: 'Thriller', isbn: '9781612185439', totalCopies: 3, availableCopies: 3 },
            { id: 'B14', title: 'The Bourne Identity', author: 'Robert Ludlum', category: 'Thriller', isbn: '9780553260111', totalCopies: 4, availableCopies: 3 },
            { id: 'B15', title: 'The Hunt for Red October', author: 'Tom Clancy', category: 'Thriller', isbn: '9780425240335', totalCopies: 3, availableCopies: 1 },
            
            // Action / Adventure (3)
            { id: 'B16', title: 'Jurassic Park', author: 'Michael Crichton', category: 'Action', isbn: '9780345538987', totalCopies: 5, availableCopies: 5 },
            { id: 'B17', title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', category: 'Action', isbn: '9780140449266', totalCopies: 2, availableCopies: 2 },
            { id: 'B18', title: 'Treasure Island', author: 'Robert Louis Stevenson', category: 'Action', isbn: '9780451530974', totalCopies: 4, availableCopies: 4 },
            
            // Fantasy (2)
            { id: 'B19', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780345339683', totalCopies: 6, availableCopies: 6 },
            { id: 'B20', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780544003415', totalCopies: 4, availableCopies: 3 }
        ];

        const members = [
            { id: 'M1', name: 'Alex Johnson', studentId: 'CS2023001', dept: 'Computer Science', email: 'alex@college.edu' },
            { id: 'M2', name: 'Sarah Williams', studentId: 'EE2023045', dept: 'Electrical Eng', email: 'sarah@college.edu' },
            { id: 'M3', name: 'Michael Chen', studentId: 'BA2023102', dept: 'Business Admin', email: 'michael@college.edu' },
        ];

        // Seed some past and active transactions linked to the new books
        const today = new Date();
        const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);
        const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
        const pastDue = new Date(today); pastDue.setDate(today.getDate() - 2);

        const transactions = [
            { id: 'T1', bookId: 'B1', memberId: 'M1', issueDate: lastWeek.toISOString().split('T')[0], dueDate: nextWeek.toISOString().split('T')[0], returnDate: null, status: 'issued' },
            { id: 'T2', bookId: 'B15', memberId: 'M2', issueDate: lastWeek.toISOString().split('T')[0], dueDate: pastDue.toISOString().split('T')[0], returnDate: null, status: 'overdue' },
            { id: 'T3', bookId: 'B3', memberId: 'M3', issueDate: lastWeek.toISOString().split('T')[0], dueDate: nextWeek.toISOString().split('T')[0], returnDate: today.toISOString().split('T')[0], status: 'returned' },
            { id: 'T4', bookId: 'B7', memberId: 'M1', issueDate: today.toISOString().split('T')[0], dueDate: nextWeek.toISOString().split('T')[0], returnDate: null, status: 'issued' }
        ];

        localStorage.setItem('lms_books', JSON.stringify(books));
        localStorage.setItem('lms_members', JSON.stringify(members));
        localStorage.setItem('lms_transactions', JSON.stringify(transactions));
    },

    getData(key) { return JSON.parse(localStorage.getItem(key)) || []; },
    saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

    updateOverdueStatuses() {
        const txs = this.getData('lms_transactions');
        let updated = false;
        const today = new Date().toISOString().split('T')[0];

        txs.forEach(tx => {
            if (tx.status === 'issued' && tx.dueDate < today) {
                tx.status = 'overdue';
                updated = true;
            }
        });

        if (updated) this.saveData('lms_transactions', txs);
    }
};

// --- 2. UI AND ROUTING ---
const ui = {
    charts: {},
    
    init() {
        lucide.createIcons();
        this.bindEvents();
        this.initTheme();
        DataStore.init();
        this.navigate('dashboard');
    },

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(e.currentTarget.dataset.target);
            });
        });

        // Mobile Sidebar
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('open');
        });
        document.getElementById('closeSidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });

        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('lms_theme', isDark ? 'dark' : 'light');
            
            // Re-render charts to update colors
            if (document.getElementById('dashboard').classList.contains('active')) this.renderDashboard();
            if (document.getElementById('analytics').classList.contains('active')) this.renderAnalytics();
        });

        // Forms
        document.getElementById('bookForm').addEventListener('submit', (e) => this.handleBookSubmit(e));
        document.getElementById('memberForm').addEventListener('submit', (e) => this.handleMemberSubmit(e));
        document.getElementById('issueForm').addEventListener('submit', (e) => this.handleIssueSubmit(e));

        // Search Filters
        document.getElementById('bookSearch').addEventListener('input', () => this.renderBooks());
        document.getElementById('bookCategoryFilter').addEventListener('change', () => this.renderBooks());
    },

    initTheme() {
        if (localStorage.getItem('lms_theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    },

    navigate(pageId) {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector(`.nav-item[data-target="${pageId}"]`).classList.add('active');

        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        document.getElementById('sidebar').classList.remove('open');

        switch(pageId) {
            case 'dashboard': this.renderDashboard(); break;
            case 'books': this.renderBooks(); break;
            case 'members': this.renderMembers(); break;
            case 'issue-return': this.renderIssueReturn(); break;
            case 'history': this.renderHistory(); break;
            case 'analytics': this.renderAnalytics(); break;
        }
    },

    // --- MODAL UTILS ---
    openModal(id) {
        document.getElementById(id).classList.add('active');
        if(id === 'bookForm') document.getElementById('bookForm').reset();
    },
    closeModal(id) {
        document.getElementById(id).classList.remove('active');
    },

    // --- DASHBOARD RENDERER ---
    renderDashboard() {
        const books = DataStore.getData('lms_books');
        const txs = DataStore.getData('lms_transactions');
        
        let totalBooks = 0, available = 0;
        books.forEach(b => { totalBooks += b.totalCopies; available += b.availableCopies; });
        
        const issued = txs.filter(t => t.status === 'issued').length;
        const overdue = txs.filter(t => t.status === 'overdue').length;

        document.getElementById('statTotalBooks').innerText = totalBooks;
        document.getElementById('statAvailable').innerText = available;
        document.getElementById('statIssued').innerText = issued;
        document.getElementById('statOverdue').innerText = overdue;

        // Recent Issues Table
        const recentTxs = txs.filter(t => t.status === 'issued' || t.status === 'overdue').slice(-5).reverse();
        const tbody = document.getElementById('recentIssuesTable').querySelector('tbody');
        tbody.innerHTML = '';
        
        recentTxs.forEach(tx => {
            const book = books.find(b => b.id === tx.bookId);
            const member = DataStore.getData('lms_members').find(m => m.id === tx.memberId);
            tbody.innerHTML += `
                <tr>
                    <td><div class="book-info"><span class="book-title">${book?.title || 'Unknown'}</span></div></td>
                    <td>${member?.name || 'Unknown'}</td>
                    <td>${tx.issueDate}</td>
                    <td><span class="status ${tx.status}">${tx.status.toUpperCase()}</span></td>
                </tr>
            `;
        });

        this.renderDashboardChart(txs);
        lucide.createIcons();
    },

    renderDashboardChart(txs) {
        const ctx = document.getElementById('dashboardChart').getContext('2d');
        if (this.charts.dashboard) this.charts.dashboard.destroy();

        const textColor = document.body.classList.contains('dark-mode') ? '#f8fafc' : '#0f172a';

        this.charts.dashboard = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Returned', 'Currently Issued', 'Overdue'],
                datasets: [{
                    data: [
                        txs.filter(t=>t.status==='returned').length,
                        txs.filter(t=>t.status==='issued').length,
                        txs.filter(t=>t.status==='overdue').length
                    ],
                    backgroundColor: ['#10b981', '#4f46e5', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: textColor } } }
            }
        });
    },

    // --- BOOKS RENDERER ---
    renderBooks() {
        const books = DataStore.getData('lms_books');
        const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
        const categoryFilter = document.getElementById('bookCategoryFilter').value;

        const filtered = books.filter(b => 
            (b.title.toLowerCase().includes(searchTerm) || b.author.toLowerCase().includes(searchTerm)) &&
            (categoryFilter === 'all' || b.category === categoryFilter)
        );

        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = '';
        
        filtered.forEach(book => {
            const statusClass = book.availableCopies > 0 ? 'available' : 'overdue';
            const statusText = book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock';
            
            tbody.innerHTML += `
                <tr>
                    <td>
                        <div class="book-info">
                            <div>
                                <span class="book-title">${book.title}</span>
                                <span class="book-sub">${book.isbn}</span>
                            </div>
                        </div>
                    </td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn-action" onclick="ui.deleteBook('${book.id}')"><i data-lucide="trash-2"></i></button>
                    </td>
                </tr>
            `;
        });
        lucide.createIcons();
    },

    handleBookSubmit(e) {
        e.preventDefault();
        const books = DataStore.getData('lms_books');
        const newBook = {
            id: 'B' + (books.length + 1 + Math.floor(Math.random()*1000)),
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            isbn: document.getElementById('bookIsbn').value,
            category: document.getElementById('bookCategory').value,
            totalCopies: parseInt(document.getElementById('bookCopies').value),
            availableCopies: parseInt(document.getElementById('bookCopies').value)
        };
        books.push(newBook);
        DataStore.saveData('lms_books', books);
        this.closeModal('bookModal');
        this.renderBooks();
    },

    deleteBook(id) {
        if(confirm("Delete this book?")) {
            let books = DataStore.getData('lms_books');
            books = books.filter(b => b.id !== id);
            DataStore.saveData('lms_books', books);
            this.renderBooks();
        }
    },

    // --- MEMBERS RENDERER ---
    renderMembers() {
        const members = DataStore.getData('lms_members');
        const txs = DataStore.getData('lms_transactions');
        const tbody = document.getElementById('membersTableBody');
        tbody.innerHTML = '';

        members.forEach(member => {
            const activeIssues = txs.filter(t => t.memberId === member.id && (t.status === 'issued' || t.status === 'overdue')).length;
            tbody.innerHTML += `
                <tr>
                    <td>
                        <div class="member-info">
                            <img src="https://ui-avatars.com/api/?name=${member.name.replace(' ','+')}&background=random" class="member-avatar">
                            <div>
                                <span class="book-title">${member.name}</span>
                                <span class="book-sub">${member.email}</span>
                            </div>
                        </div>
                    </td>
                    <td>${member.studentId}</td>
                    <td>${member.dept}</td>
                    <td><span class="status ${activeIssues > 0 ? 'issued' : 'available'}">${activeIssues} Books</span></td>
                    <td>
                        <button class="btn-action" onclick="ui.deleteMember('${member.id}')"><i data-lucide="trash-2"></i></button>
                    </td>
                </tr>
            `;
        });
        lucide.createIcons();
    },

    handleMemberSubmit(e) {
        e.preventDefault();
        const members = DataStore.getData('lms_members');
        const newMember = {
            id: 'M' + (members.length + 1 + Math.floor(Math.random()*1000)),
            name: document.getElementById('memberName').value,
            studentId: document.getElementById('memberStudentId').value,
            dept: document.getElementById('memberDept').value,
            email: document.getElementById('memberEmail').value
        };
        members.push(newMember);
        DataStore.saveData('lms_members', members);
        this.closeModal('memberModal');
        this.renderMembers();
    },

    deleteMember(id) {
        if(confirm("Delete this member?")) {
            let members = DataStore.getData('lms_members');
            members = members.filter(m => m.id !== id);
            DataStore.saveData('lms_members', members);
            this.renderMembers();
        }
    },

    // --- ISSUE & RETURN RENDERER ---
    renderIssueReturn() {
        const books = DataStore.getData('lms_books').filter(b => b.availableCopies > 0);
        const members = DataStore.getData('lms_members');
        
        const bookSelect = document.getElementById('issueBook');
        const memberSelect = document.getElementById('issueMember');
        
        bookSelect.innerHTML = books.map(b => `<option value="${b.id}">${b.title} (${b.availableCopies} left)</option>`).join('');
        memberSelect.innerHTML = members.map(m => `<option value="${m.id}">${m.name} (${m.studentId})</option>`).join('');

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('issueDueDate').value = nextWeek.toISOString().split('T')[0];

        const txs = DataStore.getData('lms_transactions').filter(t => t.status === 'issued' || t.status === 'overdue');
        const allBooks = DataStore.getData('lms_books');
        
        const tbody = document.getElementById('returnTableBody');
        tbody.innerHTML = '';

        txs.forEach(tx => {
            const book = allBooks.find(b => b.id === tx.bookId);
            const member = members.find(m => m.id === tx.memberId);
            tbody.innerHTML += `
                <tr>
                    <td><div class="book-title">${book?.title}</div><span class="status ${tx.status}">${tx.status}</span></td>
                    <td>${member?.name}</td>
                    <td>${tx.dueDate}</td>
                    <td>
                        <button class="btn btn-primary" onclick="ui.returnBook('${tx.id}', '${tx.bookId}')">Return</button>
                    </td>
                </tr>
            `;
        });
    },

    handleIssueSubmit(e) {
        e.preventDefault();
        const bookId = document.getElementById('issueBook').value;
        const memberId = document.getElementById('issueMember').value;
        const dueDate = document.getElementById('issueDueDate').value;

        if(!bookId || !memberId) return alert("Select Book and Member");

        const books = DataStore.getData('lms_books');
        const txs = DataStore.getData('lms_transactions');

        const bookIndex = books.findIndex(b => b.id === bookId);
        if(books[bookIndex].availableCopies <= 0) return alert("Book unavailable");

        books[bookIndex].availableCopies -= 1;
        
        txs.push({
            id: 'TX' + Math.floor(Math.random() * 100000),
            bookId, memberId, dueDate,
            issueDate: new Date().toISOString().split('T')[0],
            returnDate: null,
            status: 'issued'
        });

        DataStore.saveData('lms_books', books);
        DataStore.saveData('lms_transactions', txs);
        
        alert("Book Issued Successfully!");
        this.renderIssueReturn();
    },

    returnBook(txId, bookId) {
        const txs = DataStore.getData('lms_transactions');
        const books = DataStore.getData('lms_books');

        const txIndex = txs.findIndex(t => t.id === txId);
        const bookIndex = books.findIndex(b => b.id === bookId);

        txs[txIndex].status = 'returned';
        txs[txIndex].returnDate = new Date().toISOString().split('T')[0];
        
        if(bookIndex > -1) books[bookIndex].availableCopies += 1;

        DataStore.saveData('lms_transactions', txs);
        DataStore.saveData('lms_books', books);

        this.renderIssueReturn();
    },

    // --- HISTORY RENDERER ---
    renderHistory() {
        const txs = DataStore.getData('lms_transactions').reverse();
        const books = DataStore.getData('lms_books');
        const members = DataStore.getData('lms_members');

        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';

        txs.forEach(tx => {
            const book = books.find(b => b.id === tx.bookId);
            const member = members.find(m => m.id === tx.memberId);
            tbody.innerHTML += `
                <tr>
                    <td>#${tx.id}</td>
                    <td>${book?.title || 'Deleted Book'}</td>
                    <td>${member?.name || 'Deleted Member'}</td>
                    <td>${tx.issueDate}</td>
                    <td><span class="status ${tx.status}">${tx.status.toUpperCase()}</span></td>
                </tr>
            `;
        });
    },

    // --- ANALYTICS RENDERER ---
    renderAnalytics() {
        const txs = DataStore.getData('lms_transactions');
        const books = DataStore.getData('lms_books');
        
        const textColor = document.body.classList.contains('dark-mode') ? '#f8fafc' : '#0f172a';
        const gridColor = document.body.classList.contains('dark-mode') ? '#334155' : '#e2e8f0';

        // Trend Chart
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        if (this.charts.trend) this.charts.trend.destroy();
        
        this.charts.trend = new Chart(trendCtx, {
            type: 'bar',
            data: {
                labels: ['Total Issues', 'Currently Active', 'Returned', 'Overdue'],
                datasets: [{
                    label: 'Transactions',
                    data: [
                        txs.length,
                        txs.filter(t=>t.status==='issued').length,
                        txs.filter(t=>t.status==='returned').length,
                        txs.filter(t=>t.status==='overdue').length
                    ],
                    backgroundColor: '#4f46e5',
                    borderRadius: 6
                }]
            },
            options: {
                scales: { 
                    y: { grid: { color: gridColor }, ticks: { color: textColor } },
                    x: { grid: { display: false }, ticks: { color: textColor } }
                },
                plugins: { legend: { display: false } }
            }
        });

        // Category Chart
        const catCtx = document.getElementById('categoryChart').getContext('2d');
        if (this.charts.category) this.charts.category.destroy();

        const categories = {};
        books.forEach(b => { categories[b.category] = (categories[b.category] || 0) + b.totalCopies; });

        this.charts.category = new Chart(catCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                plugins: { legend: { position: 'right', labels: { color: textColor } } }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});