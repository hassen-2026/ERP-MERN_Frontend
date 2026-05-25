# Dashboards Documentation

## Overview
Ce projet implémente des **dashboards spécialisés par rôle** avec des visualisations interactives (graphiques, courbes, cercles, barres) en utilisant **Recharts**.

## Dashboards Implémentés

### 1. **Admin Dashboard** (`AdminDashboard.jsx`)
- **Metrics**: Total Users, Active Employees, Total Orders, Revenue
- **Visualizations**:
  - Line Chart: Revenue vs Expenses Trend
  - Bar Chart: Department Performance
  - Pie Charts: User Distribution by Role, Orders by Status
- **Purpose**: Vue système complète avec métriques globales

### 2. **Sales Manager Dashboard** (`SalesManagerDashboard.jsx`)
- **Metrics**: Total Sales, Active Orders, Conversion Rate, Avg Order Value
- **Visualizations**:
  - Line Chart: Sales Performance vs Target
  - Bar Chart: Top Clients by Sales
  - Pie Charts: Sales Pipeline, Deals Won vs Lost
- **Purpose**: Suivi des ventes et du pipeline clients

### 3. **Procurement Manager Dashboard** (`ProcurementDashboard.jsx`)
- **Metrics**: Total PO Value, Active Suppliers, Pending Orders, Avg Delivery Days
- **Visualizations**:
  - Line Chart: Monthly Spending vs Budget
  - Bar Chart: Top Suppliers by Value
  - Pie Charts: Purchase by Category
- **Purpose**: Gestion des achats et des fournisseurs

### 4. **HR Manager Dashboard** (`HRDashboard.jsx`)
- **Metrics**: Total Employees, Active Leave Requests, Pending Recruitment, Avg Salary
- **Visualizations**:
  - Line Chart: Headcount Trend
  - Bar Chart: Turnover by Department
  - Pie Chart: Leave Type Distribution
- **Purpose**: Gestion des ressources humaines et paie

### 5. **Finance Manager Dashboard** (`FinanceDashboard.jsx`)
- **Metrics**: Total Revenue, Total Expenses, Net Profit, Profit Margin
- **Visualizations**:
  - Line Chart: Profit & Loss Trend
  - Bar Chart: Monthly Cash Flow
  - Pie Charts: Revenue by Source, Expense Breakdown
- **Purpose**: Suivi financier et rentabilité

### 6. **Logistics Manager Dashboard** (`LogisticsDashboard.jsx`)
- **Metrics**: Active Shipments, Delivery Rate, Avg Delivery Days, Fleet Utilization
- **Visualizations**:
  - Line Chart: Monthly Shipment Trend
  - Bar Charts: Deliveries by Region, Cost by Transport Mode
  - Pie Chart: Current Shipment Status
- **Purpose**: Gestion de la logistique et des livraisons

### 7. **Manager Dashboard** (`ManagerDashboard.jsx`)
- **Metrics**: Total Sales, Active Projects, Team Members, Performance Score
- **Visualizations**:
  - Line Chart: Performance vs Target
  - Bar Chart: Monthly Revenue Trend
  - Pie Charts: Project Status, Team Performance
- **Purpose**: Vue d'ensemble générale et supervision d'équipe

### 8. **User Dashboard** (`UserDashboard.jsx`)
- **Metrics**: My Tasks, Completed, Team Members, Performance
- **Visualizations**:
  - Line Charts: Task Activity, Productivity Trend
  - Pie Charts: Tasks by Category, Tasks by Priority
- **Purpose**: Vue personnelle des tâches et productivité

## Architecture

### Composants Réutilisables (`DashboardLayout.jsx`)
- `StatCard`: Carte de statistique avec icône et valeur
- `BarChartWidget`: Composant wrapper pour Bar Chart
- `LineChartWidget`: Composant wrapper pour Line Chart
- `MultiLineChartWidget`: Composant wrapper pour plusieurs lignes
- `PieChartWidget`: Composant wrapper pour Pie Chart
- `DashboardStatsGrid`: Grille responsive de stat cards
- `DashboardChartsGrid`: Grille responsive de graphiques

