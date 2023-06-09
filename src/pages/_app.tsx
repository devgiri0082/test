import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { type AppType } from "next/dist/shared/lib/utils";
import 'react-toastify/dist/ReactToastify.css';

import "~/styles/globals.css";
const queryClient = new QueryClient()
const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
        </QueryClientProvider>
    )

};

export default MyApp;
