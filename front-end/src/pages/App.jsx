import React, { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import ToggleButton from "@/components/theme/ToggleButton";

const App = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${theme} min-h-screen flex flex-col items-center justify-center gap-4`}
    >
      <div className="fixed top-4 right-4">
        <ToggleButton />
      </div>
      <h1 className="text-3xl font-bold text-green-500 font-['Poppins']">
        Tes
      </h1>
      <Button>Button</Button>
    </div>
  );
};

export default App;
