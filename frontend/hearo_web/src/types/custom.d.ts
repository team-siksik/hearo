declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.js";

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
