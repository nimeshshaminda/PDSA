
let bst;

function formatProgram(programCode) {
    switch (programCode) {
        case 'hdse':
            return 'Higher Diploma in Software Engineering';
        case 'dse':
            return 'Diploma in Software Engineering';
        case 'dis':
            return 'Diploma in Information Systems';
        default:
            return 'Unknown Program';
    }
}

function prepareChartData(modules) {
    const labels = modules.map(module => module.name);
    const data = modules.map(module => parseFloat(module.grade)); 

    return {
        labels: labels,
        datasets: [{
            label: 'Module Grades',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1
        }]
    };
}

function displayStudentDetails(id) {
    const student = bst.find(parseInt(id, 10));

    if (student) {
        const detailsContainer = document.getElementById('studentDetails');
        detailsContainer.innerHTML = `
            <h2>Student Details</h2>
            <p><strong>ID:</strong> ${student.student.id}</p>
            <p><strong>Index No:</strong> ${student.student.index}</p>
            <p><strong>Name:</strong> ${student.student.name}</p>
            <p><strong>Programme:</strong> ${formatProgram(student.student.program)}</p>
            <h3>Modules</h3>
            <div class="modules-container">
        ${student.student.modules && Array.isArray(student.student.modules) ?
            student.student.modules.map(module => `
                <div class="module-card">
                    <h4 class="module-name">${module.name}</h4>
                    <p class="module-grade">Grade: ${module.grade}</p>
                </div>
            `).join('') :
            '<p>No modules available.</p>'
        }
    </div>
            <div id="chartContainer">
    <canvas id="moduleGradesChart"></canvas>
</div>
        `;

     
        const ctx = document.getElementById('moduleGradesChart').getContext('2d');
        const chartData = prepareChartData(student.student.modules);

        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Modules'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Grades'
                        }
                    }
                }
            }
        });
    } else {
        document.getElementById('studentDetails').innerHTML = '<p>Student not found.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {

    bst = new BST();
    bst.loadFromLocalStorage(); 

    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');

    if (studentId) {
        displayStudentDetails(studentId);
    } else {
        document.getElementById('studentDetails').innerHTML = '<p>No student ID provided.</p>';
    }
});
