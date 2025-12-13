import React from "react";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

/**
 * FormField - A unified component that renders the appropriate input type
 * based on the field configuration
 */
const FormField = ({ field, value, onChange, error }) => {
  const commonProps = {
    name: field.name,
    value: value,
    onChange: onChange,
    error: error,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    disabled: field.disabled,
  };

  switch (field.type) {
    case "select":
      return <Select {...commonProps} options={field.options} />;
    case "textarea":
      return (
        <Textarea
          {...commonProps}
          rows={field.rows}
          maxLength={field.maxLength}
        />
      );
    case "text":
    case "email":
    case "password":
    case "number":
    case "date":
    case "time":
    case "tel":
    default:
      return <Input {...commonProps} type={field.type || "text"} />;
  }
};

export default FormField;
