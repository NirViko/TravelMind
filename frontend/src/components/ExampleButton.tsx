import React from "react";
import { Button, ButtonProps } from "react-native-paper";

interface ExampleButtonProps extends ButtonProps {
  // Add custom props here if needed
}

export const ExampleButton: React.FC<ExampleButtonProps> = (props) => {
  return <Button {...props} />;
};
