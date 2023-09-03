//variables
const $CARRITO = document.querySelector('#carrito')
const $CONTENIDO_CARRITO = document.querySelector('#lista-carrito tbody')
const $LISTA_PRODUCTOS = document.querySelector('#lista-productos')
const $VACIAR_CARRITO = document.querySelector('#vaciar-carrito')
let listadoCarrito = []

cargarEvento()
function cargarEvento() {
	$LISTA_PRODUCTOS.addEventListener('click', agregarProducto)
	$CARRITO.addEventListener('click', eliminarProducto)
	$VACIAR_CARRITO.addEventListener('click', vaciarCarrito)
}

//Funciones

//Funcion vaciar carrito

function vaciarCarrito() {
	listadoCarrito = []
	limpiarCarrito()
}

//Funcion para eliminar el producto

function eliminarProducto(e) {
	if (e.target.classList.contains('borrar-producto')) {
		const productoId = e.target.getAttribute('data-id')
		console.log(productoId)
		//Elimina el producto seleccionado

		//Traigo todos excepto el id que estoy seleccionado
		listadoCarrito = listadoCarrito.filter((producto) => producto.id !== productoId)

		añadirProductosCarrito()
	}
}

//Funcion de agregar producto
function agregarProducto(e) {
	//Prevengo el evento por defecto del a
	e.preventDefault()
	//Pregunto si el usuario hizo click en el boton con la clase "agregar-carrito"
	if (e.target.classList.contains('agregar-carrito')) {
		let productoSeleccionado = e.target.parentNode.parentNode
		obtenerDatosProductos(productoSeleccionado)
	}
}

function obtenerDatosProductos(producto) {
	//Creo objeto del producto seleccionado
	const infoProducto = {
		imagen: producto.querySelector('img').src,
		titulo: producto.querySelector('.card-title').textContent,
		precio: producto.querySelector('.precio').textContent,
		id: producto.querySelector('a').getAttribute('data-id'),
		cantidad: 1,
	}

	//Compruebo si el producto ya esta agregado al carrito

	const productoExistente = listadoCarrito.some((producto) => producto.id === infoProducto.id)

	if (productoExistente) {
		//Actualizo la cantidad
		const productos = listadoCarrito.map((producto) => {
			if (producto.id === infoProducto.id) {
				producto.cantidad++
				return producto //Devuelvo el objeto actualizado
			} else {
				return producto //Devuelvo los productos que no son los duplicados
			}
		})

		listadoCarrito = [...productos]
	} else {
		//cargo el carrito
		listadoCarrito = [...listadoCarrito, infoProducto]
	}

	//Llamo a la funcion encargada de agregar productos al carrito
	añadirProductosCarrito()
}

//Mostrando el carrito de compras

function añadirProductosCarrito() {
	//Limpio el html en cada iteracion para evitar la duplicidad de productos
	limpiarCarrito()

	//Recorro el array del carrito
	listadoCarrito.forEach((producto) => {
		const tr = document.createElement('tr')
		const { imagen, precio, titulo, cantidad, id } = producto
		//Creo la fila para el tbody
		tr.innerHTML = `
            <td><img src="${imagen}" width="100" /></td>
            <td style="white-space: pre-line; width:20%">${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href='#' class="borrar-producto" data-id="${id}">X</a></td>
        `
		//Agrego el tr creado al tbody
		$CONTENIDO_CARRITO.appendChild(tr)
	})
}

function limpiarCarrito() {
	while ($CONTENIDO_CARRITO.firstChild) {
		$CONTENIDO_CARRITO.removeChild($CONTENIDO_CARRITO.firstChild)
	}
}
