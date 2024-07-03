async function SendPrompt(prompt) {
    let response = await fetch("http://127.0.0.1:8080/completion", {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n_predict: 500,
        })
    })
    return (await response.json()).content
}


//console.log("sup bozo")
//Test()

function typeWriter(text, speed, elementId) {
    var i = 0;
    function helper() {
        if (i < text.length) {
            document.getElementById(elementId).innerHTML += text.charAt(i);
            i++;
            setTimeout(helper, speed);
        }
    }
    helper();
}


document.addEventListener("DOMContentLoaded", function() {
    // Your code here will run once the DOM is fully loaded
    console.log("Document Object loaded");
    console.log(document.getElementById("output1").textContent);
});

document.getElementById("GenerateButton").addEventListener("click", async function() {
    var input = document.getElementById("TextPrompt").value;
    var output = await SendPrompt(input);
    console.log(output);
    typeWriter(await output, 50, "output1")
});