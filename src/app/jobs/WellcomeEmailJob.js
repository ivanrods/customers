import Mail from "../lib/Mail";

class WellcomeEmailJob {
    get key() {
        return "WellcomeEmail";
    }
    async handle({ data }) {
        const { email, name } = data;
        Mail.send({
            to: email,
            subject: "Bem-vindo!",
            text: `Olá ${name}, seu cadastro foi realizado com sucesso.`,
        });
    }
}

export default new WellcomeEmailJob();
