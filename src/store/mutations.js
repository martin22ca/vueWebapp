export function setTitle(state, { title,icon }) {
  state.title = title
  state.titleIcon = icon
}

export function setClass(state, { classId }) {
  state.classId = classId
}

export function setDate(state, { date }) {
  state.attDate = date
}

export function setMyClasses(state, { myClasses }) {
  state.myClasses = myClasses
}

export function setEditItem(state, { newEditedObj }) {
  state.editedObj = newEditedObj
}