const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('cat');

// 2. JSON Files Mapping (Key = Category ID, Value = FileName)
const dataFiles = {
    'DDL': 'ddl.json',
    'DML': 'dml.json',
    'DQL': 'dql.json',
    'WHERE': 'where_order.json',
    'LIKE': 'like.json',
    'GROUP_BY': 'group_by.json',
    'SUBQUERIES': 'subqueries.json',
    'SCALAR': 'scalar.json',
    'JOINS': 'joins.json',
    'SET': 'set.json',
    'VIEWS': 'views.json',
    'DECISION': 'decision.json',
    'ITERATIVE': 'iterative.json',
    'DATA_RETRIEVAL': 'data_retrieval.json', 
    'PLSQL_BASICS': 'plsql_basics.json',
    'CURSORS': 'cursors.json',
    'PROCEDURES': 'procedures.json',
    'PACKAGES': 'packages.json',
    'EXCEPTIONS': 'exceptions.json',
    'TRIGGERS': 'triggers.json'
};

// 3. HTML Elements Selection
const problemList = document.getElementById('problemList');
const problemQuestion = document.getElementById('problemQuestion');
const queryDisplay = document.getElementById('queryDisplay');
const outputDisplay = document.getElementById('outputDisplay');
const welcomeMsg = document.getElementById('welcomeMsg');
const contentBox = document.getElementById('contentBox');
const catTitle = document.getElementById('catTitle');

let loadedQuestions = [];

// 4. FUNTION TO LOAD DATA
async function loadData() {
    // IF CATEGORY NOT VALID STOP
    if (!category || !dataFiles[category]) return;

    try {
        const response = await fetch(`data/${dataFiles[category]}`);
        loadedQuestions = await response.json();
        
        // CLEAR SLIDE BAR LIST
        problemList.innerHTML = '';
        let lastGroup = ""; 

        loadedQuestions.forEach((prob, index) => {
            // Group Heading 
            if (prob.group && prob.group !== lastGroup) {
                const groupHeader = document.createElement('div');
                groupHeader.className = 'group-header';
                groupHeader.innerText = `→ ${prob.group.split('(')[0].trim()}`;
                problemList.appendChild(groupHeader);
                lastGroup = prob.group;
            }

            const li = document.createElement('li');
            li.className = 'sub-problem';
            li.innerText = `Problem ${index + 1}`; 
            li.onclick = () => showProblem(index);
            problemList.appendChild(li);
        });

        // Top bar Title Update (With Total Count)
        catTitle.innerText = `${category.replace('_', ' ')} Problems - ${loadedQuestions.length}`;

    } catch (error) {
        console.error("Data load error:", error);
    }
}

function showProblem(index) {
    const data = loadedQuestions[index];
    
    welcomeMsg.style.display = 'none';
    contentBox.style.display = 'block';

    problemQuestion.innerText = data.question;
    queryDisplay.innerText = data.query;

    if (data.output_table && data.output_table.length > 0) {
        let tableHTML = `<table class="oracle-table"><thead><tr>`;
        
        Object.keys(data.output_table[0]).forEach(key => {
            tableHTML += `<th>${key.toUpperCase()}</th>`;
        });
        tableHTML += `</tr></thead><tbody>`;
        
        // Dynamic Table Rows
        data.output_table.forEach(row => {
            tableHTML += `<tr>`;
            Object.values(row).forEach(val => {
                // Handling null values
                tableHTML += `<td>${val === null ? '<i>(null)</i>' : val}</td>`;
            });
            tableHTML += `</tr>`;
        });
        tableHTML += `</tbody></table>`;
        outputDisplay.innerHTML = tableHTML;
    } else {
        outputDisplay.innerText = data.output || "No output preview available.";
    }
}

// 6. Initialization
loadData();