const API = import.meta.env.VITE_API_URL || '';

export class HttpError extends Error {
    constructor(message, status, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export async function request(path, opts = {}) {
    const res = await fetch((API + path), {
        credentials: 'include', // important for cookie sessions
        headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
        ...opts,
    });

    if (!res.ok) {
        let payload = null;
        try { payload = await res.json(); } catch { }
        const msg = payload?.error || res.statusText || 'Request failed';
        throw new HttpError(msg, res.status, payload);
    }
    return res.status === 204 ? null : res.json();
}