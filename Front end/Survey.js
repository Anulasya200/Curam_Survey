const API_BASE = 'http://localhost:8080/survey'; // adjust if needed

const surveyListDiv = document.getElementById('surveyList');
const addSurveyBtn = document.getElementById('addSurveyBtn');
const surveyFormContainer = document.getElementById('surveyFormContainer');
const surveyForm = document.getElementById('surveyForm');
const questionsContainer = document.getElementById('questionsContainer');
const addQuestionBtn = document.getElementById('addQuestionBtn');
const cancelBtn = document.getElementById('cancelBtn');

let surveys = [];
let editingSurveyId = null;

function fetchSurveys() {
  fetch(`${API_BASE}/getAll`)
    .then(res => res.json())
    .then(data => {
      surveys = data;
      renderSurveyList();
    })
    .catch(err => {
      surveyListDiv.innerHTML = `<p style="color:red;">Failed to load surveys</p>`;
      console.error(err);
    });
}

function renderSurveyList() {
  if (!surveys.length) {
    surveyListDiv.innerHTML = '<p>No surveys found.</p>';
    return;
  }
  surveyListDiv.innerHTML = '<ul>' +
    surveys.map(s => `<li>
      <strong>${s.surveyName}</strong> by ${s.createdBy} 
      <button onclick="editSurvey(${s.id})">Edit</button> 
      <button onclick="deleteSurvey(${s.id})">Delete</button>
    </li>`).join('') +
    '</ul>';
}

function editSurvey(id) {
  const survey = surveys.find(s => s.id === id);
  if (!survey) return alert('Survey not found');

  editingSurveyId = id;
  showForm();
  surveyForm.surveyName.value = survey.surveyName;
  surveyForm.createdBy.value = survey.createdBy;

  questionsContainer.innerHTML = ''; // clear questions (you can extend to load real questions if backend supports)
}

function deleteSurvey(id) {
  if (!confirm('Are you sure you want to delete this survey?')) return;

  fetch(`${API_BASE}/deleteSurvey/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('Delete failed');
      alert('Deleted successfully');
      fetchSurveys();
    })
    .catch(err => alert(err.message));
}

function showForm() {
  surveyFormContainer.classList.remove('hidden');
  addSurveyBtn.disabled = true;
  surveyListDiv.style.pointerEvents = 'none';
}

function hideForm() {
  surveyFormContainer.classList.add('hidden');
  addSurveyBtn.disabled = false;
  surveyListDiv.style.pointerEvents = 'auto';
  surveyForm.reset();
  questionsContainer.innerHTML = '';
  editingSurveyId = null;
}

// Dynamic question creation
function addQuestion() {
  const qIndex = questionsContainer.children.length;

  const div = document.createElement('div');
  div.className = 'question-block';
  div.dataset.index = qIndex;

  div.innerHTML = `
    <label>Question Text:
      <input type="text" name="questionText" required />
    </label>
    <label>Answer Type:
      <select name="answerType" required>
        <option value="textField">Text Field</option>
        <option value="textArea">Text Area</option>
        <option value="radio">Radio Buttons</option>
        <option value="checkbox">Checkboxes</option>
      </select>
    </label>
    <div class="options-container" style="display:none;">
      <label>Options (up to 5):</label>
      <div class="options-list"></div>
      <button type="button" class="addOptionBtn">Add Option</button>
    </div>
    <button type="button" class="removeQuestionBtn">Remove Question</button>
  `;

  questionsContainer.appendChild(div);

  const answerTypeSelect = div.querySelector('select[name="answerType"]');
  const optionsContainer = div.querySelector('.options-container');
  const optionsList = div.querySelector('.options-list');
  const addOptionBtn = div.querySelector('.addOptionBtn');
  const removeQuestionBtn = div.querySelector('.removeQuestionBtn');

  answerTypeSelect.addEventListener('change', () => {
    if (answerTypeSelect.value === 'radio' || answerTypeSelect.value === 'checkbox') {
      optionsContainer.style.display = 'block';
    } else {
      optionsContainer.style.display = 'none';
      optionsList.innerHTML = '';
    }
  });

  addOptionBtn.addEventListener('click', () => {
    if (optionsList.children.length >= 5) {
      alert('Max 5 options allowed');
      return;
    }
    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.className = 'option-input';
    optionInput.name = 'option';
    optionInput.placeholder = `Option ${optionsList.children.length + 1}`;
    optionInput.required = true;
    optionsList.appendChild(optionInput);
  });

  removeQuestionBtn.addEventListener('click', () => {
    div.remove();
  });
}

addSurveyBtn.onclick = () => {
  showForm();
};

addQuestionBtn.onclick = () => {
  addQuestion();
};

cancelBtn.onclick = () => {
  hideForm();
};

surveyForm.onsubmit = (e) => {
  e.preventDefault();

  const surveyName = surveyForm.surveyName.value.trim();
  const createdBy = surveyForm.createdBy.value.trim();

  // Build questions array
  const questionBlocks = [...questionsContainer.children];
  const questions = [];

  for (const qDiv of questionBlocks) {
    const questionText = qDiv.querySelector('input[name="questionText"]').value.trim();
    const answerType = qDiv.querySelector('select[name="answerType"]').value;

    if (!questionText) {
      alert('Please enter all question texts');
      return;
    }

    const question = {
      questionText,
      answerType,
      options: []
    };

    if (answerType === 'radio' || answerType === 'checkbox') {
      const optionInputs = qDiv.querySelectorAll('input[name="option"]');
      for (const optInput of optionInputs) {
        if (optInput.value.trim() === '') {
          alert('Please fill all option values');
          return;
        }
        question.options.push(optInput.value.trim());
      }
      if (question.options.length === 0) {
        alert('Please add at least one option');
        return;
      }
    }

    questions.push(question);
  }

  // Prepare survey data to send (stringify questions)
  const surveyData = {
    surveyName,
    createdBy,
    questions: JSON.stringify(questions)
  };

  // POST to backend
  fetch(`${API_BASE}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(surveyData)
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save survey');
      return res.json();
    })
    .then(data => {
      alert('Survey saved successfully!');
      hideForm();
      fetchSurveys();
    })
    .catch(err => {
      alert(err.message);
      console.error(err);
    });
};

// Load surveys initially
fetchSurveys();
