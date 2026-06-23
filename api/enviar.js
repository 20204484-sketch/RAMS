import { Resend } from "resend";

export default async function handler(req, res) {

    try {

        console.log("API ejecutada");
        console.log("API KEY existe:", !!process.env.RESEND_API_KEY);
        console.log("EMAIL 1:", process.env.EMAIL_TO_1);
        console.log("EMAIL 2:", process.env.EMAIL_TO_2);

        const resend = new Resend(process.env.RESEND_API_KEY);

        const resultado = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: [process.env.EMAIL_TO_1],
            subject: "Prueba Resend RAMS",
            html: "<h1>Prueba de correo</h1>"
        });

        console.log("Resultado:", resultado);

        return res.status(200).json(resultado);

    } catch (error) {

        console.error("ERROR RESEND:", error);

        return res.status(500).json({
            error: error.message
        });
    }
}
