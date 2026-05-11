import { prisma } from "./prisma";
import { sendEmail } from "./email";

type EmailType = "VERIFICATION" | "WELCOME" | "TEAM_CREATION" | "POINTS_ASSIGNED";

export async function getEmailSetting(type: EmailType) {
    return await prisma.emailSetting.findUnique({
        where: { type }
    });
}

export function formatTemplate(template: string, variables: Record<string, string>) {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, "g");
        result = result.replace(regex, value);
    });
    return result;
}

function wrapHtml(content: string) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0f1c; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #131d36; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .header { background-color: #0a0f1c; padding: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .content { padding: 40px; line-height: 1.8; font-size: 16px; color: #cbd5e1; }
        .footer { background-color: #0a0f1c; padding: 30px; text-align: center; font-size: 11px; color: #475569; letter-spacing: 0.1em; text-transform: uppercase; }
        .gold { color: #FFD700; font-weight: bold; }
        .button { display: inline-block; padding: 14px 28px; background-color: #FFD700; color: #0a0f1c !important; text-decoration: none !important; border-radius: 14px; font-weight: 900; margin-top: 25px; text-transform: uppercase; letter-spacing: 0.05em; }
        p { margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.fantarte.it/fanta-logo.webp" alt="FantArte" width="180" style="display: block; margin: 0 auto;" />
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; 2026 FantArte &bull; Piazza dell'Arte Messina<br/>
            Un progetto di Morgana & O.R.U.M.
        </div>
    </div>
</body>
</html>
    `;
}

export async function triggerEmail(type: EmailType, to: string, variables: Record<string, string>) {
    try {
        const setting = await getEmailSetting(type);
        
        // Check if the email type is enabled in the Admin Panel
        if (!setting || !setting.enabled) {
            console.log(`EMAIL_TRIGGER_SKIPPED: ${type} is disabled or missing.`);
            return;
        }

        const subject = formatTemplate(setting.subject, variables);
        const rawContent = formatTemplate(setting.content, variables);
        
        // Wrap the content in the professional HTML template
        const body = wrapHtml(rawContent);

        await sendEmail({ to, subject, body });
    } catch (error) {
        console.error(`FAILED_TO_TRIGGER_EMAIL_${type}`, error);
    }
}
