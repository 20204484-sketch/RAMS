document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("btnEnviar");

    boton.addEventListener("click", async () => {

        try {

            const nombre = document.getElementById("nombre")?.value || "";
            const edad = document.getElementById("edad")?.value || "";

            const contenido = `
FORMULARIO RAMS

Nombre: ${nombre}
Edad: ${edad}
`;

            const respuesta = await fetch(
    "https://rams-nine-smoky.vercel.app/api/enviar",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contenido
        })
    }
);

            if (respuesta.ok) {
                alert("Formulario enviado correctamente");
            } else {
                alert("Error al enviar");
            }

        } catch (error) {

            console.error(error);
            alert("Error de conexión");

        }

    });

});
