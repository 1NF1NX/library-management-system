console.log("Javascript is working");
let books = [];
let issuedBooks = [];

function showSection(section) {
	let content = document.getElementById("content");

	if(section === "add") {
		content.innerHTML = `
		<h2>Add a Book</h2>
		<p>Book registration section</p>
	
        <form>
            <label>Book ID:</label>
            <input type="text" id="bookId" required>

            <label>Title:</label>
            <input type="text" id="title" required>

            <label>Author:</label>
            <input type="text" id="author" required>

            <label>Publication Year:</label>
            <input type="number" id="year" required>

            <label>Available Copies:</label>
            <input type="number" id="copies" min="0" required>

            <button type="button" onclick="addBook()">
                Add Book
            </button>
        </form>
    `;
}
	else if (section === "display") {
    let rows = "";

    if (books.length === 0) {
        rows = `<tr><td colspan="5">No books have been added yet.</td></tr>`;
    } else {
        books.forEach(book => {
            rows += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.year}</td>
                    <td>${book.copies}</td>
                </tr>
            `;
        });
    }

    content.innerHTML = `
        <h2>Book Inventory</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year</th>
                        <th>Available Copies</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}
	else if (section === "search") {
    content.innerHTML = `
        <h2>Search Books</h2>

        <div class="search-box">
            <input type="text" id="searchInput"
                   placeholder="Enter Book ID or Title">

            <button onclick="searchBook()">Search</button>
        </div>

        <div id="searchResult"></div>
    `;
}
	else if (section === "issue") {
    content.innerHTML = `
        <h2>Issue a Book</h2>

        <form>
            <label>Book ID:</label>
            <input type="text" id="issueBookId" required>

            <label>Student ID:</label>
            <input type="text" id="issueStudentId" required>

            <button type="button" onclick="issueBook()">
                Issue Book
            </button>
        </form>
    `;
}
	else if (section === "return") {
	    content.innerHTML = `
		<h2>Return a Book</h2>

		<form>
		    <label>Book ID:</label>
		    <input type="text" id="returnBookId" required>

		    <label>Student ID:</label>
		    <input type="text" id="returnStudentId" required>

		    <button type="button" onclick="returnBook()">
			Return Book
		    </button>
		</form>
	    `;
	}
	else if(section === "issued") {
		content.innerHTML = `
		<h2>Currently issued Books</h2>
			`;
	}
	else {
		content.innerHTML = `
		<h2>Fallback condition hit</h2>
		`;
	}
}
function addBook() {
    let id = document.getElementById("bookId").value;
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let year = Number(document.getElementById("year").value);
    let copies = Number(document.getElementById("copies").value);

    if (books.some(book => book.id === id)) {
        alert("Book ID already exists!");
        return;
    }

    if (year <= 0 || copies < 0 ||
        !Number.isInteger(year) || !Number.isInteger(copies)) {
        alert("Invalid year or copy count!");
        return;
    }

    books.push({
        id: id,
        title: title,
        author: author,
        year: year,
        copies: copies
    });

    alert("Book added successfully!");
}

function searchBook() {
    let query = document.getElementById("searchInput").value
        .trim().toLowerCase();

    let result = books.filter(book =>
        book.id.toLowerCase() === query ||
        book.title.toLowerCase().includes(query)
    );

    let output = document.getElementById("searchResult");

    if (result.length === 0) {
        output.innerHTML = "<p>No matching books found.</p>";
        return;
    }

    output.innerHTML = result.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p><strong>Book ID:</strong> ${book.id}</p>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Publication Year:</strong> ${book.year}</p>
            <p><strong>Available Copies:</strong> ${book.copies}</p>
        </div>
    `).join("");
}

function issueBook() {
    let bookId = document.getElementById("issueBookId").value.trim();
    let studentId = document.getElementById("issueStudentId").value.trim();

    let book = books.find(book => book.id === bookId);

    if (!book) {
        alert("Book not found!");
        return;
    }

    if (book.copies <= 0) {
        alert("No copies available!");
        return;
    }

    book.copies--;

    issuedBooks.push({
        bookId: bookId,
        studentId: studentId,
        returned: false
    });

    alert("Book issued successfully!");
}

function returnBook() {
    let bookId = document.getElementById("returnBookId").value.trim();
    let studentId = document.getElementById("returnStudentId").value.trim();

    let transaction = issuedBooks.find(issue =>
        issue.bookId === bookId &&
        issue.studentId === studentId &&
        issue.returned === false
    );

    if (!transaction) {
        alert("No matching issue record found!");
        return;
    }

    let book = books.find(book => book.id === bookId);

    transaction.returned = true;
    book.copies++;

    alert("Book returned successfully!");
}
