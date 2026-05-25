import React from "react";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import "./DocumentMetaForm.css";

function DocumentMetaForm({ metaFields = [], values = {}, onChange = () => {} }) {
  return (
    <div className="p-document-meta">
      <div className="p-document-meta__grid">
        {metaFields.map((field) => {
          const className = field.fullWidth ? "p-document-meta__field p-document-meta__field--full" : "p-document-meta__field";

          if (field.type === "select") {
            return (
              <SelectField
                key={field.key}
                id={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={values[field.key]}
                options={field.options || []}
                onChange={(v) => onChange(field.key, v)}
                containerClassName={className}
                defaultLabelClassName="p-field__label"
                selectClassName="p-document-meta__control"
              />
            );
          }

          return (
            <InputField
              key={field.key}
              id={field.key}
              label={field.label}
              placeholder={field.placeholder}
              inputType={field.inputType || "text"}
              value={values[field.key]}
              onChange={(v) => onChange(field.key, v?.target?.value ?? v)}
              customClassName={className}
              labelClassName="p-field__label"
              inputClassName="p-document-meta__control"
              readOnly={field.readOnly}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DocumentMetaForm;
