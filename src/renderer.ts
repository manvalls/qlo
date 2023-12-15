import { JSXNode } from "@builder.io/qwik";

export type RenderInput = JSXNode | string;
export type Renderer = (input?: RenderInput) => JSXNode;
