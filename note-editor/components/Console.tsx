"use client";

import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import Image from "next/image";
import createPromtMessage from "@/app/api/rekognition";
import { getFunnySentence } from "@/app/api/gemini";
import { createPhotoCard } from "@/app/api/strapi";

interface ConsoleProps {}

const Console: React.FunctionComponent<ConsoleProps> = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [text, setText] = useState("");

  const errorMsgs = {
    noCameraAccessible:
      "No camera device accessible. Please connect your camera or try a different browser.",
    permissionDenied:
      "Permission denied. Please refresh and give camera permission.",
    switchCamera:
      "It is not possible to switch camera to different one because there is only one video device accessible.",
    canvas: "Canvas is not supported.",
  };

  const maxRows = 2;
  const maxLength = 50;

  const handleChange = (e) => {
    const lines = e.target.value.split("\n");

    if (lines.length <= maxRows && e.target.value.length <= maxLength) {
      setText(e.target.value);
    } else if (lines.length > maxRows) {
      setText(lines.slice(0, maxRows).join("\n"));
    }
  };

  const handleReset = () => {
    setImage(null);
    setText("");
  };

  const handlePhotoCapture = async () => {
    const image = camera.current.takePhoto();

    setImage(image);
    if (image != null) {
      const promt = await createPromtMessage(image);
      const message = await getFunnySentence(promt);
      setText(message);
    }
  };

  const handlePost = async () => {
    try {
      createPhotoCard(image, text);
    } catch {
      console.log("Error when posting the photo");
    }
    setImage(null);
    setText("");
  };

  return (
    <div className="px-5">
      <div className="grid justify-items-center pt-3">
        <div className="flex flex-col w-[22rem] h-[28rem] rounded-md bg-white shadow-lg">
          <div className="flex justify-center pt-3">
            <div className="relative w-[20rem] h-[20rem] rounded-md max-h-sm max-w-sm">
              {image == null ? (
                <Camera
                  ref={camera}
                  errorMessages={errorMsgs}
                  numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
                />
              ) : (
                <img src={image} alt="Taken photo" />
              )}
            </div>
          </div>
          <textarea
            value={text}
            rows={maxRows}
            maxLength={maxLength}
            onChange={handleChange}
            placeholder="Write your moment..."
            className="m-4 text-xl resize-none focus:outline-none focus:ring-0 overflow-hidden"
          ></textarea>
        </div>
      </div>

      <div className="mt-6 grid justify-items-center">
        <div className="flex space-x-5">
          <button
            disabled={numberOfCameras <= 1}
            onClick={() => {
              if (camera.current) {
                const result = camera.current.switchCamera();
              }
            }}
          >
            <Image src="/switch-camera.svg" width={40} height={40} alt="" />
          </button>
          <button
            className="p-4 shadow-sm bg-white w-20 h-20 rounded-full grid justify-items-center"
            onClick={handlePhotoCapture}
          >
            <div className="p-6 bg-red-100 rounded-full" />
          </button>
          <button onClick={handleReset}>
            <Image src="/reset.svg" width={40} height={40} alt="" />
          </button>
        </div>
      </div>

      <button
        className="mt-4 shadow-md bg-[#f17a7e]  border-b-4 border-[#ec4c51] py-2 px-4 text-white font-bold rounded-md"
        onClick={handlePost}
      >
        Post !
      </button>
    </div>
  );
};

export default Console;
