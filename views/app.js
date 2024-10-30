const graphRef = document.getElementById("chart");

// Listening for if the specific element is clicked and calling the correspond functions if it is
document.getElementById('addButton').addEventListener('click', addDatapoint);
document.getElementById('removeButton').addEventListener('click', removeDatapoint);

// new instance of the chart that is preloading every time
const chart = new Chart(graphRef, {
    type: "bar",
    data: {
        labels: ["Green", "Red", "Blue"],
        datasets: [{ label: "Buttons", data: [2, 1, 0] }], 
    },
});

// async function to retrieve data from the api endpoint
async function getData() {
    const buttonReq = await fetch(`/api/buttons/data`);
    const buttonData = await buttonReq.json();

    const colors = {};
    for (let i = 0; i < buttonData.length; i++) {
        const buttonColor = buttonData[i];
        colors[buttonColor] ||= 0;
        colors[buttonColor]++;
    }

    chart.data = {
        labels: Object.keys(colors),
        datasets: [{ label: "Buttons", data: Object.values(colors) }],
    };

    chart.update();
}

getData();

function addDatapoint() {

    // retrieving the values for the element Id with error checking
    const labelValue = document.getElementById("label").value.trim();
    const numValue = parseInt(document.getElementById("num").value);

    // error check is there is no label and if numValue is not a number
    if (!labelValue || isNaN(numValue)) {
        alert("Enter a valid label and a positive number.");
        return;
    }

    // going through the data to find the specific label value
    const labelIndex = chart.data.labels.indexOf(labelValue);
    
    // if label doesn't exist (returns -1). It then adds the label and pushes the value with it if it does exist.
    if (labelIndex === -1) {
        chart.data.labels.push(labelValue);
        chart.data.datasets[0].data.push(numValue); 
    } else {
        // if it does exist add on the value to it.
        chart.data.datasets[0].data[labelIndex] += numValue;
    }
    
    // update the chart with new values, if any
    chart.update();

    // clear values for each so it can be used next time
    document.getElementById("label").value = '';
    document.getElementById("num").value = '';

    //Request is sent to this endpoint as a post 
    fetch('/api/buttons/data/new', {
        method: 'POST',
        // tells the server that it is being sent in JSON format
        headers: {
            'Content-Type': 'application/json',
        },
        // converting JS object to a JSON string
        body: JSON.stringify({ value: { label: labelValue, value: numValue } }),
    })
    // checking if the response was successful
    .then(response => {
        if (!response.ok) {
            // throw error if response is not successful
            throw new Error("Failed to add data point");
        }
        // convert back to JS object
        return response.json();
    })
    // if any erros occur during the process
    .catch(error => {
        alert(error);
    });
}

function removeDatapoint() {

    // retrieving the values for the element Id with error checking
    const removeLabelValue = document.getElementById("removeLabel").value.trim();
    const removeCount = parseInt(document.getElementById("removeCount").value);

    // if no value is found for label. Throw an alert
    if (!removeLabelValue) {
        alert("Please enter a label to remove.");
        return;
    }

    // if removeCount is not a number and is less than and equal to zero. Throw alert
    if (isNaN(removeCount) || removeCount <= 0) {
        alert("Please enter a valid number of points to remove.");
        return;
    }

    // get specific index for label 
    const index = chart.data.labels.indexOf(removeLabelValue);

    // if no specific index is found. Throw alert
    if (index === -1) {
        alert("Label not found.");
        return;
    }

    //if the index is greater than the remove count variable. (Checking if we can even remove the amount inputted). If not throw alert
    if (chart.data.datasets[0].data[index] >= removeCount) {
        chart.data.datasets[0].data[index] -= removeCount;
    } else {
        alert("Not enough data points to remove for this label.");
        return;
    }

    chart.update();

    // request is sent as a delete HTTP method
    fetch('/api/buttons/data/delete', {
        method: 'DELETE',
        // The server expects to receive JSON from the client 
        headers: {
            'Content-Type': 'application/json',
        },
        // converting JS object in JSON string
        body: JSON.stringify({ value: removeLabelValue, count: removeCount }), 
    })
    // checking if the response was successful
    .then(response => {
        if (!response.ok) {
            // throw error if the response was not successful
            throw new Error("Failed to remove data point from API");
        }
        // convert Json string to JS object
        return response.json();
    })
    // catching any errors that occur
    .catch(error => {
        alert(error);
    });

    // Clear input fields after removal
    document.getElementById("removeLabel").value = '';
    document.getElementById("removeCount").value = '';
}