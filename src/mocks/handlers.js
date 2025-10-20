import { http, HttpResponse } from 'msw'

let isAuthed = true
let feed = Array.from({ length: 25 }).map((_, i) => ({
    id: String(1000 - i),
    attributes: { title: `Note #${1000 - i}`, body: `Demo body for note #${1000 - i}` }
}))

export const handlers = [
    http.get('/me', () =>
        isAuthed
            ? HttpResponse.json({ data: { type: 'users', id: '1', attributes: { email: 'demo@inkline.live' } } })
            : HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    ),

    http.get('/me/summary', () =>
        isAuthed
            ? HttpResponse.json({ notes_count: feed.length, friends_count: 7 })
            : HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    ),

    http.get('/feed/public', ({ request }) => {
        const url = new URL(request.url)
        const before = url.searchParams.get('before')
        const start = before ? feed.findIndex(n => n.id === before) : 0
        const items = feed.slice(Math.max(start, 0), Math.max(start, 0) + 10)
        const next = feed[Math.max(start, 0) + 10]?.id ?? null
        return HttpResponse.json({ data: items, meta: { next_cursor: next } })
    }),
]
