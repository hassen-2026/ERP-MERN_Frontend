import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";
import { FILTER_FORM_DEFAULTS } from "../defaults/filterForm_default";
import "./FilterForm.css";

function FilterForm(props) {
  const {
    fields,
    sectionClassName,
    gridClassName,
    fieldClassName,
    controlClassName,
    labelClassName,
  } = {
    ...FILTER_FORM_DEFAULTS,
    ...props,
  };

  return (
    <section className={sectionClassName}>
      <div className={gridClassName}>
        {fields.map((field, index) => {
          const key = `${field.id || field.label || "field"}-${index}`;

          if (field.type === "select") {
            return (
              <SelectField
                key={key}
                id={field.id}
                label={field.label}
                value={field.value}
                defaultValue={field.defaultValue ?? field.value}
                options={field.options || []}
                containerClassName={field.containerClassName || fieldClassName}
                selectClassName={field.selectClassName || controlClassName}
                defaultLabelClassName={field.defaultLabelClassName || labelClassName}
                onChange={field.onChange}
              />
            );
          }

          return (
            <InputField
              key={key}
              id={field.id}
              label={field.label}
              placeholder={field.placeholder}
              value={field.value}
              inputType={field.inputType || "text"}
              onChange={field.onChange}
              customClassName={field.customClassName || fieldClassName}
              inputClassName={field.inputClassName || controlClassName}
              labelClassName={field.labelClassName || labelClassName}
            />
          );
        })}
      </div>
    </section>
  );
}

export default FilterForm;
