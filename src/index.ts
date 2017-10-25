
import {types, style as $style} from "typestyle"
export type NestedCSSProperties = types.NestedCSSProperties
import {VNode, Props, InfernoChildren, createVNode, render} from "inferno"
import createClass from "inferno-create-class"
import createElement from "inferno-create-element"
import {filter} from "lodash"

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
  | Array<string | number | VNode | null | void>
  | void
export type ClassName = string|string[]
export type VNode = VNode

export interface Hooks {
  insert?: (vnode: VNode) => void
  update?: (vnode: VNode) => void
}

export interface EventListeners {
  click?: (e: MouseEvent) => void,
  mouseup?: (e: MouseEvent) => void,
  mousedown?: (e: MouseEvent) => void,
  mousemove?: (e: MouseEvent) => void,
  input?: (e: KeyboardEvent) => void,
  keypress?: (e: KeyboardEvent) => void,
  blur?: (e: Event) => void,
  scroll?: (e: Event) => void
}

export interface SnabbdomProps extends Props {
  on?: EventListeners,
  hook?: Hooks
}

const hasLifecycleEvents = (props: Props): Boolean =>
  props.onComponentDidMount ||
  props.onComponentWillMount ||
  props.onComponentWillUnmount ||
  props.onComponentShouldUpdate ||
  props.onComponentWillUpdate ||
  props.onComponentDidUpdate

const convertListeners = (props: SnabbdomProps): Props => {
  if (props.on) {
    const listeners = props.on
    return {
      onclick: listeners.click,
      onmouseup: listeners.mouseup,
      onmousedown: listeners.mousedown,
      onmousemove: listeners.mousemove,
      oninput: listeners.input,
      onkeypress: listeners.keypress,
      onblur: listeners.blur,
      onscroll: listeners.scroll
    }
  }
  return {}
}

const h = (tagName: string, props?: SnabbdomProps, children?: Children): VNode => {
  let hook: Hooks|null = null
  if (children && isArray(children))
    children = filter(children, c => c !== null)
  if (props) {
    hook = props.hook
    props = {...props, ...convertListeners(props), ...props.attrs, ...props.props}
    delete props.on
    delete props.attrs
    delete props.props
    delete props.hook
  }
  if (props && hasLifecycleEvents(props)) {
    const component = createClass({
      displayName: tagName.toUpperCase() + "_" + Math.random(),
      onComponentDidMount: () => {
        if (hook && hook.insert)
          hook.insert(this._vnode)
      },
      onComponentWillMount: props.onComponentWillMount,
      onComponentWillUnmount: props.onComponentWillUnmount,
      onComponentShouldUpdate: props.onComponentShouldUpdate,
      onComponentWillUpdate: props.onComponentWillUpdate,
      onComponentDidUpdate: () => {
        if (hook && hook.update)
          hook.update(this._vnode)
      },
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
  (props: SnabbdomProps): VNode
  (props: SnabbdomProps, children: Children): VNode
  (className: ClassName, children: Children): VNode
  (className: ClassName, props: SnabbdomProps): VNode
  (className: ClassName, props: SnabbdomProps, children: Children): VNode
}

const isOneOrMoreChildren = (x: Maybe<SnabbdomProps|Children>): x is Children =>
  !!x && (isString(x) || isArray(x) || !!(x as VNode).type)

const tagArity0 = (type: string): VNode => h(type)
const tagArity1 = (type: string, a: SnabbdomProps|Children): VNode => {
  if (isOneOrMoreChildren(a))
    return h(type, null, a)
  else
    return h(type, a)
}

const classNameToString = (className: ClassName): string =>
  isString(className) ? className : className.join(" ")

const isClassname = (x: any): x is ClassName =>
  isString(x) || isArray(x)

const tagArity2 = (type: string, a: ClassName|SnabbdomProps,
                   b: SnabbdomProps|Children): VNode => {
  const props: SnabbdomProps = isClassname(a) ?
    {className: classNameToString(a)} : a
  if (isOneOrMoreChildren(b)) return h(type, props, b)
  else return h(type, {...b, ...props})
}

const tagArity3 = (type: string, a: ClassName, b: SnabbdomProps, c: Children) =>
  h(type, {className: classNameToString(a), ...b}, c)

export const tag = (type: string): HyperScriptFunc =>
  (a?: ClassName|SnabbdomProps|Children, b?: SnabbdomProps|Children, c?: Children) => {
    if (isUndefined(a))
      return tagArity0(type)
    else if (isUndefined(b))
      return tagArity1(type, a)
    else if (isUndefined(c))
      return tagArity2(type, a as ClassName|SnabbdomProps, b)
    else
      return tagArity3(type, a as ClassName, b as SnabbdomProps, c)
  }

/*    if (isUndefined(a)) {
      return h(type)
    } else if (isUndefined(b)) {
      return tagArity1(type, a)
    } else if (isString(a) || isArray(a)) {

      if (c || !isOneOrMoreChildren(b)) {
        const vnd = b as Props
        b = {...vnd, className: a}
      } else {
        c = b as Children
        b = {className: a}
      }
      return h(type, b as any, c as any)
    } else {
      return h(type, a as any, b as any)
    }*/

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
