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

export async function updatePhotoCardLocation(
  documentID: string,
  top: number,
  left: number,
) {
  const tokenHeader = "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const url = new URL(
    "/api/photocards/" + documentID,
    process.env.NEXT_PUBLIC_STRAPI_HOST,
  );
  const requestBody = {
    data: {
      top: top,
      left: left,
    },
  };

  const res = await fetch(url.href, {
    method: "PUT",
    headers: {
      Authorization: tokenHeader,
      "content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
}
