export const keys = {
    me: () => ['me'],
    summary: () => ['me', 'summary'],
    feed: (p) => ['feed', p || {}],              // { before?: string }
    note: (id) => ['note', String(id)],
    friends: (p) => ['friendships', p || {}],       // { status?: 'accepted' | ... }
};