import { GraphQLClient } from "graphql-request";

import { INFO_CLIENT } from "../constants/endpoints";

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getGQLHeaders = (endpoint: string) => {
  if (endpoint === INFO_CLIENT) {
    return {
      "X-Sf":
        process.env.REACT_APP_PUBLIC_SF_HEADER ||
        // hack for inject CI secret on window
        (typeof window !== "undefined" &&
          // @ts-ignore
          window.sfHeader),
    };
  }
  return undefined;
};

export const infoClient = new GraphQLClient(INFO_CLIENT, { headers: getGQLHeaders(INFO_CLIENT) });

export const infoServerClient = new GraphQLClient(INFO_CLIENT, {
  headers: {
    "X-Sf": process.env.SF_HEADER as string,
  },
  timeout: 5000,
});

export const bitQueryServerClient = new GraphQLClient(process.env.REACT_APP_PUBLIC_BIT_QUERY_ENDPOINT as string, {
  headers: {
    // only server, no `REACT_APP_PUBLIC` not going to expose in client
    "X-API-KEY": process.env.BIT_QUERY_HEADER as string,
  },
  timeout: 5000,
});
