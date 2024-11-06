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
  const [message, setMessage] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [isPredictionFailed, setIsPredictionFalied] = useState(false);

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
  const maxLength = 45;

  const handleChange = (e) => {
    const lines = e.target.value.split("\n");

    if (lines.length <= maxRows && e.target.value.length <= maxLength) {
      setMessage(e.target.value);
    } else if (lines.length > maxRows) {
      setMessage(lines.slice(0, maxRows).join("\n"));
    }
  };

  const reset = () => {
    setImage(null);
    setMessage("");
    setIsPredictionFalied(false);
    setIsPredicting(false);
  };

  const handleReset = () => {
    reset();
  };

  const handlePhotoCapture = async () => {
    const image = camera.current.takePhoto();

    setImage(image);
    if (image != null) {
      try {
        setIsPredicting(true);
        const promt = await createPromtMessage(image);
        const message = await getFunnySentence(promt);
        setMessage(message);
        setIsPredictionFalied(false);
      } catch (e) {
        setIsPredictionFalied(true);
        setIsPredicting(false);
      }
    }
  };

  const handlePost = async () => {
    try {
      createPhotoCard(image, message);
    } catch {
      console.log("Error when posting the photo");
    }
    reset();
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
            value={message}
            rows={maxRows}
            maxLength={maxLength}
            onChange={handleChange}
            placeholder={
              isPredicting
                ? "Genarating message..."
                : isPredictionFailed
                  ? "Sorry, Message Genaration is failed, please write it yourself."
                  : "Write your moment..."
            }
            className="m-4 message-xl resize-none focus:outline-none focus:ring-0 overflow-hidden"
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
            disabled={image != null}
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
        className={`mt-4 shadow-md border-b-4 py-2 px-4 font-bold rounded-md ${image == null ? "message-slate-500 bg-slate-300 border-slate-500" : "message-white bg-[#f17a7e] border-[#ec4c51]"}`}
        onClick={handlePost}
        disabled={image == null}
      >
        Post !
      </button>
    </div>
  );
};

export default Console;
