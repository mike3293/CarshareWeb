import { Box, CircularProgress } from "@mui/material";
import { useField } from "formik";
import { TextField, TextFieldProps } from "@mui/material";

interface FormTextFieldProps extends Omit<TextFieldProps, "value" | "error"> {
  name: string;
}

const FormTextField = ({ name, ...restProps }: FormTextFieldProps) => {
  const [field, meta] = useField(name);
  const error = meta.touched && meta.error;

  return (
    <TextField
      {...restProps}
      {...field}
      error={!!error}
      helperText={error ?? " "}
    />
  );
};

export default FormTextField;
