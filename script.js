const sporeField = document.getElementById('sporeField');
const hallucinationArea = document.getElementById('hallucinationArea');
const jitterBox = document.querySelector('[data-jitter]');
const nodes = document.querySelectorAll('.node');

function spawnSpore(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight, life = 7000) {
    if (!sporeField) return;
    const spore = document.createElement('span');
    const size = 2 + Math.random() * 5;
    spore.className = 'spore';
    spore.style.cssText = `
        position:absolute;
        left:${x}px;
        top:${y}px;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${Math.random() > 0.7 ? 'rgba(255,110,168,.7)' : 'rgba(136,255,170,.8)'};
        box-shadow:0 0 10px rgba(136,255,170,.45);
        opacity:${0.4 + Math.random() * 0.6};
        transform:translate3d(0,0,0);
        transition:transform ${life}ms linear, opacity ${life}ms linear;
    `;

    sporeField.appendChild(spore);

    requestAnimationFrame(() => {
        spore.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${-100 - Math.random() * 160}px)`;
        spore.style.opacity = '0';
    });

    setTimeout(() => spore.remove(), life + 80);
}

setInterval(() => {
    for (let i = 0; i < 2; i += 1) spawnSpore();
}, 350);

window.addEventListener('mousemove', (event) => {
    if (Math.random() > 0.45) return;
    spawnSpore(event.clientX + (Math.random() - 0.5) * 30, event.clientY + (Math.random() - 0.5) * 30, 2500);
});

if (hallucinationArea) {
    hallucinationArea.addEventListener('click', () => {
        document.body.style.filter = 'hue-rotate(24deg) contrast(1.15) blur(.35px)';
        if (jitterBox) jitterBox.classList.add('active');
        setTimeout(() => {
            document.body.style.filter = '';
            if (jitterBox) jitterBox.classList.remove('active');
        }, 260);
    });
}

nodes.forEach((node) => {
    node.addEventListener('click', () => {
        node.classList.toggle('corrupt');
    });
});
