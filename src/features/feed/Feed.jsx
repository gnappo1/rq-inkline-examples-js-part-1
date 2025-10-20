import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { request } from '../../api/client';
import { keys } from '../../api/keys';

const Feed = () => {
    const [cursor, setCursor] = useState(null);
    const [list, setList] = useState([]);
    const lastAppliedCursorRef = useRef(null); // avoid dupes/races

    const { data, isSuccess, isLoading, isFetching } = useQuery({
        queryKey: keys.feed({ before: cursor }), // e.g. ['feed', { before: null|cursor }]
        queryFn: () =>
            request(`/feed/public${cursor ? `?before=${encodeURIComponent(cursor)}` : ''}`),
        keepPreviousData: true,
        staleTime: 10_000,
        refetchOnWindowFocus: false,
    });

    const pageItems = data?.data ?? [];
    const nextCursor = data?.meta?.next_cursor ?? null;

    useEffect(() => {
        if (!isSuccess) return;

        // Apply each cursor exactly once to avoid duplicates from refetch/retry.
        if (lastAppliedCursorRef.current === cursor && cursor !== null) return;
        lastAppliedCursorRef.current = cursor;

        setList(prev =>
            cursor === null ? pageItems : prev.concat(pageItems)
        );
    }, [isSuccess, cursor, pageItems]);

    if (isLoading && list.length === 0) {
        return <div className="card">Loading…</div>;
    }

    return (
        <section className="feed">
            <div className="feed-list">
                {list.map(n => (
                    <article key={n.id} className="note">
                        <h3>{n.attributes.title}</h3>
                        <p>{n.attributes.body.slice(0, 100)}…</p>
                    </article>
                ))}
            </div>

            <div className="row">
                <button
                    className="btn"
                    disabled={!nextCursor || isFetching}
                    onClick={() => setCursor(nextCursor)}
                >
                    {isFetching ? 'Loading…' : nextCursor ? 'Load more' : 'No more'}
                </button>
            </div>
        </section>
    );
};

export default Feed;