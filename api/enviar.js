import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método no permitido"
        });
    }

    try {

        const { contenido } = req.body;

        const resultado = await resend.emails.send({

            from: "onboarding@resend.dev",

            to: [
                process.env.EMAIL_TO_1,
                process.env.EMAIL_TO_2
            ],

            subject: "Nuevo formulario RAMS",

            html: `
                <h2>Nuevo formulario recibido</h2>
                <pre>${contenido}</pre>
            `
        });

        return res.status(200).json(resultado);

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
}
