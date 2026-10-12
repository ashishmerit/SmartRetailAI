
import { useState } from "react";
import { LoaderCircle, ScanSearch, ShoppingBasket } from "lucide-react";

import api from "@/api/axios";
import CameraCapture from "@/components/camera/CameraCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDetection() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function detectProducts() {
    if (!image || loading) return;

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await api.post("/products/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Product detection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBasket className="size-5" />
          Product Detection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Capture products with your camera to identify items recognized by YOLO.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <CameraCapture
          onCapture={(file) => {
            setImage(file);
            setResults([]);
            setError("");
            setSearched(false);
          }}
          disabled={loading}
        />

        <Button
          onClick={detectProducts}
          disabled={!image || loading}
        >
          {loading ? (
            <LoaderCircle className="mr-2 size-4 animate-spin" />
          ) : (
            <ScanSearch className="mr-2 size-4" />
          )}
          {loading ? "Detecting..." : "Detect Products"}
        </Button>

        {error && (
          <p role="alert" className="text-sm text-destructive">{error}</p>
        )}

        {searched && results.length === 0 && (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            No products were detected in this image. Try capturing the products
            more clearly or moving closer.
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">
              Detected Products ({results.length})
            </h3>

            {results.map((item, index) => (
              <div
                key={`${item.product}-${index}`}
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{item.product}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bounding box: ({item.bbox.x1}, {item.bbox.y1}) to
                    ({item.bbox.x2}, {item.bbox.y2})
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {Number(item.confidence).toFixed(1)}%
                </span>
              </div>
            ))}

            <p className="text-xs text-muted-foreground">
              Confidence scores are model predictions, not guarantees of
              identification accuracy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
