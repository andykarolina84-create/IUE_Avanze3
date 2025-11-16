/* ===========================================================
   app.js - versión final con login, roles y header dinámico
   =========================================================== */

// === SLIDER PRINCIPAL ===
(function initSlider() {
  const items = document.querySelectorAll('.slider .item');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');

  if (!items || items.length === 0) return;

  let active = 3;

  function loadShow() {
    let stt = 0;
    if (items[active]) {
      items[active].style.transform = 'none';
      items[active].style.zIndex = 1;
      items[active].style.filter = 'none';
      items[active].style.opacity = 1;
    }

    for (let i = active + 1; i < items.length; i++) {
      stt++;
      if (!items[i]) continue;
      items[i].style.transform = `perspective(16px) translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) rotateY(-1deg)`;
      items[i].style.zIndex = -stt;
      items[i].style.filter = 'blur(5px)';
      items[i].style.opacity = stt > 2 ? 0 : 0.6;
    }

    stt = 0;
    for (let i = active - 1; i >= 0; i--) {
      stt++;
      if (!items[i]) continue;
      items[i].style.transform = `perspective(16px) translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) rotateY(1deg)`;
      items[i].style.zIndex = -stt;
      items[i].style.filter = 'blur(5px)';
      items[i].style.opacity = stt > 2 ? 0 : 0.6;
    }
  }

  loadShow();

  next?.addEventListener('click', () => {
    active = active + 1 < items.length ? active + 1 : active;
    loadShow();
  });

  prev?.addEventListener('click', () => {
    active = active - 1 >= 0 ? active - 1 : active;
    loadShow();
  });
})();

// === CLICK EN TARJETAS DEL CARRUSEL ===
document.querySelectorAll('.slider .item').forEach(item => {
  item.addEventListener('click', () => {
    const url = item.getAttribute('data-url');
    if (url) window.location.href = url;
  });
});

// === FUNCIÓN GENERAL PARA MODALES ===
function setupModal(modalId, buttonId) {
  const modal = document.getElementById(modalId);
  const button = document.getElementById(buttonId);
  if (!modal || !button) return;

  const close = modal.querySelector('.cerrar');
  button.addEventListener('click', () => modal.style.display = 'flex');
  close?.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
}

// === MODALES ===
setupModal('modalConfiguracion', 'btnConfiguracion');
setupModal('modalNotificaciones', 'btnNotificaciones');

// === CARRUSELES SECUNDARIOS ===
document.querySelectorAll('.carousel-container').forEach(container => {
  const track = container.querySelector('.carousel-track');
  const btnPrev = container.querySelector('.carousel-btn.prev');
  const btnNext = container.querySelector('.carousel-btn.next');

  if (!track) return;

  btnNext?.addEventListener('click', () => {
    track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' });
  });
  btnPrev?.addEventListener('click', () => {
    track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' });
  });

  track.addEventListener('wheel', e => {
    e.preventDefault();
    track.scrollLeft += e.deltaY;
  });
});
//-----------------------------------------------------------

// === CLICK EN TARJETAS DEL CARRUSEL DE NOTICIAS ===
document.querySelectorAll(".carousel-section.noticias .card").forEach(card => {
  card.style.cursor = "pointer"; // opcional, mano al pasar
  card.addEventListener("click", () => {
    window.location.href = "noticias.html";
  });
});

//-----------------------------------------------------------

