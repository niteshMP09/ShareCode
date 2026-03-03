import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface NavbarContextType {
  snippetContent: string | null;
  setSnippetContent: (content: string | null) => void;
}

const NavbarContext = createContext<NavbarContextType>({
  snippetContent: null,
  setSnippetContent: () => {},
});

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [snippetContent, setSnippetContent] = useState<string | null>(null);

  return (
    <NavbarContext.Provider value={{ snippetContent, setSnippetContent }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
