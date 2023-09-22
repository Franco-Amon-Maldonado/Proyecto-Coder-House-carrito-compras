import { formatearDineroARPesos } from './formatearDinero.js'
import { formatearDineroARPesosCarrito } from './formatearDinero.js'

//variables
const $CARRITO = document.querySelector('#carrito')
const $CONTENIDO_CARRITO = document.querySelector('#lista-carrito tbody')
const $LISTA_PRODUCTOS = document.querySelector('#lista-productos')
const $VACIAR_CARRITO = document.querySelector('#vaciar-carrito')
const $BTN_COMPRAR = document.querySelector('#btn-comprar')
const $PRECIO_TOTAL = document.querySelector('#precio-total')

let listadoCarrito = []

cargarEvento()
async function cargarEvento() {
	$LISTA_PRODUCTOS.addEventListener('click', agregarProducto)
	$CARRITO.addEventListener('click', eliminarProducto)

	document.addEventListener('DOMContentLoaded', async () => {
		listadoCarrito = JSON.parse(localStorage.getItem('carrito')) || []
		ocultarBotonComprar()
		// Obtener los productos desde la API y renderizarlos
		const productos = await obtenerProductos()
		renderizarProductos(productos)
		añadirProductosCarrito()
	})

	$VACIAR_CARRITO.addEventListener('click', vaciarCarrito)
}

//Funciones

function btnComprar() {
	// Verificar si el botón "Comprar" ya existe en el carrito
	const botonComprarExistente = document.querySelector('#carrito button')

	if (!botonComprarExistente) {
		const btnComprar = document.createElement('button')
		btnComprar.classList.add('button-comprar')
		btnComprar.innerHTML = 'Comprar'
		$BTN_COMPRAR.appendChild(btnComprar)

		btnComprar.addEventListener('click', () => {
			// Corregir aquí
			Swal.fire('Genial', 'Comprado éxitosamente!', 'success')

			vaciarCarrito() // Vaciar el carrito al hacer clic

			ocultarBotonComprar()
		})
	}
}

// Función para obtener los productos desde la API
async function obtenerProductos() {
	try {
		const response = await fetch('../database/productos.json')
		const data = await response.json()
		return data // Retorna los datos de los productos en formato JSON
	} catch (error) {
		console.error('Error al obtener los productos:', error)
		return [] // En caso de error, retorna un array vacío
	}
}

function renderizarProductos(productos) {
	productos.forEach((producto) => {
		// Crea los elementos HTML para la tarjeta de producto
		const divCol = document.createElement('div')
		divCol.classList.add('col')

		const divCard = document.createElement('div')
		divCard.classList.add('card')

		const divImage = document.createElement('div')
		divImage.classList.add('h-100', 'm-auto')

		const img = document.createElement('img')
		img.src = producto.imagen // Asigna la URL de la imagen desde los datos del producto
		img.classList.add('mt-5')
		img.width = '150'
		img.alt = producto.titulo // Asigna el alt desde los datos del producto

		const divCardBody = document.createElement('div')
		divCardBody.classList.add('card-body')

		const h5 = document.createElement('h5')
		h5.classList.add('card-title')
		h5.textContent = producto.nombre // Asigna el título desde los datos del producto

		const p = document.createElement('p')
		p.classList.add('card-text')
		p.textContent = producto.descripcion // Asigna la descripción desde los datos del producto

		const ul = document.createElement('ul')
		ul.classList.add('list-group', 'list-group-flush')

		const li = document.createElement('li')
		li.classList.add('list-group-item', 'precio', 'text-end')
		li.textContent = formatearDineroARPesos(producto.precio) // Asigna el precio desde los datos del producto

		const divButton = document.createElement('div')
		divButton.classList.add('card-body', 'button')

		const a = document.createElement('a')
		a.href = '#'
		a.setAttribute('data-id', producto.id)
		a.classList.add('btn', 'btn-primary', 'agregar-carrito')
		a.textContent = 'Agregar al carrito'

		// Construye la estructura de la tarjeta de producto
		divImage.appendChild(img)
		divCardBody.appendChild(h5)
		divCardBody.appendChild(p)
		ul.appendChild(li)
		divCardBody.appendChild(ul)
		divButton.appendChild(a)
		divCard.appendChild(divImage)
		divCard.appendChild(divCardBody)
		divCard.appendChild(divButton)
		divCol.appendChild(divCard)

		// Agrega la tarjeta de producto a $LISTA_PRODUCTOS
		$LISTA_PRODUCTOS.appendChild(divCol)
	})
}

