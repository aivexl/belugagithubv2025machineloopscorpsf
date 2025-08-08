declare module "*.jsx" {
  import { ComponentType } from "react";
  const component: ComponentType<unknown>;
  export default component;
} 