import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient() {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

export async function sendEmail({ to, subject, body, text }: { to: string; subject: string; body: string; text?: string }) {
    try {
        const client = getResendClient();
        const { data, error } = await client.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: [to],
            subject: subject,
            html: body,
            text: text || body.replace(/<[^>]*>?/gm, ""),
        });

        if (error) {
            console.error("EMAIL_SEND_ERROR", error);
            return { success: false, error };
        }

        return { success: true, result: data };
    } catch (error) {
        console.error("EMAIL_SEND_ERROR", error);
        return { success: false, error };
    }
}

export async function sendBatch(emails: { to: string; subject: string; body: string }[]) {
    try {
        const client = getResendClient();
        // Resend batch limit is 100 emails per call
        const { data, error } = await client.batch.send(
            emails.map(email => ({
                from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                to: [email.to],
                subject: email.subject,
                html: email.body,
            }))
        );

        if (error) {
            console.error("EMAIL_BATCH_ERROR", error);
            return { success: false, error };
        }

        return { success: true, result: data };
    } catch (error) {
        console.error("EMAIL_BATCH_ERROR", error);
        return { success: false, error };
    }
}

