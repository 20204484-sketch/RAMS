import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

    // Permitir POST solamente
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método no permitido"
        });
    }

    try {

        console.log("BODY RECIBIDO:", req.body);

        const { pdfUrl } = req.body || {};

        if (!pdfUrl) {
            return res.status(400).json({
                error: "No se recibió pdfUrl"
            });
        }

        const respuesta = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "20204484@aloe.ulima.edu.pe",
            subject: "Nuevo formulario RAMS",
            html: `
                <h2>Nuevo formulario RAMS</h2>
                <p>Se ha recibido un nuevo formulario.</p>
                <p>
                    <a href="${pdfUrl}" target="_blank">
                        Abrir formulario PDF
                    </a>
                </p>
            `
        });

        console.log("RESPUESTA RESEND:", respuesta);

        return res.status(200).json({
            ok: true,
            respuesta
        });

    } catch (error) {

        console.error("ERROR EN /api/enviar:", error);

        return res.status(500).json({
            error: error.message || "Error interno"
        });
    }
}
