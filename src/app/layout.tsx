export const metadata = {
  title: 'Ramadhan Tracker - Tracking Ibadah Keluarga',
  description: 'Aplikasi sederhana untuk mencatat capaian ibadah keluarga selama bulan Ramadhan dengan sistem poin dan leaderboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id"> {/* Mempertahankan 'id' untuk bahasa Indonesia */}
      <body>
        {children}
      </body>
    </html>
  );
}
