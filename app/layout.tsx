import "./globals.css";
import Navbar  from "./components/navBar";

export const metadata={
  title: 'Process Deviation',
  icons:{
    icon:['/favicon.ico']
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>        
      <Navbar/>
        {children}
      </body>
    </html>
  );
}