// === MODAL CONFIGURACIÓN: foto/nombre por rol + Cerrar sesión ===
(function configModalUsuario() {
  const modal = document.getElementById("modalConfiguracion");
  const btnConfig = document.getElementById("btnConfiguracion");
  if (!modal || !btnConfig) return;

  const perfilBox   = modal.querySelector(".perfil");
  const imgPerfil   = modal.querySelector(".perfil-img");
  const pNombre     = Array.from(modal.querySelectorAll(".perfil p"))
                      .find(p => p.textContent.toLowerCase().includes("nombre de usuario"));

  // Crea botón de cerrar sesión si no existe
  let btnLogout = modal.querySelector("#btnLogout");
  if (!btnLogout) {
    btnLogout = document.createElement("button");
    btnLogout.id = "btnLogout";
    btnLogout.className = "btn-primario"; // usa tu estilo ya definido
    btnLogout.textContent = "Cerrar sesión";
    // lo agregamos al final del bloque de opciones
    const contOpc = modal.querySelector(".config-opciones") || modal.querySelector(".modal-content");
    contOpc?.appendChild(btnLogout);
  }

  // Función que refresca el contenido cada vez que abres la modal
  function actualizarModal() {
    const logueado = localStorage.getItem("logueado") === "true";
    const rol = localStorage.getItem("rol"); // "admin" | "usuario"

    if (!perfilBox || !imgPerfil || !pNombre) return;

    if (!logueado) {
      // No hay sesión: ocultar bloque de perfil y botón salir
      perfilBox.style.display = "none";
      btnLogout.style.display = "none";
      return;
    }

    // Sí hay sesión: mostrar bloque y rellenar datos según rol
    perfilBox.style.display = "block";
    btnLogout.style.display = "inline-block";

    if (rol === "admin") {
      imgPerfil.src = "img/mithras.jpg";             // misma imagen que usas en el header
      imgPerfil.alt = "Admin";
      pNombre.innerHTML = `<strong>Nombre de usuario:</strong> @Admin`;
    } else {
      imgPerfil.src = "img/fotoperfilrobert.jpg";     // misma imagen que usas en el header
      imgPerfil.alt = "Usuario";
      pNombre.innerHTML = `<strong>Nombre de usuario:</strong> @Usuario`;
    }
  }

  // Actualiza justo antes de abrir la modal
  btnConfig.addEventListener("click", actualizarModal);

  // Cerrar sesión
  btnLogout.addEventListener("click", () => {
    // Limpia sesión
    localStorage.removeItem("logueado");
    localStorage.removeItem("rol");

    // Cierra modal visualmente
    const wrapper = document.getElementById("modalConfiguracion");
    if (wrapper) wrapper.style.display = "none";

    // Recarga para que el header y la UI se sincronicen
    window.location.href = "index.html";
  });
})();

//------------------------------------------------------------


// === CAMPANAS DE PARTIDOS ===
document.addEventListener("DOMContentLoaded", () => {
  const campanas = document.querySelectorAll(".btn-campana");
  campanas.forEach((campana, index) => {
    const guardado = localStorage.getItem(`campana_${index}`);
    if (guardado === "activa") campana.classList.add("activa");

    campana.addEventListener("click", () => {
      campana.classList.toggle("activa");
      if (campana.classList.contains("activa")) {
        localStorage.setItem(`campana_${index}`, "activa");
        alert("🔔 Recordatorio activado para este partido");
      } else {
        localStorage.removeItem(`campana_${index}`);
        alert("🔕 Recordatorio desactivado para este partido");
      }
    });
  });
});

// === CAMBIAR FILTRO ACTIVO ===
document.querySelectorAll(".btn-filtro").forEach(boton => {
  boton.addEventListener("click", () => {
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
    boton.classList.add("activo");
  });
});

// === FOOTER ===
fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer-placeholder").innerHTML = data);




