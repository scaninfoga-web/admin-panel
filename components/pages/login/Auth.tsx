"use client"

import type React from "react";
import { useState } from "react";
import Login from "./Login";
import ChangePassword from "./ChangePassword";


const Auth: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<"login" | "forget">("login");

    if(selectedOption === "login")
        return (
            <Login setSelectedOption={setSelectedOption} />
        )
    
    if(selectedOption === "forget")
        return (
    <ChangePassword />
    )
}

export default Auth