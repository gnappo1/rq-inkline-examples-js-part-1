import { useQuery } from '@tanstack/react-query';
import { request } from '../../api/client';
import { keys } from '../../api/keys';

const useMe = () => useQuery({
    queryKey: keys.me(),
    queryFn: () => request('/me'),
    select: (json) => json?.data?.attributes || null,
    retry: 0, // auth shouldn't retry
});

const Summary = () => {
    const me = useMe();
    const enabled = Boolean(me.data);

    const summary = useQuery({
        queryKey: keys.summary(),
        queryFn: () => request('/me/summary'),
        enabled,   // ← gate the query
        retry: 0,
    });

    if (me.isLoading) return <p>Loading…</p>;
    if (!me.data) return <p>Log in to see your summary.</p>;

    return (
        <div className="card">
            {summary.isLoading ? (
                <p>Loading summary…</p>
            ) : (
                <p>
                    Notes: <strong>{summary.data?.notes_count ?? '—'}</strong> ·
                    Friends: <strong>{summary.data?.friends_count ?? '—'}</strong>
                </p>
            )}
        </div>
    );
};

export default Summary;