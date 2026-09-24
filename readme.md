#  Proyecto — E-commerce

Proyecto de e-commerce desarrollado para la materia **Laboratorio de Aplicaciones Web Cliente**. Es una tienda minimalista de estilo editorial que consume la [Fake Store API](https://fakestoreapi.com) para listar productos, con carrito de compras persistente y navegación por categorías.

##  Demo

https://gabrielgallardo83.github.io/LaboratorioDeAplicacionesWebCliente/

##  Funcionalidades

- Listado de productos consumidos desde la API, mostrados en cards
- Sección de "Destacados" con selección aleatoria (solo visible en la home)
- Navegación por categorías (Electrónica, Joyería, Hombres, Mujeres)
- Buscador de productos en tiempo real
- Modal de detalle de producto (título, imagen, precio, descripción)
- Carrito de compras persistido en `localStorage`:
  - Agregar productos con mensaje de confirmación
  - Sidebar con listado de productos seleccionados
  - Control de cantidad por producto (+/-), con reglas de deshabilitado
  - Eliminar producto individual
  - Vaciar carrito completo
  - Finalizar compra (limpia carrito y localStorage)
  - Badge con cantidad total de productos en el navbar
- Diseño responsive (mobile / tablet / desktop)
- HTML semántico y accesible (`header`, `nav`, `main`, `section`, `footer`, manejo de foco, `aria-live`, `aria-label`)

##  Tecnologías

- HTML5 semántico
- CSS3 (variables CSS, Flexbox, Grid)
- JavaScript vanilla (DOM, Fetch API, LocalStorage)
- [Fake Store API](https://fakestoreapi.com)
- Tipografías: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)

##  Estructura del proyecto

proyecto-ecommerce/
├── index.html
├── css/
│ ├── variables.css
│ ├── base.css
│ ├── layout.css
│ └── componentes.css
└── js/
├── api.js
├── cart.js
├── render.js
└── app.js


##  Cómo correrlo localmente

Al ser un proyecto sin build ni dependencias, alcanza con abrir `index.html` en el navegador, o servirlo con una extensión tipo Live Server

```bash
git clone https://github.com/gabrielgallardo83/LaboratorioDeAplicacionesWebCliente.git
cd LaboratorioDeAplicacionesWebCliente
```

Luego abrir `index.html` con Live Server (VS Code) o similar.

##  Autor


| Gabriel Gallardo| (https://github.com/gabrielgallardo83) 
