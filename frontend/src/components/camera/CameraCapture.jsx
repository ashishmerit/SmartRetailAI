
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Video, VideoOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CameraCapture({ onCapture, disabled = false }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const previewUrlRef = useRef(null);

  const [capturedUrl, setCapturedUrl] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [starting, setStarting] = useState(true);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError("");
    setStarting(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is unavailable. Use localhost or HTTPS in a supported browser."
        );
      }

      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      stopCamera();

      if (error.name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser settings and try again."
        );
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera was found on this device.");
      } else {
        setCameraError(error.message || "Unable to start the camera.");
      }
    } finally {
      setStarting(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [startCamera, stopCamera]);

  const captureImage = async () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("The camera is not ready yet. Please wait and retry.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Could not capture the image. Please try again.");
          return;
        }

        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }

        const file = new File([blob], `camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;

        setCapturedUrl(url);
        setCameraError("");
        onCapture(file);
      },
      "image/jpeg",
      0.92
    );
  };

  const retakeImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setCapturedUrl("");
    setCameraError("");
    onCapture(null);
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-black">
        {capturedUrl ? (
          <img
            src={capturedUrl}
            alt="Captured camera frame"
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-contain"
          />
        )}

        {starting && !capturedUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 text-sm">
            Starting camera...
          </div>
        )}

        {cameraError && !capturedUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-4 text-center">
            <VideoOff className="size-8 text-destructive" />
            <p className="max-w-md text-sm text-destructive">
              {cameraError}
            </p>
            <Button type="button" variant="outline" onClick={startCamera}>
              <RotateCcw className="mr-2 size-4" />
              Retry Camera
            </Button>
          </div>
        )}
      </div>

      {cameraError && capturedUrl && (
        <p role="alert" className="text-sm text-destructive">
          {cameraError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {capturedUrl ? (
          <Button
            type="button"
            variant="outline"
            onClick={retakeImage}
            disabled={disabled}
          >
            <RotateCcw className="mr-2 size-4" />
            Retake
          </Button>
        ) : (
          <Button
            type="button"
            onClick={captureImage}
            disabled={disabled || starting || Boolean(cameraError)}
          >
            <Camera className="mr-2 size-4" />
            Capture Image
          </Button>
        )}

        {!capturedUrl && !cameraError && !starting && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="size-4" />
            Camera ready
          </span>
        )}
      </div>
    </div>
  );
}
