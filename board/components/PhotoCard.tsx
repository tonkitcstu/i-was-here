"use client";

import { deletePhotoCard, updatePhotoCardLocation } from "@/app/api/strapi";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { useRef } from "react";

export interface PhotoCardProps {
  id: number;
  documentID: string;
  message: string;
  top: number;
  left: number;
  coverImage: string;
}

const PhotoCard: React.FunctionComponent<PhotoCardProps> = (
  props: PhotoCardProps,
) => {
  const top = useRef(props.top);
  const left = useRef(props.left);
  const cardRef = useRef(null);
  const [wantToDelete, setWantTodelete] = useState(false);

  const handleDoubleClick = () => {
    if (wantToDelete) {
      setWantTodelete(false);
    } else {
      setWantTodelete(true);
    }
  };

  const handleDelete = () => {
    deletePhotoCard(props.documentID);
  };

  return (
    <Rnd
      onDragStop={(e, data) => {
        if (data.x != 0 || data.y != 0) {
          const rect = cardRef.current.getBoundingClientRect();
          if (rect != null) {
            if (top.current != rect.top || left.current != rect.left) {
              top.current = rect.top;
              left.current = rect.left;
              updatePhotoCardLocation(
                props.documentID,
                top.current,
                left.current,
              );
            }
          }
        }
      }}
    >
      <div
        ref={cardRef}
        onDoubleClick={handleDoubleClick}
        className="grid justify-items-center pt-2"
        style={{
          position: "absolute",
          top: `${props.top}px`,
          left: `${props.left}px`,
        }}
      >
        {wantToDelete ? (
          <div
            className="bg-red-500 m-2 p-2 rounded-md text-white font-semibold"
            onClick={handleDelete}
          >
            Delete
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-col w-[12rem] h-[16rem] rounded-md bg-white shadow-lg">
          <div className="flex justify-center pt-2 rounded-md">
            <div className="relative w-[11rem] h-[10rem] bg-black rounded-md max-h-sm max-w-sm">
              {props.coverImage != "" ? (
                <img
                  src={props.coverImage}
                  draggable={false}
                  alt="Taken photo"
                />
              ) : (
                <></>
              )}
            </div>
          </div>

          <span className="m-5 text-md overflow-hidden">{props.message}</span>
        </div>
      </div>
    </Rnd>
  );
};

export default PhotoCard;
