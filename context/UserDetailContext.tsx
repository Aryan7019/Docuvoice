"use client"; 

import { createContext } from "react"; // Fixed import
import { UsersDetail } from "@/app/Provider"; 

export const UserDetailContext = createContext<any>(undefined);