//---------------------------------------------------------------------------------------------
// === AGREGAR BOTÓN "NUEVA PUBLICACIÓN" SOLO PARA USUARIO NORMAL ===
document.addEventListener("DOMContentLoaded", () => {
  const logueado = localStorage.getItem("logueado") === "true";
  const rol = localStorage.getItem("rol");
  const nav = document.querySelector(".nav-top ul");

  // Aparecer SOLO si:
  // 1) está logueado
  // 2) el rol es "usuario"
  if (!logueado || rol !== "usuario" || !nav) return;

  // Evitar duplicados
  if (document.querySelector(".btnNuevaPublicacion")) return;

  // Crear el <li>
  const addPostLi = document.createElement("li");
  addPostLi.classList.add("btnNuevaPublicacion");

  // Botón con estilo circular
  addPostLi.innerHTML = `
    <button class="button" id="btnNuevaPublicacion" title="Crear nueva publicación">
      <svg class="svg-icon" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"
        />
      </svg>
    </button>
  `;

  // Insertarlo ANTES de configuración
  const configBtnLi = document.querySelector("#btnConfiguracion")?.closest("li");

  if (configBtnLi) {
    configBtnLi.insertAdjacentElement("beforebegin", addPostLi);
  } else {
    nav.prepend(addPostLi);
  }

  // === NUEVA ACCIÓN: abrir la modal cargada dinámicamente ===
  document.getElementById("btnNuevaPublicacion")
    .addEventListener("click", () => {

      // como el modal está en modal-publicacion-placeholder
      const modal = document.querySelector("#modal-publicacion-placeholder #modalNuevaPublicacion");

      if (modal) {
        modal.style.display = "flex";
      } else {
        console.warn("❗ La modal aún no está cargada.");
      }
    });
});

// ==================================================
// CARGAR MODAL DE NUEVA PUBLICACIÓN
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById("modal-publicacion-placeholder");
    if (!placeholder) return;

    fetch("modal-publicacion.html")
        .then(res => res.text())
        .then(html => {
            placeholder.innerHTML = html;

            // Inicializar la lógica de la modal
            inicializarModalNuevaPublicacion();

            // Avisar que la modal se cargó
            document.dispatchEvent(new Event("modal-publicacion-cargada"));
        });
});

function inicializarModalNuevaPublicacion() {

    const modalNuevaPubli = document.getElementById('modalNuevaPublicacion');
    const cerrarNuevaPubli = modalNuevaPubli?.querySelector('.cerrar-publi-nueva');
    const fileUpload = document.getElementById('file-upload');

    if (cerrarNuevaPubli) {
        cerrarNuevaPubli.addEventListener('click', () => {
            modalNuevaPubli.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modalNuevaPubli) {
            modalNuevaPubli.style.display = 'none';
        }
    });

    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                alert(`Archivo seleccionado: ${e.target.files[0].name}. Listo para subir.`);
            }
        });
    }
}
document.addEventListener("modal-publicacion-cargada", () => {

  const btn = document.getElementById("btnNuevaPublicacion");
  const modal = document.querySelector("#modalNuevaPublicacion");

  if (btn && modal) {
      btn.addEventListener("click", () => {
          modal.style.display = "flex";
      });
  }

});




//--------------------------------------------------------------------------------------------



// === MODO CLARO/OSCURO (PERSISTENTE) ===
document.addEventListener("DOMContentLoaded", () => {
  const modoGuardado = localStorage.getItem("modoColor");
  if (modoGuardado === "claro") document.body.classList.add("light-mode");

  const toggle = document.getElementById("modo-claro");
  if (toggle) {
    toggle.checked = modoGuardado === "claro";
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("modoColor", "claro");
      } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("modoColor", "oscuro");
      }
    });
  }
});

// === LOGIN (ADMIN / USUARIO) ===
/*
const btnSign = document.querySelector(".sign");
if (btnSign) {
  btnSign.addEventListener("click", e => {
    e.preventDefault();

    const nombre = document.getElementById("nombreusuario").value.trim().toLowerCase();
    const pass = document.getElementById("contraseña").value.trim();

    if (nombre === "admin" && pass === "1234") {
      localStorage.setItem("logueado", "true");
      localStorage.setItem("rol", "admin");
      window.location.href = "admin.html";
    } 
    else if (nombre === "usuario" && pass === "abcd") {
      localStorage.setItem("logueado", "true");
      localStorage.setItem("rol", "usuario");
      window.location.href = "perfil.html";
    } 
    else {
      alert("Nombre o contraseña incorrectos. Intenta de nuevo :DDD");
    }
  });
}*/


// === LOGIN (ADMIN / USUARIO) ===
const btnSign = document.querySelector(".sign");
// Solo atrapa el botón de INICIAR SESIÓN, no el de REGISTRO
//const btnSign = document.querySelector(".form.login .sign");


