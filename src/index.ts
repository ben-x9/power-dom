
import {types, style as $style} from "typestyle"
export type NestedCSSProperties = types.NestedCSSProperties
import {VNode, Props, InfernoChildren, createVNode, render} from "inferno"
import createClass from "inferno-create-class"
import createElement from "inferno-create-element"

import {
  isString, isArray, isDefined, isUndefined, log, OneOrMore, Nothing, exists, Maybe
} from "power-belt"
import Component from "inferno-component"

interface Global extends Window {
  // make view a global because cannot `x = x || y` when x is a local
  view: VNode | HTMLElement
}
const global = window as Global

interface Name {
  name: string
}

// export type Content = OneOrMore<string|VNode|Nothing>
export type Children = InfernoChildren
export type ClassName = OneOrMore<string|Nothing>

const hasLifecycleEvents = (props: Props): Boolean =>
  props.onComponentDidMount ||
  props.onComponentWillMount ||
  props.onComponentWillUnmount ||
  props.onComponentShouldUpdate ||
  props.onComponentWillUpdate ||
  props.onComponentDidUpdate

const h = (tagName: string, props?: Props, children?: Children): VNode => {
  if (props && hasLifecycleEvents(props)) {
    const component = createClass({
      displayName: tagName.toUpperCase() + "_" + Math.random(),
      onComponentDidMount: props.onComponentDidMount,
      onComponentWillMount: props.onComponentWillMount,
      onComponentWillUnmount: props.onComponentWillUnmount,
      onComponentShouldUpdate: props.onComponentShouldUpdate,
      onComponentWillUpdate: props.onComponentWillUpdate,
      onComponentDidUpdate: props.onComponentDidUpdate,
      render() {
        return createElement(tagName, props, children)
      }
    })
    return createElement(new component())
  }
  else
    return createElement(tagName, props, children)
}

export interface HyperScriptFunc {
  (): VNode
  (children: Children): VNode,
  (props: Props): VNode
  (props: Props, children: Children): VNode
  (className: ClassName, children: Children): VNode
  (className: ClassName, props: Props): VNode
  (className: ClassName, props: Props, children: Children): VNode
}

const isOneOrMoreChildren = (x: Maybe<Props|Children>) =>
  x && (isString(x) || isArray(x) || (x as VNode).type)

export const tag = (type: string): HyperScriptFunc =>
  (a?: ClassName|Props|Children, b?: Props|Children, c?: Children) => {
    if (isUndefined(a)) {
      return h(type)
    } else if (isUndefined(b)) {
      return h(type, a as any) // a is Content
    } else if (isString(a) || isArray(a)) {
      const $classes = isString(a) ? [a] : isArray(a) ? a : []
      const classes: string[] = []
      for (const klass of $classes) {
        if (isString(klass))
          classes.push(klass)
      }
      if (c || !isOneOrMoreChildren(b)) {
        const vnd = b as Props
        b = {...vnd, className: classes.join(" ")}
      } else {
        c = b as Children
        b = {className: classes.join(" ")}
      }
      return h(type, b as any, c as any)
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
export const textarea = tag("textarea")
export const img = tag("img")
export const a = tag("a")

export const br = h("br")

export const iframe = tag("iframe")

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

export type Style = Maybe<string | string[] | NestedCSSProperties>
export const style = (...css: Style[]) => {
  const classNames: string[] = []
  const cssProperties: NestedCSSProperties[] = []
  for (const it of css) {
    if (isString(it)) {
      classNames.push(it)
    } else if (isArray(it)) {
      classNames.push(...it)
    } else if (exists(it)) {
      cssProperties.push(it)
    }
  }
  const result = [...classNames]
  if (cssProperties.length) result.push($style(...cssProperties))
  return result.length > 1 ? result : result[0]
}

export const patch = (domElemId: string) => (vnode: VNode) =>
  render(vnode, document.getElementById(domElemId) as HTMLElement)
