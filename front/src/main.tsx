import { createRoot } from 'react-dom/client'
import "./assets/common/css/reset.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Root from "./components/root.tsx";


const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        {/*<Root/>*/}
        <Root/>
        <div id="webrtc-overlay-root"></div>
    </QueryClientProvider>
)
