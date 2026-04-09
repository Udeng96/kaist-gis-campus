import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Root from './pages/Root';

import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import './assets/common/css/reset.css';
import './assets/common/css/common.css';
import './assets/common/css/header.css';
import './assets/common/css/onboarding.css';
import './assets/dashboard/css/main.css';
import './assets/common/css/content.css';
import './assets/common/css/gis.css';
import './assets/dashboard/css/event.css';
import './assets/common/css/patrol.css';
import './assets/common/css/modal.css';
import './assets/common/css/datePicker.css';
import './assets/common/css/selectBox.css';
import './assets/common/css/toggleBtn.css';
import './assets/common/css/tree.css';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <Root />
    </QueryClientProvider>
);
