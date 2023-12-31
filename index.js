document.addEventListener("DOMContentLoaded", function () {
  // Creación del header con enlaces
  const header = document.createElement("header");
  header.style.backgroundColor = "#333";
  header.style.color = "#fff";
  header.style.padding = "10px";
  header.style.textAlign = "center";

  const nav = document.createElement("nav");

  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.display = "flex";
  ul.style.justifyContent = "center";
  ul.style.padding = "0";

  const enlaceInicio = document.createElement("a");
  enlaceInicio.textContent = "Inicio";
  enlaceInicio.href = "#";
  enlaceInicio.style.color = "inherit";
  enlaceInicio.style.textDecoration = "none";
  enlaceInicio.style.marginRight = "20px";

  const enlaceMenu = document.createElement("a");
  enlaceMenu.textContent = "Menú";
  enlaceMenu.href = "#menu";
  enlaceMenu.style.color = "inherit";
  enlaceMenu.style.textDecoration = "none";
  enlaceMenu.style.marginRight = "20px";

  const enlaceCarrito = document.createElement("a");
  enlaceCarrito.textContent = "Carrito";
  enlaceCarrito.href = "#carrito";
  enlaceCarrito.style.color = "inherit";
  enlaceCarrito.style.textDecoration = "none";

  ul.appendChild(enlaceInicio);
  ul.appendChild(enlaceMenu);
  ul.appendChild(enlaceCarrito);

  nav.appendChild(ul);
  header.appendChild(nav);

  const carritoDiv = document.getElementById("carrito");
  document.body.insertBefore(header, carritoDiv);
  document.body.insertBefore(header, document.body.firstChild);

  const listaPizzas = document.getElementById("lista-pizzas");
  const cantidadInput = document.getElementById("cantidad");
  const agregarAlCarritoBoton = document.getElementById("agregar-al-carrito");
  const itemsCarrito = document.getElementById("items-carrito");
  const totalElemento = document.getElementById("total");
  const realizarPedidoBoton = document.getElementById("realizar-pedido");

  const pizzas = [
    { nombre: "Margarita", precio: 300 },
    { nombre: "Pepperoni", precio: 200 },
    { nombre: "Hawaiana", precio: 500 },
  ];

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  agregarAlCarritoBoton.addEventListener("click", function () {
    const indicePizzaSeleccionada = listaPizzas.selectedIndex;
    const pizzaSeleccionada = pizzas[indicePizzaSeleccionada];
    const cantidad = parseInt(cantidadInput.value);
    const subtotal = pizzaSeleccionada.precio * cantidad;

    carrito.push({ pizza: pizzaSeleccionada.nombre, cantidad, subtotal });
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
    Swal.fire({
      icon: "success",
      title: "¡Pizza agregada!",
      text: `Has agregado ${cantidad} ${pizzaSeleccionada.nombre} al carrito.`,
      timer: 2000,
      timerProgressBar: true,
    });
  });

  realizarPedidoBoton.addEventListener("click", function () {
    let total = 0;
    carrito.forEach((item) => (total += item.subtotal));

    Swal.fire({
      icon: "info",
      title: "Resumen del Pedido",
      html: `
        <ul>
          ${carrito
            .map(
              (item, index) =>
                `<li>${item.pizza} x${item.cantidad} - $${item.subtotal} <button class="eliminar-item" data-index="${index}">Eliminar</button></li>`
            )
            .join("")}
        </ul>
        <p>Total a pagar: $${total}</p>
      `,
      confirmButtonText: "Confirmar Pedido",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma el pedido, borrar el carrito y el almacenamiento local
        carrito = [];
        localStorage.removeItem("carrito");
        actualizarCarrito();

        Swal.fire({
          icon: "success",
          title: "Pedido confirmado",
          text: "Gracias por tu compra. Vuelva pronto.",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    });
  });

  function actualizarCarrito() {
    itemsCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.pizza} x${item.cantidad} - $${item.subtotal}
        <button class="eliminar-item" data-index="${index}">Eliminar</button>
      `;
      itemsCarrito.appendChild(li);
      total += item.subtotal;
    });

    totalElemento.textContent = `Total: $${total}`;

    const botonesEliminar = document.querySelectorAll(".eliminar-item");
    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", function () {
        const index = parseInt(boton.getAttribute("data-index"));
        eliminarProductoDelCarrito(index);
      });
    });
  }

  function eliminarProductoDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
  }

  function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  actualizarCarrito();
});

function obtenerFechaYHora() {

  const apiUrl = 'https://worldtimeapi.org/api/ip';


  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {

          const fechaHora = new Date(data.utc_datetime);


          const fechaHoraFormateada = fechaHora.toLocaleString();
          document.getElementById('fecha-hora-actual').textContent = `Vivimos en el día: ${fechaHoraFormateada}`;
      })
      .catch(error => {
          console.error('Error al obtener la fecha y hora:', error);
          document.getElementById('fecha-hora-actual').textContent = 'No se pudo obtener la fecha y hora.';
      });
}

obtenerFechaYHora();
