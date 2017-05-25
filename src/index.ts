import h from "snabbdom/h"
import * as snabbdom from "snabbdom"
import snabbdomClass from "snabbdom/modules/class"
import snabbdomProps from "snabbdom/modules/props"
import snabbdomStyle from "snabbdom/modules/style"
import snabbdomListeners from "snabbdom/modules/eventlisteners"

import {VNode, VNodeData} from "snabbdom/vnode"
export type VNode = VNode
export type VNodeData = VNodeData

import {
  isString, isArray, isDefined, isUndefined, log, OneOrMore
} from "power-belt"

interface Global extends Window {
  // make view a global because cannot `x = x || y` when x is a local
  view: VNode | HTMLElement
}
const global = window as Global

const snabbdomPatch = snabbdom.init([
  snabbdomClass,
  snabbdomProps,
  snabbdomStyle,
  snabbdomListeners
])

export const patch = (domElemId: string) => (vnode: VNode) =>
  global.view = snabbdomPatch(
    global.view || document.getElementById(domElemId) as HTMLElement,
    h("div#" + domElemId, vnode)
  )

interface Name {
  name: string
}

export type Content = OneOrMore<string|VNode>
export type CssClass = OneOrMore<string>

export interface HyperScriptFunc {
  (): VNode
  (content: Content): VNode
  (data: VNodeData): VNode
  (data: VNodeData, content: Content): VNode
  (cssClass: CssClass, content: Content): VNode
  (cssClass: CssClass, data: VNodeData): VNode
  (cssClass: CssClass, data: VNodeData, content: Content): VNode
}

export const tag = (type: string): HyperScriptFunc =>
  (a?: CssClass|VNodeData|Content, b?: VNodeData|Content, c?: Content) => {
    if (isUndefined(a)) {
      return h(type)
    } else if (isUndefined(b)) {
      return h(type, a as any) // a is Content
    } else if (isString(a) || isArray(a)) {
      const cssSelector =
        isString(a) ? a :
        isArray(a)  ? a.join(".") :
        ""
      const selector = type + (cssSelector ? "." : "") + cssSelector
      return h(selector, b as any, c as any)
    } else {
      return h(type, a as any, b as any)
    }
  }

export const h1 = tag("h1")
export const h2 = tag("h2")
export const h3 = tag("h3")
export const h4 = tag("h4")
export const h5 = tag("h5")
export const h6 = tag("h6")
export const div = tag("div")
export const span = tag("span")
export const p = tag("p")
export const ul = tag("ul")
export const ol = tag("ol")
export const li = tag("li")
export const input = tag("input")
export const img = tag("img")
export const br = h("br")

const svgTag = (type: string) => {
  const t = tag(type)
  return (attrs: any, children?: string | VNode[]) =>
    children ? t({attrs}, children as string) : t({attrs})
}

export const svg = svgTag("svg")
export const polygon = svgTag("polygon")
export const text = svgTag("text")

const replaceWithBr = (str: string, target: string) =>
  str.split(target).reduce(
    (parts, part) => parts.concat([part, br]),
    [] as (string|VNode)[]
  ).slice(0, -1)

export const newlineToBr = (str: string) => replaceWithBr(str, "\n")
export const newlineStrToBr = (str: string) => replaceWithBr(str, "\\n")
