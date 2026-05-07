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
        const results = [];
        
        // Resend batch limit is 100 emails per call.
        // We split the input array into chunks of 100.
        for (let i = 0; i < emails.length; i += 100) {
            const chunk = emails.slice(i, i + 100);
            
            // If it's not the first chunk, add a small delay to avoid hitting rate limits (e.g. 200ms)
            if (i > 0) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            const { data, error } = await client.batch.send(
                chunk.map(email => ({
                    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                    to: [email.to],
                    subject: email.subject,
                    html: email.body,
                }))
            );

            if (error) {
                console.error(`EMAIL_BATCH_ERROR_CHUNK_${i/100}`, error);
                // We continue with other chunks even if one fails
            } else {
                results.push(data);
            }
        }

        return { success: true, results };
    } catch (error) {
        console.error("EMAIL_BATCH_CRITICAL_ERROR", error);
        return { success: false, error };
    }
}

