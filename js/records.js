let bst;

let popup = document.getElementById("popup");
let popupTitle = document.getElementById("popup-title");
let popupBtn = document.getElementById("popupBtn");

let editingRow = null;

function openPopup() {
    document.getElementById("popup-title").innerText = "Add Student Records";
    document.getElementById("popupBtn").innerText = "ADD";
    document.getElementById("studentIndex").value = '';
    document.getElementById("studentName").value = '';
    document.getElementById("studentProgram").value = '';

    const modulesContainer = document.getElementById('modulesContainer');
    modulesContainer.innerHTML = '';

    const moduleGradePair = document.createElement('div');
    moduleGradePair.classList.add('moduleGradePair');
    moduleGradePair.innerHTML = `
        <input type="text" placeholder="Module Name" class="moduleName">
        <input type="text" placeholder="Grade" class="moduleGrade">
    `;
    modulesContainer.appendChild(moduleGradePair);

    popup.classList.add("open-popup");
    editingRow = null; 
}

function closePopup() {
    popup.classList.remove("open-popup");
}

window.onclick = function (event) {
    if (event.target === popup) {
        closePopup();
    }
};

function editRow(button) {
    popupTitle.innerText = "Edit Student Records";
    popupBtn.innerText = "UPDATE";
    let row = button.parentElement.parentElement;
    let cells = row.getElementsByTagName("td");

   let studentId = row.getAttribute('data-id');

    const studentIndex = cells[1].innerText;
    const studentName = cells[2].innerText;
    const studentProgram = cells[3].innerText;

    document.getElementById("studentIndex").value = studentIndex;
    document.getElementById("studentName").value = studentName;
    document.getElementById("studentProgram").value = studentProgram;

    const modulesContainer = document.getElementById('modulesContainer');
    modulesContainer.innerHTML = '';

    const studentNode = bst.find(parseInt(studentId, 10));
    console.log(studentNode);
    if (studentNode) {
        studentNode.student.modules.forEach(module => {
            const moduleGradePair = document.createElement('div');
            moduleGradePair.classList.add('moduleGradePair');
            moduleGradePair.innerHTML = `
                <input type="text" value="${module.name}" placeholder="Module Name" class="moduleName">
                <input type="text" value="${module.grade}" placeholder="Grade" class="moduleGrade">
            `;
            modulesContainer.appendChild(moduleGradePair);
        });
    }

    editingRow = row;
    popup.classList.add("open-popup");
}


document.addEventListener('DOMContentLoaded', () => {
    const studentListTable = document.getElementById('studentList');
    bst = new BST();

    bst.loadFromLocalStorage();

    function displayStudents() {
        const sortedStudents = bst.inorder();
        studentListTable.innerHTML = '';
        sortedStudents.forEach((student, index) => {
            const modulesWithGrades = student.modules.map(module => `${module.name}: ${module.grade}`).join(', ');
            const row = `<tr data-id="${student.id}">
                            <td>${index + 1}</td>
                            <td>${student.index}</td>
                            <td>${student.name}</td>
                            <td>${student.program}</td>
                            <td>
                                <i class="ri-eye-fill"></i>
                                <i class="ri-pencil-fill butto" onclick="editRow(this)"></i>
                                <i class="ri-delete-bin-2-fill butto" onclick="deleteRow(this)"></i>
                            </td>
                        </tr>`;
            studentListTable.insertAdjacentHTML('beforeend', row);
        });
    }

    window.addStudent = function () {
        const studentId = Date.now();  
        const studentIndex = document.getElementById('studentIndex').value;
        const studentName = document.getElementById('studentName').value;
        const studentProgram = document.getElementById('studentProgram').value;

        const modules = [];
        document.querySelectorAll('.moduleGradePair').forEach(pair => {
            const moduleName = pair.querySelector('.moduleName').value;
            const moduleGrade = pair.querySelector('.moduleGrade').value;
            modules.push({ name: moduleName, grade: moduleGrade });
        });

        const newStudent = {
            id: studentId,
            index: studentIndex,
            name: studentName,
            program: studentProgram,
            modules: modules
        };

        bst.insert(newStudent);
        displayStudents();

        closePopup();
    }

    window.addModule = function () {
        const moduleGradePair = document.createElement('div');
        moduleGradePair.classList.add('moduleGradePair');
        moduleGradePair.innerHTML = `
            <input type="text" placeholder="Module Name" class="moduleName">
            <input type="text" placeholder="Grade" class="moduleGrade">
        `;
        document.getElementById('modulesContainer').appendChild(moduleGradePair);
    }

    window.updateStudent = function () {
        if (editingRow) {
            const studentIndex = document.getElementById('studentIndex').value;
            const studentName = document.getElementById('studentName').value;
            const studentProgram = document.getElementById('studentProgram').value;
            
            const modules = [];
            document.querySelectorAll('.moduleGradePair').forEach(pair => {
                const moduleName = pair.querySelector('.moduleName').value;
                const moduleGrade = pair.querySelector('.moduleGrade').value;
                modules.push({ name: moduleName, grade: moduleGrade });
            });
            
            const studentId = editingRow.getAttribute('data-id'); 
    
            const updatedStudent = {
                id: studentId,
                index: studentIndex,
                name: studentName,
                program: studentProgram,
                modules: modules
            };
            
            bst.update(studentId, updatedStudent); 
            displayStudents(); 
            closePopup();
        }
    }

    window.deleteRow = function (button) {
        const row = button.parentElement.parentElement;
        const studentId = row.getAttribute('data-id');
        
        bst.remove(studentId);  
        displayStudents();  
    }
    
    popupBtn.addEventListener('click', () => {
        if (popupBtn.innerText === 'UPDATE') {
            window.updateStudent();
        }
        else {
            window.addStudent();
        }
    });


    displayStudents();
});

