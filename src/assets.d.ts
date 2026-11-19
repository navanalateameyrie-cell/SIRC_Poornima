// Ambient module declarations so TypeScript accepts static image imports
// (Vite/CRA/webpack asset imports). Keeps App.tsx free of broken types.
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
