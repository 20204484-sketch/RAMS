console.log("Script cargado");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado");

    const boton = document.getElementById("btnEnviar");

    console.log("Botón:", boton);

    boton.addEventListener("click", async () => {

        console.log("CLICK");

    });

});
const SUPABASE_URL = "https://hrzojutcdphellriqjas.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhyem9qdXRjZHBoZWxscmlxamFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMjk5MDksImV4cCI6MjA5NzgwNTkwOX0.a8jcXNAZwyxret_s6DUjh81Aq9CVZAG2r-plFq4Ub4g";

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

            // =========================
            // GUARDAR PDF LOCALMENTE
            // =========================

            pdf.save("Formulario_RAMS.pdf");

            // =========================
            // SUBIR PDF A SUPABASE
            // =========================

            const pdfBlob = pdf.output("blob");
            const nombreArchivo = `RAMS_${Date.now()}.pdf`;

            const { error: uploadError } = await supabaseClient.storage
                .from("formularios")
                .upload(nombreArchivo, pdfBlob, {
                    contentType: "application/pdf"
                });

            if (uploadError) {
                console.error("ERROR SUPABASE:", uploadError);
                alert("Error al subir PDF a Supabase: " + uploadError.message);
                return;
            }

            

            console.log("PDF URL:", pdfUrl);

          console.log("PDF guardado correctamente.");
console.log("URL:", pdfUrl);

alert("PDF guardado correctamente en Supabase."); 
            } catch (error) {

    console.error(error);
    alert("Error: " + error.message);

}

    });

});

    });

});
