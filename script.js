const SUPABASE_URL = "https://hrzojutcdphellriqjas.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_M_LqnyjOBZzPRxfsJ_5khg_wpUu1DZN";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
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

const pdfBlob = pdf.output("blob");

const nombreArchivo =
    `RAMS_${Date.now()}.pdf`;

const { error: uploadError } =
    await supabaseClient.storage
        .from("formularios")
        .upload(
            nombreArchivo,
            pdfBlob,
            {
                contentType:
                    "application/pdf"
            }
        );

if (uploadError) {

    console.error(uploadError);

    alert(
        "Error Supabase: " +
        uploadError.message
    );

    return;
}

const {
    data: publicUrlData
} =
    supabaseClient.storage
        .from("formularios")
        .getPublicUrl(
            nombreArchivo
        );

const pdfUrl =
    publicUrlData.publicUrl;

console.log(
    "URL PDF:",
    pdfUrl
);

            console.log("PDF generado:", !!pdfBlob);

console.log(
    "Tamaño PDF (KB):",
    Math.round(pdfBlob.size / 1024)
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

            alert(
    "Formulario enviado correctamente y almacenado en Supabase."
);

console.log("PDF URL:", pdfUrl);
            if (respuesta.ok) {
                alert("Formulario enviado correctamente");
            } 

        } catch (error) {

            console.error(error);
            alert("Error de conexión");

        }

    });

});
