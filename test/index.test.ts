import {tag, newlineToBr, br, VNodeData} from "src"
import {assert} from "chai"

describe("tag", () => {
  it("should create an empty tag with no args", () => {
    const vnode = tag("div")()
    assert.strictEqual(vnode.sel, "div")
  })
  it("should set content with 1 string arg", () => {
    const vnode = tag("div")("hello world!")
    assert.strictEqual(vnode.text, "hello world!")
  })
  it("should set class and content with 2 string args", () => {
    const vnode = tag("div")("title", "hello world!")
    assert.strictEqual(vnode.sel, "div.title")
    assert.strictEqual(vnode.text, "hello world!")
  })
  it("should set data with an object argument", () => {
    const vnode = tag("div")({style: {color: "red"}})
    assert.strictEqual(vnode.data!.style!.color, "red")
  })
  it("should set data and content with 2 args when 1st is an object", () => {
    const vnode = tag("div")({style: {color: "red"}}, "hello world!")
    assert.strictEqual(vnode.data!.style!.color, "red")
    assert.strictEqual(vnode.text, "hello world!")
  })
  it("should set class, data and content with 3 args", () => {
    const vnode = tag("div")("title", {style: {color: "red"}}, "hello world!")
    assert.strictEqual(vnode.sel, "div.title")
    assert.strictEqual(vnode.data!.style!.color, "red")
    assert.strictEqual(vnode.text, "hello world!")
  })
})

describe("newlineToBr", () => {
  it("should convert newline chars to br tags", () => {
    assert.deepEqual(
      newlineToBr("hello\nworld"),
      ["hello", br, "world"]
    )
    assert.deepEqual(
      newlineToBr("hello\nworld\n\nhave a nice day"),
      ["hello", br, "world", br, "", br, "have a nice day"]
    )
  })
})
