import { QueryCache, QueryClient } from "react-query";

export const queryCache = new QueryCache({
  onError: (error, query) => {
    if (error instanceof Error) console.error({ key: query.queryKey, error: error.message });
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      notifyOnChangeProps: "tracked",
    },
  },
});

// export const ReactQueryProvider: React.FC = ({ children }) => (
//   <QueryClientProvider client={queryClient}>
//     {Environment.env.NODE_ENV === "development" && <ReactQueryDevtools />}

//     {children}
//   </QueryClientProvider>
// );
