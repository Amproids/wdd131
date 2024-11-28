const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');


button.addEventListener('click', (e) => {
    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    li.textContent = input.value;
    deleteButton.textContent = '❌';
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        li.parentNode.removeChild(li);
    });
    li.appendChild(deleteButton);
    list.appendChild(li);
});