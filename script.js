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
    scale: 1,
    useCORS: true
});

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p", "mm", "a4");

const imgWidth = 210;
const pageHeight = 297;

const imgHeight = (canvas.height * imgWidth) / canvas.width;

let heightLeft = imgHeight;
let position = 0;

pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
);

heightLeft -= pageHeight;

while (heightLeft > 0) {

    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
    );

    heightLeft -= pageHeight;
}

pdf.save("Formulario_RAMS.pdf");
            const pdfBase64 = pdf.output("datauristring").split(",")[1];
            console.log("PDF generado:", !!pdfBase64);
console.log("Longitud:", pdfBase64.length);

console.log(
    "Tamaño PDF (KB):",
    Math.round(pdfBase64.length / 1024)
);
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
    contenido,
                       pdfBase64
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
