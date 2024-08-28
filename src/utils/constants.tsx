import { Vector3 } from "three";

export type Coordinate = {
  id: string;
  position: Vector3;
};

export function parseCoordinates(input: string): Coordinate[] {
  const lines = input.trim().split("\n");
  const coordinates: Coordinate[] = [];

  for (const line of lines) {
    const [id, x, y, z] = line.split(",");
    coordinates.push({
      id,
      position: new Vector3(parseFloat(x), parseFloat(y), parseFloat(z)),
    });
  }

  return coordinates;
}
