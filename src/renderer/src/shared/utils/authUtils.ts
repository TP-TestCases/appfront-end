export const getUserId = (): number | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
        return JSON.parse(user).id;
    } catch {
        return null;
    }
};

export const getUser = (): { id: number; name: string } | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
};

export const isUserAuthenticated = (): boolean => {
    return getUserId() !== null;
};
