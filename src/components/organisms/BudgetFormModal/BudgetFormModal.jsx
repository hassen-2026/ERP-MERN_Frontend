import { useEffect } from "react";
import { Form, Modal } from "antd";

import Button from "../../atoms/button/Button";
import InputField from "../../molecules/InputField/InputField";
import SelectField from "../../molecules/SelectField/SelectField";

function BudgetFormModal(props) {
  const { open, budget, loading, onCancel, onSubmit, categories } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      name: budget?.name || "",
      category: budget?.category || undefined,
      month: budget?.month || new Date().getMonth() + 1,
      year: budget?.year || new Date().getFullYear(),
      totalBudget: budget?.totalBudget || 0,
      warningThreshold: budget?.warningThreshold ?? 80,
      description: budget?.description || "",
      notes: budget?.notes || "",
    });
  }, [budget, form, open]);

  const handleFinish = (values) => {
    onSubmit(values, budget);
  };

  return (
    <Modal
      title={budget ? "Modifier le budget" : "Créer un nouveau budget"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={680}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" rules={[{ required: true, message: "Le nom est requis" }]}>
          <InputField id="budget-name" label="Nom" placeholder="Ex: Budget Achats Janvier 2026" />
        </Form.Item>

        <Form.Item name="category" rules={[{ required: true, message: "La catégorie est requise" }]}>
          <SelectField id="budget-category" label="Catégorie" options={categories} placeholder="Sélectionner une catégorie" />
        </Form.Item>

        <Form.Item name="description">
          <InputField id="budget-description" label="Description" placeholder="Description optionnelle" />
        </Form.Item>

        <div className="p-budget-page__form-grid">
          <Form.Item name="month" rules={[{ required: true, message: "Le mois est requis" }]}>
            <InputField id="budget-month" label="Mois" inputType="number" inputProps={{ min: 1, max: 12 }} />
          </Form.Item>

          <Form.Item name="year" rules={[{ required: true, message: "L'année est requise" }]}>
            <InputField id="budget-year" label="Année" inputType="number" inputProps={{ min: 2020, max: 2100 }} />
          </Form.Item>
        </div>

        <Form.Item name="totalBudget" rules={[{ required: true, message: "Le montant est requis" }]}>
          <InputField id="budget-total" label="Montant Budget (DT)" inputType="number" inputProps={{ min: 0, step: 1000 }} />
        </Form.Item>

        <Form.Item name="warningThreshold">
          <InputField id="budget-warning" label="Seuil d'alerte (%)" inputType="number" inputProps={{ min: 0, max: 100 }} />
        </Form.Item>

        <Form.Item name="notes">
          <InputField id="budget-notes" label="Notes" placeholder="Notes internes" />
        </Form.Item>

        <div className="p-budget-page__modal-actions">
          <Button variant="secondary" customClassName="p-budget-page__modal-btn" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="primary" customClassName="p-budget-page__modal-btn" htmlType="submit" disabled={loading}>
            {budget ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default BudgetFormModal;