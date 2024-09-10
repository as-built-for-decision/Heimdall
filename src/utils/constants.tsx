import { Vector3 } from "three";

export type Coordinate = {
  id: string;
  name: string;
  position: Vector3;
};

export function parseCoordinates(input: string): Coordinate[] {
  const lines = input.trim().split("\n");
  const coordinates: Coordinate[] = [];

  for (const line of lines) {
    const [id, name, x, y, z] = line.split(",");
    coordinates.push({
      id,
      name,
      position: new Vector3(parseFloat(x), parseFloat(y), parseFloat(z)),
    });
  }

  return coordinates;
}
