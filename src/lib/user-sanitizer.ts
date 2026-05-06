export function sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
}

export function sanitizeUsers(users: any[]) {
    return users.map(sanitizeUser);
}
