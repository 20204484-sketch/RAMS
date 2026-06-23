import { Resend } from "resend";

const resend =
    new Resend(
        process.env.RESEND_API_KEY
    );

export default async function handler(
    req,
    res
) {

    try {

        const {
            pdfUrl
        } = req.body || {};

        const respuesta =
            await resend.emails.send({

                from:
                    "onboarding@resend.dev",

                to: [
                    process.env.EMAIL_TO_1,
                    process.env.EMAIL_TO_2,
                    process.env.EMAIL_TO_3
                ],

                subject:
                    "Nuevo formulario RAMS",

                html: `
                    <h2>
                        Nuevo formulario RAMS
                    </h2>

                    <p>
                        Descargar PDF:
                    </p>

                    <a href="${pdfUrl}">
                        Abrir formulario
                    </a>
                `
            });

        return res
            .status(200)
            .json(respuesta);

    } catch (error) {

        console.error(error);

        return res
            .status(500)
            .json({
                error:
                    error.message
            });
    }
}
