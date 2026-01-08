import { ThemeProvider } from "./theme/theme-provider";

function Context({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}

export default Context;
