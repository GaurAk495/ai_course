"use client";
import { createContext, useContext, useState } from "react";

export type PromptType = {
  text: string;
  loading: boolean;
  type: "full-course" | "quick-explain-video";
  setInput: (text: string) => void;
  setLoading: (loading: boolean) => void;
  setType: (type: "full-course" | "quick-explain-video") => void;
};

const PromptContext = createContext<PromptType | null>(null);

export const PromptContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [prompt, setPrompt] = useState("");
  const [loading, changeLoading] = useState(false);
  const [type, changeType] = useState<PromptType["type"]>("full-course");

  const setInput = (text: string) => {
    setPrompt(text);
  };

  const setLoading = (loading: boolean) => {
    changeLoading(loading);
  };

  const setType = (type: PromptType["type"]) => {
    changeType(type);
  };
  return (
    <PromptContext.Provider
      value={{
        text: prompt,
        loading,
        type,
        setInput,
        setLoading,
        setType,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error(
      "usePromptContext must be used within a PromptContextProvider"
    );
  }
  return context;
};
