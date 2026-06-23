import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

    try {

        const { pdfBase64 } = req.body;

        console.log(
  "PDF tamaño KB:",
  Math.round(pdfBase64.length / 1024)
);

        const respuesta = await resend.emails.send({

            from: "onboarding@resend.dev",

            to: [
                process.env.EMAIL_TO_1,
                process.env.EMAIL_TO_2
            ],

            subject: "Formulario RAMS",

            html: "<h2>Se adjunta el formulario RAMS en PDF</h2>",

            attachments: [
                {
                    filename: "Formulario_RAMS.pdf",
                    content: pdfBase64
                }
            ]
        });

        return res.status(200).json(respuesta);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
}
