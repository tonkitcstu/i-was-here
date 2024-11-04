import React from "react";
import { Rnd } from "react-rnd";

export interface PhotoCardProps {
  id: number;
  message: string;
  top: number;
  left: number;
  coverImage: string;
}

const PhotoCard: React.FunctionComponent<PhotoCardProps> = (
  props: PhotoCardProps,
) => {
  return (
    <Rnd>
      <div
        className="grid justify-items-center pt-2"
        style={{
          position: "absolute",
          top: `${props.top}px`,
          left: `${props.left}px`,
        }}
      >
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