if (btnSign) {
  btnSign.addEventListener("click", (e) => {
    e.preventDefault();

    // Detectar en qué página estamos según el título del formulario
    const titulo = document.querySelector(".title")?.textContent?.toLowerCase();

    // Solo ejecutar login si estamos en la página de "Iniciar sesión"
    if (titulo && titulo.includes("iniciar")) {
      const nombre = document.getElementById("nombreusuario")?.value.trim().toLowerCase();
      const pass = document.getElementById("contraseña")?.value.trim();

      if (nombre === "admin" && pass === "1234") {
        localStorage.setItem("logueado", "true");
        localStorage.setItem("rol", "admin");
        window.location.href = "admin.html";
      } 
      else if (nombre === "usuario" && pass === "abcd") {
        localStorage.setItem("logueado", "true");
        localStorage.setItem("rol", "usuario");
        window.location.href = "perfil.html";
      } 
      else {
        alert("Nombre o contraseña incorrectos. Intenta de nuevo.");
      }
    }
    // Si no estamos en la ventana de inicio de sesión (por ejemplo "Registrarse"),
    // no se ejecuta nada de login.
  });
}





// === MODALES DE ADMIN (GESTIÓN) ===
/*
document.addEventListener("DOMContentLoaded", () => {
  const filasUsuarios = document.querySelectorAll(".admin-usuarios tbody tr");
  const modalUsuario = document.getElementById("modalUsuario");

  if (modalUsuario && filasUsuarios.length > 0) {
    const btnCerrarU = modalUsuario.querySelector(".cerrar");
    const btnAtrasU = modalUsuario.querySelector(".btn-atras");
    const usuarioAvatar = document.getElementById("usuarioAvatar");
    const usuarioNombre = document.getElementById("usuarioNombre");

    filasUsuarios.forEach(fila => {
      fila.addEventListener("click", () => {
        usuarioAvatar.src = fila.querySelector("img").src;
        usuarioNombre.textContent = fila.querySelector("td:nth-child(2)").textContent;
        modalUsuario.style.display = "flex";
      });
    });

    [btnCerrarU, btnAtrasU].forEach(btn => btn?.addEventListener("click", () => modalUsuario.style.display = "none"));
    window.addEventListener("click", e => { if (e.target === modalUsuario) modalUsuario.style.display = "none"; });
  }
});*/


