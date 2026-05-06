export const BLACKLIST = [
    // Italiano (principali volgarità e termini offensivi)
    "merda", "cazzo", "vaffanculo", "stronzo", "puttana", "troia", "bastardo", "coglion", "fica", "figa", "pompino", "sega", "scopa", "crepa", "porco", "bestia", "zoccola", "finocchio", "frocio", "negro", "ebreo", "nazista", "fascista", "duce", "hitler", "mussolini", "dio", "madonna", "gesu", "cristo", "bestemm",
    
    // Inglese (common profanities)
    "shit", "fuck", "bitch", "asshole", "dick", "pussy", "cunt", "bastard", "nigger", "faggot", "nazi", "hitler", "porn", "sex", "cocaine", "weed", "heroin", "meth", "slut", "whore", "cum", "anal", "rape", "kill"
];

export function isProfane(text: string): boolean {
    const lowercaseText = text.toLowerCase();
    return BLACKLIST.some(word => {
        // Controlla se la parola è contenuta o se ci sono varianti comuni
        const regex = new RegExp(`\\b${word}\\b|${word}`, "i");
        return regex.test(lowercaseText);
    });
}
