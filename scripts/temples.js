document.getElementById('hamburger').addEventListener('click', function() {
    const navList = document.querySelector('nav ul');
    this.textContent = navList.classList.contains('show') ? '☰' : '✕';
    navList.classList.toggle('show');
});
