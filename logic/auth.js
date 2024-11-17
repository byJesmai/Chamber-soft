function login(event) {
    event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada

    // Obtener los valores de los campos de entrada
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    // Validar si los campos están completos
    if (username === '' || password === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Enviar los datos al servidor
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Correo o contraseña incorrectos');
        }
        return response.json();
    })
    .then((data) => {
        alert(data.message);
        // Redirigir a otra página si el inicio de sesión es exitoso
        window.location.href = '/pages/index.html';
    })
    .catch((error) => {
        alert(error.message);
    });
}


function register(event) {
    event.preventDefault(); // Evitar que se envíe el formulario de forma predeterminada

    // Obtener los valores de los campos de entrada
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validar si los campos están completos
    if (username === '' || password === '') {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Enviar los datos al servidor
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }
        return response.json();
    })
    .then((data) => {
        alert(data.message);
        // Redirigir a la página de inicio de sesión si el registro es exitoso
        window.location.href = '/auth/login.html';
    })
    .catch((error) => {
        alert(error.message);
    });
}
