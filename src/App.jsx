import Summary from './features/me/Summary';
import Feed from './features/feed/Feed';

const App = () => (
  <main className="container">
    <h1>React Query - Inkline-style JS Examples</h1>

    <section className='summary'>
      <h2>Dependent query ( /me → /me/summary )</h2>
      <Summary />
    </section>

    <section className='feed'>
      <h2>Keyset pagination ( /feed/public )</h2>
      <Feed />
    </section>
  </main>
);

export default App;