// =========================================================
// MODALES DE GESTIÓN (ADMIN)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- MODAL DE USUARIOS ---------------- */
  const filasUsuarios = document.querySelectorAll(".admin-usuarios tbody tr");
  const modalUsuario = document.getElementById("modalUsuario");

  if (modalUsuario && filasUsuarios.length > 0) {
    const btnCerrarU = modalUsuario.querySelector(".cerrar");
    const btnAtrasU = modalUsuario.querySelector(".btn-atras");
    const usuarioAvatar = document.getElementById("usuarioAvatar");
    const usuarioNombre = document.getElementById("usuarioNombre");

    filasUsuarios.forEach(fila => {
      fila.addEventListener("click", () => {
        const imgSrc = fila.querySelector("img").src;
        const nombreUsuario = fila.querySelector("td:nth-child(2)").textContent;

        usuarioAvatar.src = imgSrc;
        usuarioNombre.textContent = nombreUsuario;
        modalUsuario.style.display = "flex";
      });
    });

    [btnCerrarU, btnAtrasU].forEach(boton => {
      boton.addEventListener("click", () => {
        modalUsuario.style.display = "none";
      });
    });

    window.addEventListener("click", e => {
      if (e.target === modalUsuario) modalUsuario.style.display = "none";
    });
  }

  /* ---------------- MODAL DE PUBLICACIONES ADMIN ---------------- */
  const filasPublicaciones = document.querySelectorAll(".admin-publicaciones tbody tr");
  const modalPublicacion = document.getElementById("modalPublicacion");

  if (modalPublicacion && filasPublicaciones.length > 0) {
    const btnCerrarP = modalPublicacion.querySelector(".cerrar");
    const btnAtrasP = modalPublicacion.querySelector(".btn-atras");
    const pubTitulo = document.getElementById("pubTitulo");
    const pubContenido = document.getElementById("pubContenido");
    const pubAutor = document.getElementById("pubAutor");
    const pubImagen = document.getElementById("pubImagen");

    filasPublicaciones.forEach((fila, index) => {
      const btnVer = fila.querySelector(".btn-secundario");
      if (!btnVer) return;

      btnVer.addEventListener("click", () => {
        const titulo = fila.querySelector("td:nth-child(2)").textContent;
        const autor = fila.querySelector("td:nth-child(3)").textContent;

        pubTitulo.textContent = titulo;
        pubAutor.textContent = autor;
        pubContenido.textContent =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Este texto se reemplazará por el contenido real de la publicación.";
        pubImagen.src = `img/pub${index + 1}.jpg`;

        modalPublicacion.style.display = "flex";
      });
    });

    [btnCerrarP, btnAtrasP].forEach(boton => {
      boton.addEventListener("click", () => {
        modalPublicacion.style.display = "none";
      });
    });

    window.addEventListener("click", e => {
      if (e.target === modalPublicacion) modalPublicacion.style.display = "none";
    });
  }

  /* ---------------- MODAL DE CATEGORÍAS ---------------- */
  const modalCategoria = document.getElementById("modalCategoria");
  const btnAbrirCat = document.querySelector(".btn-agregar");

  if (modalCategoria && btnAbrirCat) {
    const btnCerrarCat = modalCategoria.querySelector(".cerrar");
    const btnAtrasCat = modalCategoria.querySelector(".btn-outline");
    const btnCancelarCat = document.getElementById("btnCancelarCategoria");

    // Abrir modal
    btnAbrirCat.addEventListener("click", () => {
      modalCategoria.style.display = "flex";
    });

    // Cerrar con X, Atrás o Cancelar
    [btnCerrarCat, btnAtrasCat, btnCancelarCat].forEach(boton => {
      boton.addEventListener("click", () => {
        modalCategoria.style.display = "none";
      });
    });

    // Cerrar al hacer clic fuera
    window.addEventListener("click", e => {
      if (e.target === modalCategoria) {
        modalCategoria.style.display = "none";
      }
    });
  }

});



/*
// === CARRUSEL VERTICAL (PERFIL) ===
const vertical = document.querySelector('#carrusel-vertical');
if (vertical) {
  const track = vertical.querySelector('.carousel-track');
  const prevBtn = vertical.querySelector('.carousel-btn.prev');
  const nextBtn = vertical.querySelector('.carousel-btn.next');

  const getCardHeight = () => {
    const card = track.querySelector('.publicacion-card');
    return card ? card.offsetHeight + 24 : 0; 
  };

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ top: -getCardHeight(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ top: getCardHeight(), behavior: 'smooth' });
    });
    track.addEventListener('wheel', e => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      track.scrollBy({ top: getCardHeight() * dir, behavior: 'smooth' });
    });
  }
}*/



// === HEADER DINÁMICO SEGÚN SESIÓN ===
document.addEventListener("DOMContentLoaded", () => {
  const logueado = localStorage.getItem("logueado") === "true";
  const rol = localStorage.getItem("rol");

  const btnLogin = document.querySelector('a[href="/iniciarsesion.html"], a[href="iniciarsesion.html"]');
  const btnRegistro = document.querySelector('a[href="/registrarse.html"], a[href="registrarse.html"]');
  const nav = document.querySelector(".nav-top ul");

  if (!nav) return;

  // Si no hay sesión → mostrar botones
  if (!logueado) {
    if (btnLogin) btnLogin.style.display = "inline-block";
    if (btnRegistro) btnRegistro.style.display = "inline-block";
    return;
  }

  // Si hay sesión → ocultar botones
  if (btnLogin) btnLogin.style.display = "none";
  if (btnRegistro) btnRegistro.style.display = "none";

  // Evita duplicados
  if (document.querySelector(".perfil-header")) return;

  // Crear el ícono de perfil
  const perfilItem = document.createElement("li");
  perfilItem.classList.add("perfil-header");

  perfilItem.innerHTML =
    rol === "admin"
      ? `<a href="admin.html" class="perfil-link">
          <img src="img/mithras.jpg" alt="Admin" class="perfil-header-img" title="Administrador">
        </a>`
      : `<a href="perfil.html" class="perfil-link">
          <img src="img/fotoperfilrobert.jpg" alt="Usuario" class="perfil-header-img" title="Mi Perfil">
        </a>`;

  // Inserta la imagen justo DESPUÉS del botón de notificaciones
  const notificacionLi = document.querySelector("#btnNotificaciones")?.closest("li");
  if (notificacionLi) {
    notificacionLi.insertAdjacentElement("afterend", perfilItem);
  } else {
    nav.appendChild(perfilItem);
  }
});

