// 标题文本框宽度自适应
const $ = document.querySelector.bind(document),
    $$ = (s) => [...document.querySelectorAll(s)];
(function () {
    const flexableInputs = $$("#title input")
    function refreshInputWidth() {
        flexableInputs.forEach(el => {
            const l = el.value.length
            el.style.width = l + "em"
        })
    }
    flexableInputs.forEach(el => el.addEventListener("input", refreshInputWidth))
})()

// 数据选取相关
const dataSelect = (function () {
    const $dataContainer = $("#dataContainer");
    const elementDataMap = new Map()
    const selectedElement = new Set()
    const selectedDataSets = new Set()
    function createDataElement(title, example) {
        const $outer = document.createElement("div");
        $outer.className = "dataBlock"
        $outer.appendChild(document.createTextNode(title))
        const $example = document.createElement("span")
        $example.className = "example"
        $example.innerHTML = example.join("/") + "…"
        $outer.appendChild($example)
        return $outer
    }
    /**
     * @this {HTMLElement}
     */
    function clickEventHandle() {
        if (selectedElement.has(this)) {
            // 如果有了，则关闭
            const d = elementDataMap.get(this)
            selectedDataSets.delete(d);
            selectedElement.delete(this)
            this.className = "dataBlock"
        } else {
            const d = elementDataMap.get(this)
            selectedDataSets.add(d);
            selectedElement.add(this)
            this.className = "dataBlock selected"
        }
    }
    // 创建 dataElement
    data.forEach(n => {
        console.log(n)
        const $el = createDataElement(n.title, n.data.slice(0, 2))
        $dataContainer.appendChild($el);
        elementDataMap.set($el, n)
        $el.addEventListener("click", clickEventHandle.bind($el))
    })
    return {
        selectedDataSets
    }
})();

// 生成有关

(function () {
    const $generateBtn = $("#generatebutton")
    const $generateContent = $("#generatedContent")
    const $downloadHTML = $("#downloadHTML")
    const $downloadMarkdown = $("#downloadMarkdown")
    const $display = $("#generatedContentDisplay")
    $generateContent.style.display = "none"
    function download(text, fileName) {
        const blob = new Blob([text]);
        const u = URL.createObjectURL(blob);
        const a = document.createElement("a")
        a.href = u
        a.download = fileName
        a.click()
    }
    function handleGenerate() {
        const textName = $("#textname").value,
            textType = $("#texttype").value
        const $gHTML = generateHTML(dataSelect.selectedDataSets, textName, textType),
            gMarkdown = generateMarkdown(dataSelect.selectedDataSets, textName, textType)
        $downloadHTML.onclick = download.bind(undefined, $gHTML.outerHTML, textName + textType + ".html")
        $downloadMarkdown.onclick = download.bind(undefined, gMarkdown, textName + textType + ".md")
        $display.contentWindow.document.body.innerHTML = $gHTML.innerHTML;
        $generateContent.style.display = ""
    }
    $generateBtn.addEventListener("click", handleGenerate)
})()