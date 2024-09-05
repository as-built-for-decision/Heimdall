import { MeshStandardMaterial } from "three";


export const mouseDownMaterial = new MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xffffff,
});

export const mouseUpMaterial = new MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xff0000,
});