// ==================================================
// NAVEGACIÓN POR TECLADO ENTRE PÁGINAS
// ==================================================
document.addEventListener("keydown", (event) => {
  // Definimos las rutas de tus páginas
  const paginas = [
    "index.html",      // Tecla 1
    "noticias.html",   // Tecla 2
    "partidos.html",   // Tecla 3
    "envivos.html",    // Tecla 4
    "equipos.html"     // Tecla 5
  ];

  // Dependiendo de la tecla presionada (1 a 5)
  switch (event.key) {
    case "1":
      window.location.href = paginas[0];
      break;
    case "2":
      window.location.href = paginas[1];
      break;
    case "3":
      window.location.href = paginas[2];
      break;
    case "4":
      window.location.href = paginas[3];
      break;
    case "5":
      window.location.href = paginas[4];
      break;
  }
});




// ===========================================
// 1. Lógica del Carrusel Vertical (Scroll y Rueda)
// ===========================================
const vertical = document.querySelector('#carrusel-vertical');

// Solo se ejecuta si el elemento vertical existe (solo en perfil.html)
if (vertical) {
  const track = vertical.querySelector('.carousel-track');
  const prevBtn = vertical.querySelector('.carousel-btn.prev');
  const nextBtn = vertical.querySelector('.carousel-btn.next');

  // Función para obtener la altura de una tarjeta (incluyendo el gap de 1.5rem / 24px)
  const getCardHeight = () => {
    const card = track.querySelector('.publicacion-card');
    // La altura de la tarjeta + el valor del gap (1.5rem ≈ 24px)
    return card ? card.offsetHeight + 24 : 0; 
  };

  if (track && prevBtn && nextBtn) {

    // --- Funcionalidad de Botones (Corregida con scrollBy) ---
    // Desplazamiento hacia arriba (Prev)
    prevBtn.addEventListener('click', () => {
      const scrollDistance = getCardHeight();
      track.scrollBy({ top: -scrollDistance, behavior: 'smooth' });
    });

    // Desplazamiento hacia abajo (Next)
    nextBtn.addEventListener('click', () => {
      const scrollDistance = getCardHeight();
      track.scrollBy({ top: scrollDistance, behavior: 'smooth' });
    });

    // --- Funcionalidad Rueda del Mouse ---
    track.addEventListener('wheel', (e) => {
      e.preventDefault(); // Previene el scroll de la página completa

      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      const scrollDistance = getCardHeight() * scrollDirection;

      // Si la rueda se mueve rápido, usa el valor nativo; si no, una tarjeta
      if (Math.abs(e.deltaY) > 50) {
        track.scrollBy({ top: e.deltaY, behavior: 'smooth' });
      } else {
        track.scrollBy({ top: scrollDistance, behavior: 'smooth' });
      }
    });
  }
} 


