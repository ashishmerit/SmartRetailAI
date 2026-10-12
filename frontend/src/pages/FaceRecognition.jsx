
import { useState } from "react";
import { ScanFace, LoaderCircle, UserRound } from "lucide-react";

import api from "@/api/axios";
import CameraCapture from "@/components/camera/CameraCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FaceRecognition() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const identifyCustomer = async () => {
    if (!image) {
      setError("Capture a face image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = new FormData();
      data.append("file", image);

      const response = await api.post("/face-recognition/predict", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Face recognition failed. Check the image and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <ScanFace className="size-7" />
          Face Recognition
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Identify an enrolled customer using a live camera capture.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Capture Customer Face</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CameraCapture
              onCapture={(file) => {
                setImage(file);
                setResult(null);
                setError("");
              }}
              disabled={loading}
            />

            <Button
              onClick={identifyCustomer}
              disabled={!image || loading}
              className="w-full"
            >
              {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              {loading ? "Identifying..." : "Identify Customer"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recognition Result</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </p>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <UserRound className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Recognized customer
                    </p>
                    <p className="text-lg font-semibold">{result.customer}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Model confidence
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {(Number(result.confidence) * 100).toFixed(2)}%
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  This endpoint performs identification. Visit recording is
                  handled separately.
                </p>
              </div>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <ScanFace className="size-10" />
                <p className="text-sm">
                  Capture a face and select Identify Customer to see the result.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
