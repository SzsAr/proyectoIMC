let nombres = JSON.parse(localStorage.getItem('nombres')) || [];
let pesos = JSON.parse(localStorage.getItem('pesos')) || [];
let alturas = JSON.parse(localStorage.getItem('alturas')) || [];
let resultados = JSON.parse(localStorage.getItem('resultados')) || [];
let clasificacion = JSON.parse(localStorage.getItem('clasificacion')) || [];

const guardar = document.getElementById('btn-guardar');

const cambiarColor = document.getElementById('btn-color');
cambiarColor.addEventListener('click', () => {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('bg-light');
});

guardar.addEventListener('click', () => { 
    let nombre = document.getElementById('inputNombre').value;
    nombres.push(nombre);
    
    let peso = document.getElementById('inputPeso').value;
    peso = parseFloat(peso);
    pesos.push(peso);
    
    let altura = document.getElementById('inputAltura').value;
    altura = parseFloat(altura);
    alturas.push(altura);

    if (!nombre || !peso || !altura) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    let altura_2 = altura * altura;
    let imc = peso / altura_2;
    resultados.push(imc);

    let clase = "";
    if (imc < 18.5) {
        clase = "BAJO PESO";
    } else if (imc < 25) {
        clase = "NORMAL";
    } else if (imc < 30) {
        clase = "SOBREPESO";
    } else {
        clase = "OBESIDAD";
    }
    
    clasificacion.push(clase);

    // Guardar los datos en localStorage
    localStorage.setItem('nombres', JSON.stringify(nombres));
    localStorage.setItem('pesos', JSON.stringify(pesos));
    localStorage.setItem('alturas', JSON.stringify(alturas));
    localStorage.setItem('resultados', JSON.stringify(resultados));
    localStorage.setItem('clasificacion', JSON.stringify(clasificacion));

    // Limpiar los campos de entrada
    document.getElementById('inputNombre').value = "";
    document.getElementById('inputPeso').value = "";
    document.getElementById('inputAltura').value = "";
});

const mostrar = document.getElementById('btn-resultados');
mostrar.addEventListener('click', () => {
    const tabla = document.getElementById('tablaResultados');
    tabla.innerHTML = ""; // Limpiar la tabla antes de mostrar los resultados

    for (let i = 0; i < resultados.length; i++) {
        const fila = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');

        td1.textContent = nombres[i];
        td2.textContent = pesos[i];
        td3.textContent = alturas[i];
        td4.textContent = resultados[i].toFixed(2);
        td5.textContent = clasificacion[i];

        fila.appendChild(td1);
        fila.appendChild(td2);
        fila.appendChild(td3);
        fila.appendChild(td4);
        fila.appendChild(td5);

        if (clasificacion[i] === "BAJO PESO") {
            fila.classList.add('table-primary');
        } else if (clasificacion[i] === "NORMAL") {
            fila.classList.add('table-success');
        } else if (clasificacion[i] === "SOBREPESO") {
            fila.classList.add('table-warning');
        } else if (clasificacion[i] === "OBESIDAD") {
            fila.classList.add('table-danger');
        }

        tabla.appendChild(fila);
    }
});

document.getElementById('btn-exportar-pdf').addEventListener('click', exportarPDF);

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const resultados = JSON.parse(localStorage.getItem('resultados')) || [];

    doc.text("Resultados de IMC", 10, 10);
    doc.text("Nombre, Peso, Altura, IMC, Clasificación", 10, 20); // Encabezados

    for (let i = 0; i < resultados.length; i++) {
        const row = `${nombres[i]}, ${pesos[i]}, ${alturas[i]}, ${resultados[i].toFixed(2)}, ${clasificacion[i]}`;
        doc.text(row, 10, 30 + (i * 10)); // Ajustar la posición de cada fila
    }

    doc.save("resultados.pdf"); // Descargar el PDF
}
