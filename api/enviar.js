export default async function handler(req, res) {

    console.log("Método:", req.method);
    console.log("Body:", req.body);

    return res.status(200).json({
        mensaje: "Backend funcionando"
    });

}
