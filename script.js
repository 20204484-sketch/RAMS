const SUPABASE_URL = "https://hrzojutcdphellriqjas.supabase.co";
const SUPABASE_ANON_KEY = "AQUI_TU_SUPABASE_ANON_KEY";

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

            const { data: publicUrlData } = supabaseClient.storage
                .from("formularios")
                .getPublicUrl(nombreArchivo);

            const pdfUrl = publicUrlData.publicUrl;

            console.log("PDF URL:", pdfUrl);

            // =========================
            // ENVIAR URL DEL PDF A VERCEL
            // =========================

            const respuesta = await fetch(
                "https://rams-nine-smoky.vercel.app/api/enviar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        pdfUrl
                    })
                }
            );

            const data = await respuesta.json();
            console.log("RESPUESTA API:", data);

            if (respuesta.ok) {
                alert("Formulario enviado correctamente");
            } else {
                alert("Error al enviar correo: " + (data.error || "desconocido"));
            }

        } catch (error) {
            console.error("ERROR GENERAL:", error);
            alert("Error: " + (error.message || "desconocido"));
        }

    });

});
