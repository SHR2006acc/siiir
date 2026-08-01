"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Journey } from "@/data/journeys";
import { getLocation } from "@/data/locations";
import { useApp } from "./AppProvider";

type RouteStatus = "loading" | "road" | "rail" | "air" | "mixed" | "approximate";
type SegmentMode = "road" | "rail" | "air";
type Coordinate = [number, number];

function airArc(start: Coordinate, end: Coordinate) {
  const deltaLat = end[0] - start[0];
  const deltaLon = end[1] - start[1];
  return Array.from({ length:41 }, (_, index) => {
    const ratio = index / 40;
    const bow = Math.sin(Math.PI * ratio) * .72;
    return [
      start[0] + deltaLat * ratio + deltaLon * .08 * bow,
      start[1] + deltaLon * ratio - deltaLat * .08 * bow,
    ] as Coordinate;
  });
}

function operatorMode(operator: string): SegmentMode {
  if (/ONCF/i.test(operator)) return "rail";
  if (/Royal Air Maroc|Air Arabia|Ryanair/i.test(operator)) return "air";
  return "road";
}

export function RouteMap({ journey, fallbackFrom, fallbackTo }: { journey?: Journey; fallbackFrom: string; fallbackTo: string }) {
  const { t } = useApp();
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [routeStatus, setRouteStatus] = useState<RouteStatus>("loading");
  const names = useMemo(
    () => journey
      ? [journey.from, ...(journey.mapVia ?? journey.via ?? []), journey.to]
      : [fallbackFrom, fallbackTo],
    [journey, fallbackFrom, fallbackTo],
  );
  const points = useMemo(
    () => names.map(getLocation).filter((point): point is NonNullable<ReturnType<typeof getLocation>> => Boolean(point)),
    [names],
  );

  useEffect(() => {
    if (!mapElement.current || points.length < 2) return;

    let disposed = false;
    const controller = new AbortController();
    let cleanup = () => {};

    async function renderMap() {
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;

      const map = L.map(mapElement.current, {
        zoomControl:true,
        scrollWheelZoom:true,
        attributionControl:true,
      });
      cleanup = () => map.remove();

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom:19,
        attribution:"&copy; OpenStreetMap",
      }).addTo(map);

      if (journey?.mode === "TRAIN" || journey?.mode === "COMBINED") {
        L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
          maxZoom:18,
          opacity:.48,
          attribution:"Rail &copy; OpenRailwayMap",
        }).addTo(map);
      }

      const coordinates: Coordinate[] = points.map((point) => [point.latitude, point.longitude]);

      points.forEach((point, index) => {
        const isEndpoint = index === 0 || index === points.length - 1;
        const marker = L.marker([point.latitude, point.longitude], {
          icon:L.divIcon({
            className:"sir-map-marker-shell",
            html:`<span class="sir-map-marker ${isEndpoint ? "endpoint" : "waypoint"}"><b>${index + 1}</b></span>`,
            iconSize:[32, 38],
            iconAnchor:[16, 34],
          }),
        }).addTo(map);
        marker.bindPopup(`<strong>${point.city}</strong><br>${isEndpoint ? (index === 0 ? "Départ" : "Arrivée") : "Point de passage"}`);
        marker.bindTooltip(point.city, { direction:"top", offset:[0, -27], permanent:isEndpoint });
      });

      async function roadRoute(segment: Coordinate[]) {
        try {
          const waypointString = segment.map(([latitude, longitude]) => `${longitude},${latitude}`).join(";");
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${waypointString}?overview=full&geometries=geojson`,
            { signal:controller.signal },
          );
          if (!response.ok) throw new Error("Routing unavailable");
          const payload = await response.json() as { routes?: Array<{ geometry?: { coordinates?: [number, number][] } }> };
          const routed = payload.routes?.[0]?.geometry?.coordinates;
          return routed?.length ? routed.map(([longitude, latitude]) => [latitude, longitude] as Coordinate) : segment;
        } catch {
          return segment;
        }
      }

      async function resolveSegment(mode: SegmentMode, segment: Coordinate[]) {
        if (mode === "air") return airArc(segment[0], segment[segment.length - 1]);
        if (mode === "road") return roadRoute(segment);
        return segment;
      }

      const segmentDefinitions: Array<{ mode: SegmentMode; coordinates: Coordinate[] }> = [];
      if (journey?.mode === "COMBINED" && journey.via?.length) {
        const transferName = journey.via[0];
        const transferIndex = names.indexOf(transferName);
        const operators = journey.operator.split(" + ");
        const splitIndex = Math.max(1, transferIndex);
        segmentDefinitions.push(
          { mode:operatorMode(operators[0] ?? ""), coordinates:coordinates.slice(0, splitIndex + 1) },
          { mode:operatorMode(operators[1] ?? ""), coordinates:coordinates.slice(splitIndex) },
        );
      } else {
        const mode: SegmentMode = journey?.mode === "FLIGHT" ? "air" : journey?.mode === "TRAIN" ? "rail" : "road";
        segmentDefinitions.push({ mode, coordinates });
      }

      const renderedLines = [];
      for (const definition of segmentDefinitions) {
        if (definition.coordinates.length < 2) continue;
        const lineCoordinates = await resolveSegment(definition.mode, definition.coordinates);
        if (disposed) return;
        L.polyline(lineCoordinates, {
          color:"#ffffff",
          weight:9,
          opacity:.88,
          lineCap:"round",
          lineJoin:"round",
        }).addTo(map);
        const color = definition.mode === "rail" ? "#0b633f" : definition.mode === "air" ? "#173d63" : "#c1272d";
        const line = L.polyline(lineCoordinates, {
          color,
          weight:5,
          opacity:.96,
          dashArray:definition.mode === "air" ? "10 10" : undefined,
          lineCap:"round",
          lineJoin:"round",
        }).addTo(map);
        renderedLines.push(line);
      }

      if (!renderedLines.length || disposed) return;
      const featureGroup = L.featureGroup(renderedLines);
      map.fitBounds(featureGroup.getBounds().pad(.18), { maxZoom:10 });

      const modes = new Set(segmentDefinitions.map((segment) => segment.mode));
      if (modes.size > 1) setRouteStatus("mixed");
      else if (modes.has("rail")) setRouteStatus("rail");
      else if (modes.has("air")) setRouteStatus("air");
      else setRouteStatus(renderedLines.length ? "road" : "approximate");
    }

    setRouteStatus("loading");
    renderMap();
    return () => {
      disposed = true;
      controller.abort();
      cleanup();
    };
  }, [journey, names, points]);

  if (points.length < 2) {
    return <aside className="map map-empty"><div className="mapkey"><strong>{t("selectedJourney")}</strong><span>{fallbackFrom} → {fallbackTo}</span><small>Coordonnées indisponibles pour cette liaison.</small></div></aside>;
  }

  const modeNote = routeStatus === "mixed"
    ? "Tracé multimodal : rail en vert, route en rouge"
    : routeStatus === "air"
      ? "Couloir aérien direct"
      : routeStatus === "rail"
        ? "Corridor ferroviaire · couche OpenRailwayMap"
        : routeStatus === "road"
          ? "Tracé routier calculé"
          : routeStatus === "loading"
            ? "Calcul du tracé…"
            : "Tracé approximatif";

  return (
    <aside className="map interactive-map" aria-label={t("selectedJourney")}>
      <div ref={mapElement} className="leaflet-map" />
      <div className="mapkey">
        <div>
          <strong>{t("selectedJourney")}</strong>
          <span>{journey?.from ?? fallbackFrom} → {journey?.to ?? fallbackTo}</span>
        </div>
        <small><i className={`route-status ${routeStatus}`} />{modeNote} · zoom et déplacement actifs</small>
      </div>
    </aside>
  );
}
