import {hc} from "hono/client";
import {type ApiRoutes} from "@server/app";
import {queryOptions} from "@tanstack/react-query";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
  const res = await api.me.$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();
  return data;
}

export const userQuery = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

async function getUserProducts() {
  const res = await api.products["user-products"].$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();
  return data;
}

export const userProductQuery = queryOptions({
  queryKey: ["get-user-products"],
  queryFn: getUserProducts,
  staleTime: Infinity,
});

export async function getSignedUrl(fileName: string, fileType: string, fileSize: number) {
  const res = await api.products["get-presigned-url"].$post({json: {fileName, fileSize, fileType}});
  const data = await res.json();
  return data;
}

// export const getUrlQuery = queryOptions({
//   queryKey: ["get-signed-url"],
//   queryFn: getSignedUrl,
//   staleTime: Infinity
// })
