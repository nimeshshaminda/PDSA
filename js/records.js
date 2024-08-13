let bst;

let popup = document.getElementById("popup");
let popupTitle = document.getElementById("popup-title");
let popupBtn = document.getElementById("popupBtn");

let editingRow = null;

function prepareModuleDistributionData(students) {
    const moduleRanges = {};

    students.forEach(student => {
        student.modules.forEach(module => {
            const moduleName = module.name;
            const grade = parseFloat(module.grade);

            if (!moduleRanges[moduleName]) {
                moduleRanges[moduleName] = { '0-1': 0, '1-2': 0, '2-3': 0, '3-4' : 0 };
            }

            if (0 <= grade && grade <= 1) {
                moduleRanges[moduleName]['0-1']++;
            } else if (1 < grade && grade <= 2) {
                moduleRanges[moduleName]['1-2']++;
            } else if (2 < grade && grade <= 3) {
                moduleRanges[moduleName]['2-3']++;
            } else if (3 < grade && grade <= 4) {
                moduleRanges[moduleName]['3-4']++;
            }
        });
    });

    return moduleRanges;
}


function displayGradeDistribution(students) {
    const moduleDistributionData = prepareModuleDistributionData(students);

    const container = document.getElementById('chartsContainer'); 

    Object.keys(moduleDistributionData).forEach(moduleName => {
        const distributionData = moduleDistributionData[moduleName];

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = `chart_${moduleName.replace(/\s+/g, '_')}`; 
        container.appendChild(chartCanvas);

        const ctx = chartCanvas.getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(distributionData),
                datasets: [{
                    label: `${moduleName} Grade Distribution`,
                    data: Object.values(distributionData),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Grade Ranges'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Students'
                        },
                        ticks: {
                            callback: function(value) {
                                return Number.isInteger(value) ? value : ''; 
                            }
                        }
                    }
                }
            }
        });
    });
}



function openPopup() {
    document.body.classList.toggle('show-popup');
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
    document.body.classList.toggle('show-popup');
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
    const studentProgram = cells[3].getAttribute('data-id');

    console.log(studentProgram);

    document.getElementById("studentIndex").value = studentIndex;
    document.getElementById("studentName").value = studentName;
    document.getElementById("studentProgram").value = studentProgram;

    const modulesContainer = document.getElementById('modulesContainer');
    modulesContainer.innerHTML = '';

    const studentNode = bst.find(parseInt(studentId, 10));
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

function filterProgramme() {
    const selectedProgram = document.getElementById('programme').value;
    displayStudents(selectedProgram);
}

function displayStudents(filterProgramme = 'all') {
    const studentListTable = document.getElementById('studentList');
    studentListTable.innerHTML = ''; 

    const sortedStudents = bst.inorder(); 

    sortedStudents.forEach((student, index) => {
        let program = '';

        if (student.program === 'hdse') {
            program = 'Higher Diploma in Software Engineering';
        } else if (student.program === 'dse') {
            program = 'Diploma in Software Engineering';
        } else if (student.program === 'dis') {
            program = 'Diploma in Information Systems';
        }

        if (filterProgramme === 'all' || student.program === filterProgramme) {
            const row = `<tr data-id="${student.id}">
                            <td>${index + 1}</td>
                            <td>${student.index}</td>
                            <td>${student.name}</td>
                            <td data-id="${student.program}">${program}</td>
                            <td>
                                 <a href="student-details.html?id=${student.id}">
                                    <i class="ri-eye-fill"></i>
                                </a>
                                <i class="ri-pencil-fill butto" onclick="editRow(this)"></i>
                                <i class="ri-delete-bin-2-fill butto" onclick="deleteRow(this)"></i>
                            </td>
                        </tr>`;
            studentListTable.insertAdjacentHTML('beforeend', row);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const studentListTable = document.getElementById('studentList');
    bst = new BST();

    bst.loadFromLocalStorage();
    const studentsall = bst.inorder();

    console.log(studentsall);

    displayGradeDistribution(studentsall);

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
            
            const studentId = parseInt(editingRow.getAttribute('data-id'), 10); 
            console.log(studentId);
    
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
    
        const modal = document.getElementById("confirmModal");
        const confirmYes = document.getElementById("confirmYes");
        const confirmNo = document.getElementById("confirmNo");
    
        modal.style.display = "block";
 
        confirmYes.onclick = function () {
            bst.remove(studentId);
            displayStudents();
            modal.style.display = "none"; 
        }
    
        confirmNo.onclick = function () {
            modal.style.display = "none"; 
        }
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

document.querySelector('.undo-btn').addEventListener('click', function() {
    window.location.href = 'index.html';
});

