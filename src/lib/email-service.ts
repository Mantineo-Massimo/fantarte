import { prisma } from "./prisma";
import { sendEmail } from "./email";

type EmailType = "WELCOME" | "TEAM_CREATION" | "POINTS_ASSIGNED";

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

export async function triggerEmail(type: EmailType, to: string, variables: Record<string, string>) {
    try {
        const setting = await getEmailSetting(type);
        if (!setting || !setting.enabled) return;

        const subject = formatTemplate(setting.subject, variables);
        const body = formatTemplate(setting.content, variables);

        await sendEmail({ to, subject, body });
    } catch (error) {
        console.error(`FAILED_TO_TRIGGER_EMAIL_${type}`, error);
    }
}
