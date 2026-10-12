
import { useState } from "react";
import { LoaderCircle, ShoppingBasket } from "lucide-react";

import api from "@/api/axios";
import CameraCapture from "@/components/camera/CameraCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductRecognition() {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const detectProducts = async () => {
    if (!image) {
      setError("Capture an image containing products first.");
      return;
    }

    setLoading(true);
    setError("");
    setPredictions(null);

    try {
      const data = new FormData();
      data.append("image", image);

      const response = await api.post("/products/predict", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPredictions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Product detection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <ShoppingBasket className="size-7" />
          Product Recognition
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Capture products with your camera and run YOLO object detection.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Capture Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CameraCapture
              onCapture={(file) => {
                setImage(file);
                setPredictions(null);
                setError("");
              }}
              disabled={loading}
            />

            <Button
              onClick={detectProducts}
              disabled={!image || loading}
              className="w-full"
            >
              {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              {loading ? "Detecting..." : "Detect Products"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </p>
            )}

            {predictions !== null && predictions.length === 0 && (
              <p className="rounded-md border p-4 text-sm text-muted-foreground">
                No products were detected in this image.
              </p>
            )}

            {predictions?.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Bounding box: ({item.bbox.x1}, {item.bbox.y1}) to
                      ({item.bbox.x2}, {item.bbox.y2})
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium">
                    {(Number(item.confidence) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}

            {predictions === null && !error && (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <ShoppingBasket className="size-10" />
                <p className="text-sm">
                  Detection results will appear here after inference.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
