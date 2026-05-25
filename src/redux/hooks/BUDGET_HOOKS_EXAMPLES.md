// ============ EXEMPLES D'UTILISATION DES HOOKS REDUX POUR BUDGETS ============

/**
 * Exemple 1: Récupérer tous les budgets (Admin)
 */
import { useAllBudgets } from "../../redux/hooks/useBudget";

function AdminBudgetListExample() {
  const { budgets, loading, error, fetchBudgets, clearError } = useAllBudgets();

  React.useEffect(() => {
    fetchBudgets(); // Charge depuis Redux (cache)
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div>
      {budgets.map((budget) => (
        <BudgetCard key={budget._id} budget={budget} />
      ))}
    </div>
  );
}

/**
 * Exemple 2: Récupérer les budgets de l'utilisateur
 */
import { useMyBudgets } from "../../redux/hooks/useBudget";

function UserBudgetListExample() {
  const { budgets, loading, error, fetchBudgets, clearError } = useMyBudgets();

  React.useEffect(() => {
    fetchBudgets({ category: "PROCUREMENT" }); // Charge et filtre par catégorie
  }, []);

  return (
    <List
      loading={loading}
      dataSource={budgets}
      renderItem={(budget) => <BudgetItem budget={budget} />}
    />
  );
}

/**
 * Exemple 3: Récupérer le budget d'achats du mois courant
 */
import { useProcurementBudget } from "../../redux/hooks/useBudget";

function ProcurementBudgetWidgetExample() {
  const { budget, fetchBudgets } = useProcurementBudget();

  React.useEffect(() => {
    if (!budget) {
      fetchBudgets(); // Charge si pas encore en cache
    }
  }, []);

  if (!budget) return <Empty description="Aucun budget d'achats" />;

  return (
    <Card>
      <Statistic title="Budget Alloué" value={budget.totalBudget} />
      <Progress percent={budget.percentageUsed} />
      {budget.isExceeded && <Alert type="error" message="Budget dépassé!" />}
    </Card>
  );
}

/**
 * Exemple 4: Créer un budget avec Redux
 */
import { useBudgetOperations } from "../../redux/hooks/useBudget";

function CreateBudgetFormExample() {
  const { creating, createError, createBudget, clearCreateError } = useBudgetOperations();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const newBudget = await createBudget(values);
      message.success("Budget créé!");
      form.resetFields();
      // Le reducer met automatiquement à jour le state
    } catch (error) {
      message.error("Erreur de création");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="name" label="Nom">
        <Input />
      </Form.Item>
      <Form.Item name="totalBudget" label="Montant">
        <InputNumber />
      </Form.Item>
      <Button loading={creating} htmlType="submit">
        Créer
      </Button>
      {createError && <Alert type="error" message={createError} />}
    </Form>
  );
}

/**
 * Exemple 5: Approuver un budget
 */
import { useBudgetOperations } from "../../redux/hooks/useBudget";

function ApproveBudgetActionExample({ budgetId }) {
  const { approving, approveError, approveBudget } = useBudgetOperations();

  const handleApprove = async () => {
    try {
      await approveBudget(budgetId);
      message.success("Budget approuvé!");
      // Le reducer met automatiquement à jour le state
    } catch (error) {
      message.error("Erreur d'approbation");
    }
  };

  return (
    <Button
      loading={approving}
      onClick={handleApprove}
      type="primary"
      style={{ backgroundColor: "#52c41a" }}
    >
      Approuver
    </Button>
  );
}

/**
 * Exemple 6: Récupérer les analytics budgétaires
 */
import { useBudgetAnalytics } from "../../redux/hooks/useBudget";

function BudgetAnalyticsExample() {
  const { analytics, loading, fetchAnalytics } = useBudgetAnalytics();

  React.useEffect(() => {
    fetchAnalytics(2026); // Récupère analytics pour 2026
  }, []);

  if (loading) return <Spin />;

  return (
    <Row gutter={24}>
      {analytics.map((category) => (
        <Col key={category._id} xs={24} md={8}>
          <Card>
            <Statistic
              title={category._id}
              value={category.totalBudget}
              suffix="DT"
            />
            <Progress
              percent={(category.totalSpent / category.totalBudget) * 100}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

/**
 * AVANTAGES DE REDUX POUR LES BUDGETS:
 * 
 * 1. CACHE GLOBAL:
 *    - Les budgets chargés une fois restent en mémoire
 *    - Pas besoin de re-fetch si déjà chargé
 *    - Partage automatique entre tous les composants
 * 
 * 2. STATE MANAGEMENT CENTRALISÉ:
 *    - Évite les props drilling
 *    - Un seul source of truth
 *    - Facile à debugger avec Redux DevTools
 * 
 * 3. SYNCHRONISATION AUTOMATIQUE:
 *    - Quand on crée/modifie/supprime un budget
 *    - Le reducer met à jour automatiquement le state
 *    - Tous les composants voient les changements
 * 
 * 4. PERFORMANCE:
 *    - Les données persistes dans localStorage (redux-persist)
 *    - Offline first capability
 *    - Moins de requêtes API
 * 
 * 5. DEVELOPMENT EXPERIENCE:
 *    - Redux DevTools pour time-travel debugging
 *    - Middleware pour logging, erreur tracking
 *    - Type safety avec TypeScript (optionnel)
 */
