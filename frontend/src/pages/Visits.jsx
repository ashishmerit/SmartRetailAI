
import { useCallback, useEffect, useState } from "react";
import { Camera, ClipboardList, LoaderCircle } from "lucide-react";

import api from "@/api/axios";
import CameraCapture from "@/components/camera/CameraCapture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadVisits = useCallback(async () => {
    try {
      const response = await api.get("/visit/");
      setVisits(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load visits.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const recordVisit = async () => {
    if (!image) return;

    setRecording(true);
    setError("");
    setMessage("");

    try {
      const data = new FormData();
      data.append("image", image);

      const response = await api.post("/visit/start", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(
        `Visit recorded for customer #${response.data.customer_id}.`
      );
      setImage(null);
      await loadVisits();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to record the visit. Check that the face is enrolled."
      );
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-semibold">
          <ClipboardList className="size-7" /> Visits
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Record customer visits and review the visit history.
        </p>
      </div>

      {(error || message) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-lg border p-3 text-sm ${
            error ? "text-destructive" : "text-green-700"
          }`}
        >
          {error || message}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Record a Visit</CardTitle>
        </CardHeader>
        <CardContent className="max-w-2xl space-y-4">
          <CameraCapture
            onCapture={(file) => {
              setImage(file);
              setError("");
              setMessage("");
            }}
            disabled={recording}
          />
          <Button
            onClick={recordVisit}
            disabled={!image || recording}
          >
            {recording ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Camera className="mr-2 size-4" />
            )}
            {recording ? "Recording..." : "Identify & Record Visit"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visit History ({visits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading visits...</p>
          ) : visits.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No visits have been recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-3 pr-4">Customer ID</th>
                    <th className="py-3 pr-4">Date & Time (UTC)</th>
                    <th className="py-3 pr-4">Confidence</th>
                    <th className="py-3">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit, index) => (
                    <tr
                      key={`${visit.customer_id}-${visit.visit_time}-${index}`}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 pr-4">#{visit.customer_id}</td>
                      <td className="py-3 pr-4">
                        {visit.visit_time
                          ? new Date(visit.visit_time).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        {visit.confidence == null
                          ? "—"
                          : `${Number(visit.confidence).toFixed(2)}%`}
                      </td>
                      <td className="py-3">{visit.location || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
