import request from 'superagent'
import 'shoelace-css/dist/shoelace.css'
import './styles.css'
import uuid from 'uuid/v4'

// request initial notes from database
window.addEventListener('load', function () {
  request.get('https://notes-api.glitch.me/api/notes')
    .auth('twilson', 'password1')
    .then(response => {
      let results = response.body.notes
      console.log(results)
      addNotesToPage(results)
    })
})

// event listener for submit button
document.getElementById('entry-form').addEventListener('submit', event => {
  event.preventDefault()
  // state what information is within each note
  let noteData = {
    title: document.getElementById('note-title').value.trim(),
    text: document.getElementById('note-text').value
    // tags: document.getElementById('tags')
  }
  let entryForm = document.getElementById('entry-form')
  // send notes be sent to server
  request.post('https://notes-api.glitch.me/api/notes')
    .auth('twilson', 'password1')
    .send(noteData)
    .then(response => {
      document.getElementById('entry-form').reset()
      let results = response.body
      console.log(response.body)
      makeNotesDiv(results)
    })
  entryForm.reset()
})

function addNotesToPage (results) {
  let resultsDiv = document.getElementById('notes-list')
  resultsDiv.innerHTML = ''
  for (var result of results) {
    makeNotesDiv(result)
  }
}

function makeNotesDiv (result) {
  let resultsDiv = document.getElementById('notes-list')
  let noteDiv = document.createElement('div')
  noteDiv.classList.add('note')
  let outputDiv = `
        <h4 class="result-title">${result.title}</h4>
        <p class="result-text">${result.text}</p>
    `
  noteDiv.id = `${result._id}`
  let deleteLink = document.createElement('a')
  deleteLink.href = '#'
  deleteLink.classList.add('text-danger')
  deleteLink.innerText = 'x'
  deleteLink.addEventListener('click', event => {
    deleteNote(result)
  })
  noteDiv.innerHTML = outputDiv
  noteDiv.appendChild(deleteLink)
  console.log('make notes div')
  resultsDiv.appendChild(noteDiv)
}

function deleteNote (result) {
  request.delete(`https://notes-api.glitch.me/api/notes/${result._id}`)
    .auth('twilson', 'password1')
    .then(response => {
      document.getElementById(`${result._id}`).remove()
    })
}
