import CategoriesReducer from '../reducers/CategoriesReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

import UserReducer from '../reducers/UserReducer';
import ProfileReducer from '../reducers/ProfileReducer';
import MovementsReducer from '../reducers/MovementsReducer';
import ProductsReducer from '../reducers/ProductsReducer';
import SuppliersReducer from '../reducers/SuppliersReducer';
import AchatsReducer from '../reducers/AchatsReducer';
import ClientReducer from '../reducers/ClientReducer';
import DevisReducer from '../reducers/DevisReducer';
import CommandeReducer from '../reducers/CommandeReducer';
import BonCommandeReducer from '../reducers/BonCommandeReducer';
import TransportersReducer from '../reducers/TransportersReducer';
import LivraisonsReducer from '../reducers/LivraisonsReducer';
import FactureReducer from '../reducers/FactureReducer';
import PaiementReducer from '../reducers/PaiementReducer';
import HrReducer from '../reducers/HrReducer';
import BudgetReducer from '../reducers/BudgetReducer';
import DashboardReducer from '../reducers/DashboardReducer';

const rootReducer = combineReducers({
    user: UserReducer,
    profile: ProfileReducer,
    movements: MovementsReducer,
    products: ProductsReducer,
    suppliers: SuppliersReducer,
    achats: AchatsReducer,
    clients: ClientReducer,
    devis: DevisReducer,
    commandes: CommandeReducer,
    bonCommandes: BonCommandeReducer,
    transporters: TransportersReducer,
    livraisons: LivraisonsReducer,
    facture: FactureReducer,
    paiements: PaiementReducer,
    hr: HrReducer,
    categories: CategoriesReducer,
    budgets: BudgetReducer,
    dashboards: DashboardReducer,
});

const persistConfig = {
    key: 'root',
    timeout: null,
    storage,
    whitelist: ['user', 'profile'],
    blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store;