// =========================================================
// LÓGICA DEL MODAL DE PUBLICACIÓN de las que ya estan (PERFIL)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('modalPublicacionGrande');
    const cerrar = modal?.querySelector('.cerrar-publi');
    const publicaciones = document.querySelectorAll('.publicacion-card');
    
    // Si el modal y las publicaciones existen en la página...
    if (modal && publicaciones.length > 0) {
        
        // Función para abrir el modal
        publicaciones.forEach(card => {
            card.addEventListener('click', () => {
                modal.style.display = 'flex';
            });
        });
        
        // Función para cerrar el modal al hacer clic en 'X'
        if (cerrar) {
            cerrar.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Función para cerrar el modal al hacer clic fuera de él
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

// =========================================================
// LÓGICA DEL MODAL DE NUEVA PUBLICACIÓN
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const modalNuevaPubli = document.getElementById('modalNuevaPublicacion');
    const btnAbrirPubli = document.querySelector('.btn-publicar');
    const cerrarNuevaPubli = modalNuevaPubli?.querySelector('.cerrar-publi-nueva');
    
    if (modalNuevaPubli && btnAbrirPubli) {
        // Abrir modal al hacer clic en "Añadir Publicación"
        btnAbrirPubli.addEventListener('click', () => {
            modalNuevaPubli.style.display = 'flex';
        });
        
        // Cerrar modal al hacer clic en 'X'
        if (cerrarNuevaPubli) {
            cerrarNuevaPubli.addEventListener('click', () => {
                modalNuevaPubli.style.display = 'none';
            });
        }
        
        // Cerrar modal al hacer clic fuera de él
        window.addEventListener('click', (event) => {
            if (event.target === modalNuevaPubli) {
                modalNuevaPubli.style.display = 'none';
            }
        });
    }

    // Lógica para el input de tipo archivo (simula la apertura)
    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                alert(`Archivo seleccionado: ${e.target.files[0].name}. Listo para subir.`);
            }
        });
    }
});

// ==================================================
// LÓGICA DEL LECTOR DE PANTALLA (Accesibilidad)
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    const toggleLector = document.getElementById("lector-pantalla");
    const body = document.body;

    // Función para aplicar/remover la clase de accesibilidad
    function updateLectorMode(isActive) {
        if (isActive) {
            body.classList.add("accessibility-mode");
            localStorage.setItem("lectorPantalla", "activado");
            // Actualizar estado ARIA
            toggleLector.setAttribute("aria-checked", "true");
        } else {
            body.classList.remove("accessibility-mode");
            localStorage.removeItem("lectorPantalla");
            // Actualizar estado ARIA
            toggleLector.setAttribute("aria-checked", "false");
        }
    }
    
    // Solo si el elemento existe
    if (toggleLector) {
        // 1. Restaurar estado guardado (Persistencia)
        const modoLectorGuardado = localStorage.getItem("lectorPantalla");
        const isLectorActive = modoLectorGuardado === "activado";

        toggleLector.checked = isLectorActive;
        updateLectorMode(isLectorActive);

        // 2. Escuchar cambios
        toggleLector.addEventListener("change", () => {
            updateLectorMode(toggleLector.checked);
        });
    }
});

// Opcional: Lógica de confirmación de archivo
document.addEventListener("DOMContentLoaded", () => {
    const inputFoto = document.getElementById('input-editar-foto');

    if (inputFoto) {
        inputFoto.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                alert(`¡Foto de perfil seleccionada con éxito!\nArchivo: ${fileName}`);
                // Aquí iría la lógica real para subir la foto.
            }
        });
    }
});

// =========================================================
// LÓGICA DEL MODAL DE PUBLICACIÓN GRANDE (INDEX)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('modalPublicacionGrandeIndex');
    const cerrar = modal?.querySelector('.cerrar-publi');
    const publicaciones = document.querySelectorAll('.publicacion-card');
    
    // Si el modal y las publicaciones existen en la página...
    if (modal && publicaciones.length > 0) {
        
        // Función para abrir el modal
        publicaciones.forEach(card => {
            card.addEventListener('click', () => {
                modal.style.display = 'flex';
            });
        });
        
        // Función para cerrar el modal al hacer clic en 'X'
        if (cerrar) {
            cerrar.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Función para cerrar el modal al hacer clic fuera de él
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});