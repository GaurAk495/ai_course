import { User } from "@/prisma_client/client";
import { createContext, useContext } from "react";

type ContextType = {
    user: User | null;
    isPending: boolean;
};

export const UserContext = createContext<ContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
