import { IconButtonProps, styled } from "@mui/material";
import { Button, Dialog } from "@mui/material";
import { useState } from "react";
import SignInForm from "./SignInForm";

const Authorization = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <Button
          sx={{ position: "absolute", zIndex: 3000, right: 10, top: 10 }}
          color="secondary"
          variant="contained"
          onClick={() => setIsOpen(true)}
        >
          Войти
        </Button>
      )}

      <Dialog onClose={() => setIsOpen(false)} open={isOpen}>
        <SignInForm />
      </Dialog>
    </>
  );
};

export default Authorization;