//Funcion vaciar carrito
function vaciarCarrito() {
	listadoCarrito = []
	localStorage.removeItem('carrito')
	limpiarCarrito()
	dibujarTotal()
	ocultarBotonComprar()
	mostrarOcultarBotonVaciarCarrito()
}

//Funcion para eliminar el producto

function eliminarProducto(e) {
	if (e.target.classList.contains('borrar-producto')) {
		const productoId = e.target.getAttribute('data-id')
		//Elimina el producto seleccionado
		Swal.fire({
			title: '¿Esta seguro de eliminar el producto del carrito?',
			text: 'Esta acción no se puede revertir',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminar',
		}).then((result) => {
			if (result.isConfirmed) {
				listadoCarrito = listadoCarrito.filter((producto) => producto.id !== productoId)
				añadirProductosCarrito()
				Swal.fire('Eliminado', 'Producto eliminado del carrito', 'success')
			}
		})
		//Traigo todos excepto el id que estoy seleccionado

		añadirProductosCarrito()

		if (listadoCarrito.length === 0) {
			ocultarBotonComprar()
		}
	}
}

//Funcion de agregar producto
function agregarProducto(e) {
	//Prevengo el evento por defecto del a
	e.preventDefault()
	//Pregunto si el usuario hizo click en el boton con la clase "agregar-carrito"
	if (e.target.classList.contains('agregar-carrito')) {
		let productoSeleccionado = e.target.parentNode.parentNode
		Toastify({
			text: 'Producto agregado al carrito',

			duration: 2000,
		}).showToast()
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
	const productoExistente = listadoCarrito.find((producto) => producto.id === infoProducto.id)

	if (productoExistente) {
		productoExistente.cantidad++
	} else {
		listadoCarrito.push(infoProducto)
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
            <td><img src="${imagen}" class="img-carrito" /></td>
            <td class= "td-carrito" style="white-space: pre-line; width:20%">${titulo}</td>
            <td class= "td-carrito">${formatearDineroARPesosCarrito(precio * cantidad)}</td>
            <td class= "td-carrito">${cantidad}
			
				<span><a href='#' class= "boton-sumar" data-id="${id}">+</a></span>
				<span><a href='#' class= "boton-restar" data-id="${id}">-</a></span>
			</td>
            <td class= "td-carrito"><a href='#' class="borrar-producto" data-id="${id}">X</a></td>
        `
		//Agrego el tr creado al tbody
		$CONTENIDO_CARRITO.appendChild(tr)

		const botonSumar = tr.querySelector('.boton-sumar')
		const botonRestar = tr.querySelector('.boton-restar')

		botonSumar.addEventListener('click', () => {
			// Aumentar la cantidad y el precio
			producto.cantidad++
			añadirProductosCarrito()
		})

		botonRestar.addEventListener('click', () => {
			// Reducir la cantidad y el precio si la cantidad es mayor que 1
			if (producto.cantidad > 1) {
				producto.cantidad--
				añadirProductosCarrito()
			} else {
				botonRestar.style.color = 'gray'
				return
			}
		})
	})

	if (listadoCarrito.length >= 1) {
		btnComprar()
	}

	dibujarTotal()
	ocultarBotonComprar()
	mostrarOcultarBotonVaciarCarrito()
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
		span.innerHTML = `Costo total: ${formatearDineroARPesosCarrito(costoTotal)}`
		span.style.fontWeight = 'bold'
		$PRECIO_TOTAL.appendChild(span)
	} else {
		$PRECIO_TOTAL.innerHTML = `<p>No hay productos</p>`
	}
}

function ocultarBotonComprar() {
	if (listadoCarrito.length > 0) {
		// Si hay elementos en el carrito, muestra el botón "Comprar"
		$BTN_COMPRAR.style.display = 'block'
	} else {
		// Si no hay elementos en el carrito, oculta el botón "Comprar"
		$BTN_COMPRAR.style.display = 'none'
	}
}

function mostrarOcultarBotonVaciarCarrito() {
	const botonVaciarCarrito = document.querySelector('#vaciar-carrito')

	if (listadoCarrito.length > 0) {
		// Si hay elementos en el carrito, muestra el botón
		botonVaciarCarrito.style.display = 'block'
	} else {
		// Si no hay elementos en el carrito, oculta el botón
		botonVaciarCarrito.style.display = 'none'
	}
}