### Structure des Fichiers
```
frontend/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx        # Composants réutilisables
│   │   └── DashboardLayout.css
│   ├── pages/
│   │   └── Dashboards/
│   │       ├── index.js               # Export central
│   │       ├── AdminDashboard.jsx
│   │       ├── SalesManagerDashboard.jsx
│   │       ├── ProcurementDashboard.jsx
│   │       ├── HRDashboard.jsx
│   │       ├── FinanceDashboard.jsx
│   │       ├── LogisticsDashboard.jsx
│   │       ├── ManagerDashboard.jsx
│   │       ├── UserDashboard.jsx
│   │       └── [Corresponding .css files]
│   └── templates/
│       ├── TemplateAdmin/TemplateAdmin.jsx
│       ├── TemplateSalesManager/TemplateSalesManager.jsx
│       ├── [Other role templates...]
```

## Installation

### 1. Installer Recharts
```bash
cd frontend
npm install recharts
```

### 2. Vérifier que les imports sont corrects
Les dashboards utilisent:
- `recharts` pour les visualisations
- `antd` pour les components UI (Row, Col, Card, Statistic)
- React Hooks (useMemo)

## Utilisation

### Intégration aux Templates
Chaque template de rôle importe et affiche son dashboard:
```jsx
import AdminDashboard from "../../pages/Dashboards/AdminDashboard";

function TemplateAdmin() {
  return <AdminDashboard />;
}
```

### Mock Data
Tous les dashboards utilisent **mock data** pour les graphiques. Pour intégrer des vraies données:

1. **Créer des APIs** dans le backend pour chaque dashboard
2. **Fetcher les données** avec Redux/axios
3. **Remplacer les données mockées** dans chaque dashboard:

```jsx
// Exemple
const [revenueData, setRevenueData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const response = await apiClient.get("/api/admin/revenue-trend");
    setRevenueData(response.data);
  };
  fetchData();
}, []);
```

## Couleurs et Styling

### Palette Couleur
- **Primary Blue**: `#184f87`
- **Success Green**: `#52c41a`
- **Warning Yellow**: `#faad14`
- **Alert Red**: `#eb2f96`
- **Info Blue**: `#1890ff`
- **Secondary Purple**: `#722ed1`
- **Background**: `#f4f6fb`

### Responsive Design
- **XS**: Mobile (< 576px)
- **SM**: Small tablets (576px - 767px)
- **MD**: Tablets (768px - 991px)
- **LG**: Desktops (992px+)

## Personnalisation

### Ajouter un nouveau graphique
```jsx
import { LineChartWidget } from "../../components/DashboardLayout";

const MyData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 120 },
];

<LineChartWidget
  title="Mon Graphique"
  data={MyData}
  dataKey="value"
  xAxis="month"
  height={300}
/>
```

### Modifier les couleurs
```jsx
const customColors = ["#color1", "#color2", "#color3"];

<PieChartWidget
  title="My Pie"
  data={data}
  colors={customColors}
/>
```

## Prochaines Étapes

1. ✅ Implémenter dashboards avec Recharts
2. ⏳ Connecter aux APIs backend pour vraies données
3. ⏳ Ajouter filtrage par date/période
4. ⏳ Ajouter exports (PDF, Excel)
5. ⏳ Ajouter mode dark/light
6. ⏳ Ajouter notifications et alertes en temps réel

## Dépendances

```json
{
  "recharts": "^2.10.0",
  "antd": "^5.27.1",
  "react": "^19.2.0",
  "react-redux": "^9.2.0",
  "axios": "^1.14.0"
}
```

## Notes
- Tous les dashboards sont **complètement responsive**
- Les graphiques utilisent **Recharts** pour une performance optimale
- Les données sont **mockées** - à remplacer par des APIs réelles
- Chaque rôle a un dashboard **personnalisé** avec des KPIs pertinents
