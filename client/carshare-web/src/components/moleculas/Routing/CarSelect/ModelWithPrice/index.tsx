import { CarWithProvider } from "src/context/routingStore/types";
import { CircularProgress, Box } from "@mui/material";
import { useQuery } from "react-query";
import { last } from "lodash";
import { Section } from "src/services/routeCalculation/types";
import { useRoutingStore } from "src/context/routingStore";
import L from "leaflet";
import services from "src/config/services";
import { useMemo } from "react";

interface IModelWithPriceProps {
  car: CarWithProvider;
}

const router = L.Routing.osrmv1({
  serviceUrl: "https://routing.openstreetmap.de/routed-car/route/v1",
});

const ModelWithPrice = ({ car }: IModelWithPriceProps) => {
  const waypoints = useRoutingStore((s) => s.waypoints);

  const waypointsWithProvidedCar = useMemo(
    () => [
      { latLng: L.latLng({ lat: car.lat, lng: car.lon }) },
      ...waypoints.slice(1).map((w) => ({ latLng: w })),
    ],
    [waypoints, car]
  );

  const { data: prices = [{ kopecks: 0 }], isLoading } = useQuery(
    ["calculateBestPrice", car.id, waypointsWithProvidedCar],
    async () => {
      const instructions = await new Promise<
        L.Routing.IInstruction[] | undefined
      >((resolve, reject) => {
        router.route(waypointsWithProvidedCar, (...args: any[]) => {
          if (args[0]) {
            reject(args[0]);
          }
          const routes: L.Routing.IRoute[] = args[1];
          resolve(routes[0].instructions);
        });
      });

      const residenceTimeInWaypoints = waypoints
        .map((w) => w.residenceTimeMins)
        .reverse();
      const routeSections: Section[] = instructions!.reduce(
        (acc, i) => {
          if (i.type === "DestinationReached") {
            acc.push({
              meters: 0,
              seconds: 0,
              parkingMinutes: residenceTimeInWaypoints.pop() ?? 0,
            });

            return acc;
          }

          if (i.type === "WaypointReached") {
            acc.push(
              {
                meters: 0,
                seconds: 0,
                parkingMinutes: residenceTimeInWaypoints.pop() ?? 0,
              },
              {
                meters: 0,
                seconds: 0,
                parkingMinutes: 0,
              }
            );

            return acc;
          }

          const lastInstruction = last(acc);

          if (lastInstruction) {
            lastInstruction.meters += i.distance;
            lastInstruction.seconds += i.time;
          }

          return acc;
        },
        [
          {
            meters: 0,
            seconds: 0,
            parkingMinutes: residenceTimeInWaypoints.pop() ?? 0,
          },
        ]
      );

      return await services.routeCalculation.calculatePrices({
        car: { model: car!.model, providerId: car!.providerId },
        routeSections,
      });
    },
    {
      enabled: Boolean(waypoints.length > 1),
      refetchOnWindowFocus: false,
      staleTime: Number.POSITIVE_INFINITY,
    }
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {car.model}
      {isLoading ? (
        <CircularProgress size={16} sx={{ ml: 1 }} />
      ) : (
        ` - ${prices![0].kopecks / 100} руб`
      )}
    </Box>
  );
};

export default ModelWithPrice;
