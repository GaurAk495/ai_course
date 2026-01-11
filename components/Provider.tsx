import { ClerkThemeProvider } from "./ClerkProvider";
import { PromptContextProvider } from "./context/promptContext";
import { ThemeProvider } from "./theme/theme-provider";
import { Toaster } from "./ui/sonner";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <ClerkThemeProvider>
        <PromptContextProvider>{children}</PromptContextProvider>
      </ClerkThemeProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default Provider;
