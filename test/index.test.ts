import {assert} from "chai"
import {h1, VNode} from "src"

describe("h1", () => {
  it("should return a h1", () => {
    assert.propertyVal(h1(), "sel", "h1")
  })
})
