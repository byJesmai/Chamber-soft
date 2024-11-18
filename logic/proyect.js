
function crear_proyect(event) {
    event.preventDefault();

    // Obtener los valores de los campos de entrada
    const nameproyect = document.getElementById('nameproyect').value;
    const propietarioproyect = document.getElementById('propietarioproyect').value;
    const creationDateFromCampaignIni = document.getElementById('creationDateFromCampaignIni').value;
    const creationDateToCampaignFin = document.getElementById('creationDateToCampaignFin').value;


    // Validar si los campos están completos
    if (!nameproyect || !propietarioproyect || !creationDateFromCampaignIni || !creationDateToCampaignFin) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Crear el objeto de datos a enviar
    const data = {
        nameproyect,
        propietarioproyect,
        creationDateFromCampaignIni,
        creationDateToCampaignFin
    };

    // Verifica los datos del objeto
    console.log('Datos a enviar:', data);

    fetch('http://localhost:3000/create_proyect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (!response.ok) {
            return response.text().then(err => {
                throw new Error(err || 'Error desconocido');
            });
        }
        return response.json();
    })
    .then((data) => {
        alert(data.message);
        window.location.href = '/pages/gestionar_proyect.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message);
    });
}


  // Datos de ejemplo (en una aplicación real, estos datos vendrían de una base de datos)
  const proyectos = [
    { id: 1, nombre: "Proyecto A", propietario: "Juan Pérez", participantes: ["Ana", "Carlos", "Diana"] },
    { id: 2, nombre: "Proyecto B", propietario: "María García", participantes: ["Eduardo", "Fernanda"] },
    { id: 3, nombre: "Proyecto C", propietario: "Pedro López", participantes: ["Gabriela", "Héctor", "Isabel", "Jorge"] },
];

let currentSort = { key: 'id', order: 'asc' };

function renderTable() {
    const tableBody = document.querySelector('#proyectosTable tbody');
    tableBody.innerHTML = '';

    const sortedProyectos = [...proyectos].sort((a, b) => {
        let aValue = a[currentSort.key];
        let bValue = b[currentSort.key];

        if (currentSort.key === 'participantes') {
            aValue = a.participantes.length;
            bValue = b.participantes.length;
        }

        if (aValue < bValue) return currentSort.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSort.order === 'asc' ? 1 : -1;
        return 0;
    });

    sortedProyectos.forEach(proyecto => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = proyecto.id;
        row.insertCell().textContent = proyecto.nombre;
        row.insertCell().textContent = proyecto.propietario;
        row.insertCell().textContent = proyecto.participantes.join(", ");
    });

    updateSortIcons();
}

function updateSortIcons() {
    document.querySelectorAll('th .sort-icon').forEach(icon => {
        icon.classList.remove('desc');
    });
    const currentIcon = document.querySelector(`th[data-sort="${currentSort.key}"] .sort-icon`);
    if (currentIcon) {
        currentIcon.classList.toggle('desc', currentSort.order === 'desc');
    }
}

document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.dataset.sort;
        if (key === currentSort.key) {
            currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort = { key, order: 'asc' };
        }
        renderTable();
    });
});

// Renderizar la tabla inicialmente
renderTable();