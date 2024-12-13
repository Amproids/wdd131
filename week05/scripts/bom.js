const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// Get chapters array from localStorage or create empty array if none exists
const chaptersArray = getChapterList() || [];

// Display any existing chapters when page loads
chaptersArray.forEach(chapter => {
    displayList(chapter);
});

// Button click handler
button.addEventListener('click', () => {
    if (input.value !== '') {  // Only add if input is not empty
        displayList(input.value);
        chaptersArray.push(input.value);
        setChapterList();
        input.value = '';  // Clear the input field
        input.focus();     // Set focus back to input
    }
});

// Function to display chapter in the list
function displayList(item) {
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    
    li.textContent = item;
    deleteButton.textContent = '❌';
    
    deleteButton.addEventListener('click', function() {
        list.removeChild(this.parentElement);  // Remove from display
        deleteChapter(item);  // Remove from storage
    });
    
    li.appendChild(deleteButton);
    list.appendChild(li);
}

// Function to set chapters array in localStorage
function setChapterList() {
    localStorage.setItem('bomChapters', JSON.stringify(chaptersArray));
}

// Function to get chapters array from localStorage
function getChapterList() {
    return JSON.parse(localStorage.getItem('bomChapters'));
}

// Function to delete a chapter
function deleteChapter(chapter) {
    const index = chaptersArray.indexOf(chapter);
    if (index !== -1) {
        chaptersArray.splice(index, 1);  // Remove the item at the found index
        setChapterList();  // Update localStorage
    }
}