import "../styles/globals.css";

export const metadata = {
  title: "Noida Hub ? Calling Agents",
  description: "Automatic calling agents for Noida Hub real estate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Noida Hub ? Calling Agents</h1>
            <a
              href="/"
              className="text-sm text-blue-600 hover:underline"
            >
              Dashboard
            </a>
          </header>
          {children}
          <footer className="mt-12 text-xs text-gray-500">
            ? {new Date().getFullYear()} Noida Hub
          </footer>
        </div>
      </body>
    </html>
  );
}
