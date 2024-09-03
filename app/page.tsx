import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <nav>
        <div className="container flex justify-between items-center">
          <a href="/">Home</a>
          <a href="/Profile">Profile</a>
          <a href="/settings">Settings</a>
        </div>
      </nav>
      <main className="container">
        <h1 className="text-3xl font-bold">Welcome to SkillSync</h1>
      </main>
    </div>
  );
}
