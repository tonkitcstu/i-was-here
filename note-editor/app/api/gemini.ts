export async function getFunnySentence(promt: string) {
  const url = new URL(
    "/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
      process.env.NEXT_PUBLIC_GEMINI_KEY,
    process.env.NEXT_PUBLIC_GEMINI_HOST,
  );

  const data = {
    contents: [
      {
        parts: [{ text: promt }],
      },
    ],
  };

  const res = await fetch(url.href, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log(res);
    return "";
  }

  const result = await res.json();
  if (result.candidates.length > 0) {
    const candidates = result.candidates;
    if (candidates[0].content.parts.length > 0) {
      const parts = candidates[0].content.parts;
      return parts[0].text;
    }
  }
  return "";
}
