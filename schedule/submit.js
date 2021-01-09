const $submit = document.querySelector("#submit");

const subjectNames = ["语文", "数学", "英语", "政治", "历史", "地理", "物理", "化学", "生物", "信息", "通用", "美术", "体育"]

$submit.addEventListener("click", function () {
  const classSelected = selectors.map(s => s.value);
  const classFiltered = classSelected.filter(s => s !== "-")
  if (classFiltered.length !== 6) {
    alert(`您一定就是7选${classFiltered.length - 3}选手吧！`);
    return;
  }
  /**
   * 学生行政班级
   */
  const adminClass = classSelected[0]
  /** 
   * @typedef {{className: string, init: boolean}} SelectedClass 
   */
  /**
   * 选课状态
   * @type {{[key :string]: SelectedClass}}
   */
  const selectedSubjectData = {};
  classSelected.forEach((className, idx) => {
    if (className === "-") return;
    selectedSubjectData[subjectNames[idx]] = { className, init: false }
    //  技术两门
    if (idx === 9) {
      selectedSubjectData[subjectNames[10]] = { className, init: false }
    }
    // 语文、体育、美术同班
    if (idx === 0) {
      selectedSubjectData[subjectNames[12]] = { className, init: true }
      selectedSubjectData[subjectNames[11]] = { className, init: false }
    }
  })

  document.body.innerHTML = `<table cellspacing="0" border="1"><tbody>${`<tr>${"<td></td>".repeat(9)}</tr>`.repeat(8)}</tbody></table>`
  const $table = document.querySelector("table")
  function setCellContent(col, row, content) {
    $table.children[0].children[row].children[col].innerHTML = content
  }

  // 首行
  setCellContent(0, 0, "时间")
  for (let i = 1; i < 6; i++) {
    setCellContent(i, 0, "星期" + "一二三四五"[i - 1])
  }


  // 首列
  for (let i = 1; i < 8; i++) {
    setCellContent(0, i, i)
  }

  // 为右侧排课做准备
  const selectedSubjectName = subjectNames.filter(subject => selectedSubjectData[subject])

  for (let day = 0; day < schedule.length; day++) {
    /** @type {string[][]} */
    const daySchedule = schedule[day]
    for (let classNum = 0; classNum < daySchedule.length; classNum++) {
      const classSchedule = daySchedule[classNum];
      for (let index = 0; index < classSchedule.length; index++) {
        const classRaw = classSchedule[index].split("\n");
        const classTexts = classRaw.filter((_, i) => i % 3 === 0);
        const subjects = classTexts.map(t => (t.match(/[^\x00-\xff]+/) || [""])[0]);
        const classNames = classTexts.map(t => (t.match(/[\x00-\xff]+/) || [""])[0]);

        if (classRaw.join("").includes("8A")) console.log(classRaw, classTexts)
        // 单双周
        if (classTexts.length === 2
          && Object.keys(selectedSubjectData).some(subject => {
            const isSubjectSelected = subjects[0].includes(subject)
            if (!isSubjectSelected) return false
            const isClassMatched = classNames[0] === selectedSubjectData[subject].className
            return isClassMatched
          })
        ) {
          setCellContent(day + 1, classNum + 1, subjects.join("\n"))
          continue
        }
        // 语文
        if (subjects[0] === "语文" && classRaw[2].includes("（" + adminClass.toString() + "）")) {
          setCellContent(day + 1, classNum + 1, "语文")
          if (!selectedSubjectData[subjects[0]].init) {
            const row = selectedSubjectName.indexOf(subjects[0]);
            setCellContent(6, row, subjects[0] + selectedSubjectData[subjects[0]].className);
            setCellContent(7, row, classRaw[2]);
            setCellContent(8, row, classRaw[1]);
          }
          continue
        }
        // 体育
        if (classRaw[0].includes("体育") && new RegExp(`[^0-9]${adminClass}[^0-9]`).test(classRaw[0])) {
          setCellContent(day + 1, classNum + 1, "体育")
        }
        //  美术
        if (classRaw[0].includes("美术") && classRaw[0] === `美术${adminClass}班`) {
          setCellContent(day + 1, classNum + 1, "美术")
          if (!selectedSubjectData[subjects[0]].init) {
            const row = selectedSubjectName.indexOf(subjects[0]);
            setCellContent(6, row, subjects[0] + selectedSubjectData[subjects[0]].className);
            setCellContent(7, row, classRaw[2]);
            setCellContent(8, row, classRaw[1]);
          }
        }
        // 其他科目
        if (Object.keys(selectedSubjectData).some(subject => {
          const isSubjectSelected = subjects[0].includes(subject);
          if (!isSubjectSelected) return false;
          const classTarget = selectedSubjectData[subject].className
          const isClassMatched = classNames[0] === classTarget
          return isClassMatched
        })) {
          setCellContent(day + 1, classNum + 1, subjects[0])
          if (!selectedSubjectData[subjects[0]].init) {
            const row = selectedSubjectName.indexOf(subjects[0]);
            setCellContent(6, row, subjects[0] + selectedSubjectData[subjects[0]].className);
            setCellContent(7, row, classRaw[2]);
            setCellContent(8, row, classRaw[1]);
          }
          continue
        }
        // 自己班的自习
        if (classTexts[0] === "自习" && classRaw[1].includes("（" + adminClass.toString() + "）")) {
          setCellContent(day + 1, classNum + 1, "自习")
          continue
        }
      }
    }
  }
  document.body.style.fontSize = ""
  alert("生成完毕\n- 刷新即可重置\n- Ctrl+P 即可打印")
})

