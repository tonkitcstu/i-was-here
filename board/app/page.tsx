"use client";

import PhotoCard, { PhotoCardProps } from "@/components/PhotoCard";
import { useEffect, useState } from "react";
import { getPhotoCard } from "./api/strapi";

export default function Home() {
  const [photoCards, setPhotoCards] = useState<PhotoCardProps[]>([]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      let tmpList = [];
      const { data } = await getPhotoCard();
      for (let i = 0; i < data.length; i++) {
        const photoCard = data[i];
        const id = photoCard.id;
        const documentID = photoCard.documentId;
        const message = photoCard.message;
        const top = photoCard.top;
        const left = photoCard.left;

        let coverImageSrc = "";
        if (photoCard.coverImage) {
          coverImageSrc =
            process.env.NEXT_PUBLIC_STRAPI_HOST + photoCard.coverImage.url;
        }
        tmpList.push({
          id: id,
          documentID: documentID,
          message: message,
          top: top,
          left: left,
          coverImage: coverImageSrc,
        });
      }
      setPhotoCards(tmpList);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full">
      {photoCards.map((photoCard) => (
        <PhotoCard
          key={photoCard.id}
          id={photoCard.id}
          documentID={photoCard.documentID}
          message={photoCard.message}
          top={photoCard.top}
          left={photoCard.left}
          coverImage={photoCard.coverImage}
        ></PhotoCard>
      ))}
    </div>
  );
}
