const menuItems = document.querySelectorAll('.menu-item');
let selectedIndex = 0;

function updateSelection() {
    menuItems.forEach(item => item.classList.remove('selected'));
    menuItems[selectedIndex].classList.add('selected');
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
            updateSelection();
            break;
        case 'ArrowDown':
            selectedIndex = (selectedIndex + 1) % menuItems.length;
            updateSelection();
            break;
        case 'Enter':
            menuItems[selectedIndex].click();
            break;
    }
});

menuItems.forEach((item, index) => {
    item.addEventListener('mouseover', () => {
        selectedIndex = index;
        updateSelection();
    });
    
    item.addEventListener('click', () => {
        console.log(`Selected: ${item.textContent}`);
        // Add your menu action handling here
    });
});

// Set initial selection
updateSelection();