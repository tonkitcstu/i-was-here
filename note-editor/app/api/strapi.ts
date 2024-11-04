export async function createPhotoCard(image: any, message: string) {
  const tokenHeader = "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const uploadURL = new URL("/api/upload", process.env.NEXT_PUBLIC_STRAPI_HOST);
  const imageFile = base64ToFile(image, "coverImage.jpg");
  const formData = new FormData();
  formData.append("files", imageFile);

  const uploadRes = await fetch(uploadURL.href, {
    method: "POST",
    headers: {
      Authorization: tokenHeader,
    },
    body: formData,
  });
  if (!uploadRes.ok) {
    throw new Error("Failed to fetch data");
  }
  const result = await uploadRes.json();

  const imageID = result[0].id;
  const photocardURL = new URL(
    "/api/photocards",
    process.env.NEXT_PUBLIC_STRAPI_HOST,
  );

  const x = Math.ceil(Math.random() * (window.innerWidth - 150));
  const y = Math.ceil(Math.random() * (window.innerHeight - 150));

  const requestBody = {
    data: {
      message: message,
      top: y,
      left: x,
      coverImage: imageID,
    },
  };

  const createPhotoRes = await fetch(photocardURL.href, {
    method: "POST",
    headers: {
      Authorization: tokenHeader,
      "content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!createPhotoRes.ok) {
    throw new Error("Failed to fetch data");
  }
}

const base64ToFile = (base64String: string, filename: string) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
};
