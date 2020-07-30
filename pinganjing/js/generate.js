function generateHTML(dataSets, bookName, bookType) {
    const $root = document.createElement("div");
    const $bookTitle = document.createElement("h1")
    $bookTitle.innerHTML = bookName + bookType
    dataSets.forEach(n => {
        const $h = document.createElement("h2")
        $h.innerHTML = n.title + bookName
        const $p = document.createElement("p")
        $p.innerHTML = n.data.join(bookName + "，") + bookName + "。"
        $root.appendChild($h)
        $root.appendChild($p)
    })
    return $root
}

function generateMarkdown(dataSets, bookName, bookType) {
    let s = "# " + bookName + bookType + "\n\n"
    dataSets.forEach(n => {
        s += "\n\n## " + n.title + "\n\n"
        s += n.data.join(bookName + "，") + bookName + "。"
    })
    return s
}