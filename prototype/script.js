async function SendPrompt(prompt) {
    prompt = "<|user|>" + prompt + "<|end|>"
    
    let response = await fetch("http://127.0.0.1:8080/completion", {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n_predict: 50,
            n_probs : 10
        })
    })

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json())
}

async function typeWriter(text, speed, element) {
    var i = 0;

    return new Promise((resolve) => {
        function helper() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(helper, speed);
            }
            else {
                resolve();
            }
        }
        helper();
    });
}

async function OutputPrompt(response) {
    for (let i = 0; i < response.completion_probabilities.length; i++) {
        let temp = document.getElementById("head");
        let clone = temp.content.cloneNode(true);   
        let button = clone.querySelector('button');
        document.getElementById("outputBoxList").appendChild(clone);
        console.log(clone);
        await typeWriter(response.completion_probabilities[i].content, 10, button);
        console.log(i);
    }
}



document.addEventListener("DOMContentLoaded", function() {
    // Your code here will run once the DOM is fully loaded
    console.log("Document Object loaded");
});

document.getElementById("GenerateButton").addEventListener("click", async function() {
    var input = document.getElementById("TextPrompt").value;

    try {
        var output = await SendPrompt(input);
      } catch (error) {
        console.error('An error occurred:', error);
      }

    OutputPrompt(await output);
    //typeWriter((await output), 50, "output1")
});

