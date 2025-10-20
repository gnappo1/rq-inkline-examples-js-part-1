import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// MSW mock API (so you can run without a backend)
if (import.meta.env.DEV) {
  // Construct the correct path whether base is "/" or "/subpath/"
  const swUrl = new URL(
    `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    window.location.origin
  )

  const { worker } = await import('./mocks/browser')
  await worker.start({
    serviceWorker: { url: swUrl.pathname }, // pathname keeps it same-origin
    onUnhandledRequest: 'bypass',
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,     // fresh for 30s
      gcTime: 5 * 60_000,    // garbage collect after 5m of inactivity
      refetchOnWindowFocus: true,
      retry: (count, err) => {
        const status = err?.status ?? 0
        if (status === 401 || status === 403) return false // auth endpoints shouldn't retry
        return count < 2
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>,
)