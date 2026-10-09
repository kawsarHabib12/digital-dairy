import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-diary-cream flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-diary-border bg-white/60 py-6 text-center text-sm font-medium text-diary-muted">
        MemoAI — Academic Full-Stack Software Engineering Digital Diary
      </footer>
    </div>
  );
}
