"use client";

import Footer from "@/components/Main/Footer";
import Navbar from "@/components/Main/Navbar";
import HomePage from "@/components/Main/HomePage";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
