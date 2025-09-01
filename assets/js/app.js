async function loadConfig() {
    const response = await fetch('data/config.json');
    const config = await response.json();
    document.getElementById('brandName').textContent = config.brandName;
    document.getElementById('tagline').textContent = config.tagline;
    document.getElementById('address').textContent = config.address;
    document.getElementById('hours').textContent = config.hours;
    document.getElementById('instagram').href = config.instagram;
}

async function loadMenu() {
    const response = await fetch('data/menu.json');
    const menu = await response.json();
    const menuContainer = document.getElementById('menu');

    menu.sections.forEach(section => {
        const sectionEl = document.createElement('section');
        const title = document.createElement('h2');
        title.textContent = section.name;
        sectionEl.appendChild(title);

        const list = document.createElement('ul');
        section.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
        sectionEl.appendChild(list);
        menuContainer.appendChild(sectionEl);
    });
}

if (document.getElementById('brandName')) {
    loadConfig();
}
if (document.getElementById('menu')) {
    loadMenu();
}