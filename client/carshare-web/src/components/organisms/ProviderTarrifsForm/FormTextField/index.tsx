import { Box, CircularProgress } from "@mui/material";
import { useField } from "formik";
import { TextField, TextFieldProps } from "@mui/material";

interface FormTextFieldProps extends Omit<TextFieldProps, "value" | "error"> {
  name: string;
}

function FormTextField<T = number>({ name, ...restProps }: FormTextFieldProps) {
  const [field, meta] = useField<T>(name);
  const error = meta.touched && meta.error;

  return (
    <TextField
      {...restProps}
      {...field}
      value={field.value ?? ""}
      error={!!error}
      helperText={error || " "}
    />
  );
}

export default FormTextField;
