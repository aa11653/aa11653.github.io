class Selector {
  constructor(class_, descriptionType) {
    this.className = class_
    this.discriptionType = descriptionType
    this.$selector = document.createElement("div");
    this.$selector.innerHTML = `
      <span>${class_}：</span>
      <select>
        ${descriptionHTML[descriptionType]}
      </select>
    `
    this.$selector.className = "selector"
    this.$select = this.$selector.querySelector("select")
    this.value = descriptionContent[descriptionType][0]
    this.$select.addEventListener("change", () => {
      this.value = this.$select.value;
    })
  }
  append($parent) {
    $parent.appendChild(this.$selector)
  }
}


const descriptionContent = [
  new Array(12).fill(0).map((_, i) => "" + (i + 1)),
  new Array(12).fill(0).map((_, i) => "" + (i + 1) + "AB"[(i + 1) % 2]),
  ["-", ...new Array(7).fill(0).map((_, i) => "A" + (i + 1))]
]
function createDescriptionHTML(arr) { return arr.map(option => `<option value="${option}">${option}</option>`) }
const descriptionHTML = descriptionContent.map(createDescriptionHTML)


const classNames = ["语文", "数学", "英语", "政治", "历史", "地理", "物理", "化学", "生物", "技术"]
const descriptionTypeMap = [0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
const $form = document.querySelector("#form")
const selectors = classNames.map((name, idx) => {
  const s = new Selector(name, descriptionTypeMap[idx]);
  s.append($form)
  return s
})