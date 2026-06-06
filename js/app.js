(function () {
    const form = document.getElementById("userForm");
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const saveButton = document.getElementById("saveButton");
    const refreshButton = document.getElementById("refreshButton");
    const tableBody = document.getElementById("usersTableBody");
    const tableLoading = document.getElementById("tableLoading");
    const alertContainer = document.getElementById("alertContainer");

    const endpoints = {
        usuarios: `${API_BASE_URL}/usuarios`
    };

    document.addEventListener("DOMContentLoaded", loadUsers);
    form.addEventListener("submit", handleSubmit);
    refreshButton.addEventListener("click", loadUsers);

    // Consulta el endpoint GET /usuarios y actualiza la tabla.
    async function loadUsers(options = {}) {
        setLoading("table", true);

        if (!options.preserveAlert) {
            clearAlert();
        }

        try {
            validateApiConfig();

            const response = await fetch(endpoints.usuarios, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`GET /usuarios respondio con estado ${response.status}`);
            }

            const data = await readJsonOrEmpty(response);
            renderUsers(normalizeUsers(data));
        } catch (error) {
            console.error(error);
            renderUsers([]);
            showAlert("danger", "Error al cargar datos.");
        } finally {
            setLoading("table", false);
        }
    }

    // Valida el formulario y envia el usuario al endpoint POST /usuarios.
    async function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        setLoading("form", true);
        clearAlert();

        try {
            validateApiConfig();

            const payload = {
                nombre: nombreInput.value.trim(),
                email: emailInput.value.trim()
            };

            const response = await fetch(endpoints.usuarios, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`POST /usuarios respondio con estado ${response.status}`);
            }

            showAlert("success", "Usuario guardado correctamente.");
            form.reset();
            form.classList.remove("was-validated");
            await loadUsers({ preserveAlert: true });
        } catch (error) {
            console.error(error);
            showAlert("danger", "Error al guardar.");
        } finally {
            setLoading("form", false);
        }
    }

    // Acepta las dos respuestas esperadas: arreglo directo o { usuarios: [] }.
    function normalizeUsers(data) {
        if (Array.isArray(data)) {
            return data;
        }

        if (data && Array.isArray(data.usuarios)) {
            return data.usuarios;
        }

        return [];
    }

    function readJsonOrEmpty(response) {
        if (response.status === 204) {
            return Promise.resolve([]);
        }

        return response.text().then((text) => {
            if (!text.trim()) {
                return [];
            }

            return JSON.parse(text);
        });
    }

    // Construye las filas sin usar HTML externo para evitar inyeccion de contenido.
    function renderUsers(users) {
        tableBody.innerHTML = "";

        if (!users.length) {
            tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay usuarios registrados.</td></tr>';
            return;
        }

        const fragment = document.createDocumentFragment();

        users.forEach((user) => {
            const row = document.createElement("tr");
            row.appendChild(createCell(user.id || "Sin ID"));
            row.appendChild(createCell(user.nombre || "Sin nombre"));
            row.appendChild(createCell(user.email || "Sin correo"));
            row.appendChild(createCell(formatDate(user.fechaCreacion)));
            fragment.appendChild(row);
        });

        tableBody.appendChild(fragment);
    }

    function createCell(value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        return cell;
    }

    function formatDate(value) {
        if (!value) {
            return "Sin fecha";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat("es-GT", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    }

    // Controla spinners y bloqueo temporal de botones durante las llamadas fetch.
    function setLoading(scope, isLoading) {
        if (scope === "form") {
            saveButton.disabled = isLoading;
            toggleButtonSpinner(saveButton, isLoading);
        }

        if (scope === "table") {
            refreshButton.disabled = isLoading;
            tableLoading.classList.toggle("d-none", !isLoading);
            toggleButtonSpinner(refreshButton, isLoading);
        }
    }

    function toggleButtonSpinner(button, isLoading) {
        const spinner = button.querySelector(".spinner-border");

        if (spinner) {
            spinner.classList.toggle("d-none", !isLoading);
        }
    }

    function showAlert(type, message) {
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
    }

    function clearAlert() {
        alertContainer.innerHTML = "";
    }

    // Evita llamadas accidentales antes de pegar la URL real de API Gateway.
    function validateApiConfig() {
        if (!API_BASE_URL || API_BASE_URL === "PEGAR_AQUI_URL_DE_API_GATEWAY") {
            throw new Error("Configure API_BASE_URL en js/config.js antes de consumir la API.");
        }
    }
})();
