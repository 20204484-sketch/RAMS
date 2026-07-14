const SUPABASE_URL = "https://hrzojutcdphellriqjas.supabase.co/rest/v1/";

const SUPABASE_ANON_KEY =
"sb_publishable_M_LqnyjOBZzPRxfsJ_5khg_wpUu1DZN";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

document.addEventListener("DOMContentLoaded", () => {

    console.log("Página cargada");

    const boton = document.getElementById("btnEnviar");

    boton.addEventListener("click", async () => {

        try {

            // ====================================
            // GENERAR PDF
            // ====================================

            const { jsPDF } = window.jspdf;

            const elemento =
                document.getElementById("paginaCompleta");

            const canvas = await html2canvas(
                elemento,
                {
                    scale: 1,
                    useCORS: true
                }
            );

            const imgData =
                canvas.toDataURL("image/png");

            const pdf =
                new jsPDF("p", "mm", "a4");

            const imgWidth = 210;
            const pageHeight = 297;

            const imgHeight =
                (canvas.height * imgWidth) /
                canvas.width;

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

            // ====================================
            // GUARDAR PDF EN LA PC
            // ====================================

            pdf.save("Formulario_RAMS.pdf");

            // ====================================
            // SUBIR A SUPABASE
            // ====================================

            const pdfBlob =
                pdf.output("blob");

            const nombreArchivo =
                `RAMS_${Date.now()}.pdf`;

            const {
                error: uploadError
            } =
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
                    "Error al subir el PDF a Supabase:\n\n" +
                    uploadError.message
                );

                return;

            }

            // ====================================
            // OBTENER URL PÚBLICA
            // ====================================

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

            console.log("PDF URL:", pdfUrl);

            // ====================================
            // ÉXITO
            // ====================================

            alert("Envío exitoso.");

        }

        catch (error) {

            console.error(
                "ERROR GENERAL:",
                error
            );

            alert(
                "Ocurrió un error al enviar el formulario.\n\n" +
                error.message
            );

        }

    });

});
