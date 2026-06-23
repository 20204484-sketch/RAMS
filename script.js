document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("btnEnviar");

    boton.addEventListener("click", async () => {

        try {

            // =========================
            // GENERAR PDF
            // =========================

            const { jsPDF } = window.jspdf;

            const elemento = document.getElementById("paginaCompleta");

            const canvas = await html2canvas(elemento, {
                scale: 2
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = 210;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            pdf.save("Formulario_RAMS.pdf");

            // =========================
            // ENVIAR DATOS
            // =========================

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
