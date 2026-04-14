import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Olá, Next.js! 🚀</h1>
        <p>Esta é a minha primeira página renderizada no servidor.</p>
      </main>
    </>
  );
}