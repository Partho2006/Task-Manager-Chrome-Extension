document.getElementById('addTask').addEventListener('click', function() {
    const task = document.getElementById('text').value;
    const dueTime = document.getElementById('dueTime').value;

    if (task && dueTime) {
        const taskId =  Date.now().toString();
        chrome.storage.sync.get({ tasks: [] }, function(result) {
            const tasks = result.tasks;
            tasks.push({ id: taskId, task, dueTime });
            chrome.storage.sync.set({ tasks }, function() {
                console.log("Task Saved", task);
                alert("Task Saved");
            })
        })
        addTasktoUI(taskId, task, dueTime)
    } else {
        alert("Please enter a task and dueTime!");
    }
}); 
// Jay Shree Ram

function addTasktoUI(taskId, task, dueTime) {
    const tasksDiv = document.getElementById("tasks");
    const taskDiv = document.createElement("div");
    taskDiv.className = "task-item";
    taskDiv.innerHTML = `
    <div>
    <strong>${task}</strong> 
    <br />
    <span>Due ${new Date(dueTime).toLocaleString()}</span>
    </div>
    <button class="remove-task" data-id="${taskId}">Remove</button>
    `;
    tasksDiv.appendChild(taskDiv);

// Add event listener for remove button
taskDiv.querySelector(".remove-task").addEventListener("click", function() {
    removeTask(taskId, taskDiv)
});
}

//remove task
function removeTask(taskId, taskDiv) {
    chrome.storage.sync.get({tasks: []}, function(result) {
        const tasks = result.tasks.filter(t => t.id !== taskId);
        chrome.storage.sync.set({tasks}, function() {
            console.log("Task Removed", taskId);
        });
    });

    taskDiv.remove();
}

//Load saved tasks
chrome.storage.sync.get({tasks: []}, function(result) {
    const tasks = result.tasks;
    tasks.forEach(function(taskObj) {
        addTasktoUI(taskObj.id, taskObj.task, taskObj.dueTime)
    });
});