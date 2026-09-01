import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export const metadata = {
  title: "Lista de Tarefas",
  description: "Um to-do list simples, feito com Next.js e Postgres.",
};

const temaRosa = {
  light: {
    background: "#F9DCE7",
    foreground: "#1A1013",
    card: "#FFF2F7",
    cardForeground: "#1A1013",
    primary: "#E5487D",
    primaryForeground: "#FFF2F7",
    secondary: "#F3C4D7",
    secondaryForeground: "#1A1013",
    muted: "#F3C4D7",
    mutedForeground: "#8C6272",
    border: "#1A1013",
    input: "#1A1013",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="font-body min-h-screen">
        <StackProvider app={stackServerApp}>
          <StackTheme theme={temaRosa}>{children}</StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
