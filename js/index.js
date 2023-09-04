//variables
const $CARRITO = document.querySelector('#carrito')
const $CONTENIDO_CARRITO = document.querySelector('#lista-carrito tbody')
const $LISTA_PRODUCTOS = document.querySelector('#lista-productos')
const $VACIAR_CARRITO = document.querySelector('#vaciar-carrito')
const $INPUT_FILTER = document.querySelector('#input-filter')
const $PRECIO_TOTAL = document.querySelector('#precio-total')
const $PRODUCTOS = document.querySelectorAll('.listado-productos .card')
let listadoCarrito = []

cargarEvento()
function cargarEvento() {
	$LISTA_PRODUCTOS.addEventListener('click', agregarProducto)
	$CARRITO.addEventListener('click', eliminarProducto)

	document.addEventListener('DOMContentLoaded', () => {
		listadoCarrito = JSON.parse(localStorage.getItem('carrito')) || []

		añadirProductosCarrito()
	})

	//Filtrar productos

	$INPUT_FILTER.addEventListener('keyup', () => {
		const filtro = $INPUT_FILTER.value.toLowerCase().trim()
		const productosFiltrados = Array.from($PRODUCTOS).filter((producto) => {
			const tituloProducto = producto.querySelector('.card-title').textContent.toLowerCase()
			return tituloProducto.includes(filtro)
		})

		$PRODUCTOS.forEach((producto) => {
			if (productosFiltrados.includes(producto)) {
				producto.style.display = 'block'
			} else {
				producto.style.display = 'none'
			}
		})
	})

	$VACIAR_CARRITO.addEventListener('click', vaciarCarrito)
}

//Funciones

//Funcion vaciar carrito

function vaciarCarrito() {
	listadoCarrito = []
	localStorage.removeItem('carrito')
	limpiarCarrito()
	dibujarTotal()
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
		precio: parseFloat(producto.querySelector('.precio').textContent.replace('$', '')), //extraigo el precio como numero
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

	dibujarTotal()
	agregarLocalStorage()
}

function limpiarCarrito() {
	while ($CONTENIDO_CARRITO.firstChild) {
		$CONTENIDO_CARRITO.removeChild($CONTENIDO_CARRITO.firstChild)
	}
}

function agregarLocalStorage() {
	localStorage.setItem('carrito', JSON.stringify(listadoCarrito))
}

function calcularTotal() {
	const costoTotal = listadoCarrito.reduce(
		(total, producto) => total + parseFloat(producto.precio) * producto.cantidad,
		0
	)
	return costoTotal
}

function dibujarTotal() {
	const costoTotal = calcularTotal()

	if (listadoCarrito.length > 0) {
		$PRECIO_TOTAL.innerHTML = ''
		let span = document.createElement('span')
		span.innerHTML = `Costo total: $${costoTotal.toFixed(3)}`
		$PRECIO_TOTAL.appendChild(span)
	} else {
		$PRECIO_TOTAL.innerHTML = `<p>No hay productos</p>`
	}
}
