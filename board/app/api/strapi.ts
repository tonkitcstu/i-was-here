import * as qs from "qs";

const query = qs.stringify({
  fields: ["message", "top", "left"],
  populate: {
    coverImage: { fields: "url" },
  },
});

export async function getPhotoCard() {
  const url = new URL("/api/photocards", process.env.NEXT_PUBLIC_STRAPI_HOST);
  url.search = query;

  const res = await fetch(url.href);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
