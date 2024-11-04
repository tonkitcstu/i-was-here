import {
  DetectFacesCommand,
  DetectFacesCommandInput,
  DetectFacesResponse,
  RekognitionClient,
  RekognitionClientConfig,
} from "@aws-sdk/client-rekognition";

export default async function createPromtMessage(image: any) {
  const config: RekognitionClientConfig = {
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY_ID ?? "",
      sessionToken: process.env.NEXT_PUBLIC_AWS_SESSION_TOKEN,
    },
  };
  const uint = Buffer.from(
    image.replace(/^[\w\d;:\/]+base64\,/g, ""),
    "base64",
  );
  const input: DetectFacesCommandInput = {
    Image: {
      Bytes: uint,
    },
    Attributes: ["EMOTIONS", "GENDER"],
  };
  const client = new RekognitionClient(config);
  const command = new DetectFacesCommand(input);
  const response: DetectFacesResponse = await client.send(command);

  const filteredFaceDetail = response.FaceDetails.map((face) => {
    const mostConfidentEmotion = face.Emotions.reduce(
      (maxEmotion, currentEmotion) => {
        return currentEmotion.Confidence > maxEmotion.Confidence
          ? currentEmotion
          : maxEmotion;
      },
    );
    return mostConfidentEmotion.Type;
  });

  const faceDetailSet = filteredFaceDetail.filter(
    (faceType, index) => filteredFaceDetail.indexOf(faceType) === index,
  );

  var promt =
    "create a very short sentence (maximum character 50 chars and don't show number of character) about ";
  if (faceDetailSet.length > 1) {
    promt =
      promt +
      " a group of people " +
      " with " +
      faceDetailSet.join(",") +
      " emotion";
  }
  if (faceDetailSet.length == 1) {
    if (response.FaceDetails[0].Gender?.Value == "Male") {
      promt = promt + " a man";
    } else {
      promt = promt + " a woman";
    }
    promt = promt + " with " + faceDetailSet[0] + " emotion";
  } else {
    promt = promt + "lonlyness";
  }

  return promt;
}
