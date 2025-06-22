const BookmarkName = document.getElementById("bookmarkName");
const BookmarkUrl = document.getElementById("bookmarkURL");
const BookmarkAddBtn = document.getElementById("submitBtn");
const BookmarkTable = document.getElementById("tableContent");
const notification = document.getElementById("notification");

// Function to add a new bookmark to the table
function addBookmark(data) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td></td>
        <td>${data.name}</td>
        <td>
            <button class="btn btn-visit btn-success">
                <a href="${normalizeUrl(data.url)}" target="_blank">
                    <i class="fa-solid fa-eye pe-2"></i>
                    Visit
                </a>
            </button>
        </td>
        <td>
            <button class="btn btn-delete btn-danger pe-2">
                <i class="fa-solid fa-trash-can"></i>
                Delete
            </button>
        </td>
    `;
    BookmarkTable.appendChild(newRow);

    // Save the new row to local storage
    saveTasks();
}

// Event listener for the "Add Bookmark" button
BookmarkAddBtn.addEventListener("click", function () {
    const data = {
        name: BookmarkName.value,
        url: BookmarkUrl.value,
    };
    // Check if the input data is valid
    // If not valid, show notification and return
    if (showNotification(data)) return;
    // If valid, add the bookmark
    addBookmark(data);
    // Update the index of each bookmark in the table
    updateIndexes();
    // Hide notification
    hideNotification();
    // Clear input fields after adding a bookmark
    clearInputFields();
});

// Clear input fields after adding a bookmark
function clearInputFields() {
    BookmarkName.value = "";
    BookmarkUrl.value = "";
}

//  Event listener for Hide notification when clicking on the error icon or box-info
notification.addEventListener("click", function (e) {
    if (e.target.classList.contains("error-svg-path") || e.target.classList.contains("error-svg")) {
        hideNotification();

    } else if (e.target.classList.contains("box-info")) {
        hideNotification();
    }
});

// Event listener for Hide notification when pressing the Escape key
document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {
        hideNotification();
    }
});

//  Function to hide the notification
function hideNotification() {
    notification.classList.add("d-none");
}
// Function to show notification if the input data is invalid
function showNotification(data) {
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)+(?:\:\d+)?(?:\/[^\s]*)?(?=\s|$)/;
    if (
        data.name === "" ||
        data.name === null ||
        data.name.length < 3 ||
        !/^[a-zA-Z0-9\s]+$/.test(data.name) ||
        data.url === null ||
        data.url === "" ||
        data.url === undefined ||
        data.url.length < 3 ||
        !urlRegex.test(data.url)
    ) {
        notification.classList.remove("d-none");
        return true;
    }

}

// Function to update the index of each bookmark in the table
function updateIndexes() {
    const rows = BookmarkTable.querySelectorAll("tr");
    rows.forEach((row, index) => {
        const indexCell = row.querySelector("td");
        indexCell.textContent = index + 1;
    });
}

// Event listener for the delete button in the bookmark table
BookmarkTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-delete")) {
        const row = event.target.closest("tr");
        BookmarkTable.removeChild(row);
        // Update the index of each bookmark after deletion
        updateIndexes();
        // Save the updated table to local storage
        saveTasks();
    }
});

// validate Bookmark name input 
BookmarkName.addEventListener("input", function () {
    if (BookmarkName.value.length > 3 &&
        BookmarkName.value.length < 20 &&
        /^[a-zA-Z0-9\s]+$/.test(BookmarkName.value)
    ) {
        BookmarkName.classList.add("is-valid");
        BookmarkName.classList.remove("is-invalid");
    } else {
        BookmarkName.classList.remove("is-valid");
        BookmarkName.classList.add("is-invalid");

    }
});
// validate Bookmark URL input 
BookmarkUrl.addEventListener("input", function () {
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)+(?:\:\d+)?(?:\/[^\s]*)?(?=\s|$)/;
    if (BookmarkUrl.value.length > 3 &&
        // BookmarkUrl.value.length < 20 &&
        urlRegex.test(BookmarkUrl.value)
    ) {
        BookmarkUrl.classList.add("is-valid");
        BookmarkUrl.classList.remove("is-invalid");
    } else {
        BookmarkUrl.classList.remove("is-valid");
        BookmarkUrl.classList.add("is-invalid");
    }
});

// Function to normalize the URL by adding "https://" if not present
function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
}


// Function to save the bookmark table to local storage
function saveTasks() {
    localStorage.setItem("Data", BookmarkTable.innerHTML);
}
// Load the bookmark table from local storage when the page loads
function loadTasks() {
    const savedData = localStorage.getItem("Data");
    if (savedData) {
        BookmarkTable.innerHTML = savedData;
        updateIndexes();
    }
}
loadTasks();    
