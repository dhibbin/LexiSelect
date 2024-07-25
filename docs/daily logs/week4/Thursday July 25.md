# Thursday July 25

Linking textareas to their branch
- Took roughly 1.5 hours
- Wrote up a function that goes through the textarea when its contents are modified, finding the modified token and updating the content of the respective token in that branch of the TextTree SFC
- Some problems with displaying alternative tokens after modification that need to be addressed

Continuing adding features
- Took roughly 4 hours
- Tried re-wrtiing the function I wrote for tracking textArea changes to use the selection position instead of nested for loops to locate the change, however I decided to go back on it since I thought it would be more prone to issues 
- Tried continuing generation upon creating a new branch which was surpisingly difficult. I tried passing the `startGeneration` function to TextBranch but that didn't work since it needs to be called on an instance
- So I exposed the function and tried to pass the instance of the TextBar to the TextTree component but that wouldn't work since it wouldn't accept the type of the TextBar instance as a prop
- So I instead just put the functionality alongside the newbranch emit however when I called the exposed function it caused an error that made me believe it was being called statically
- Turns out there was actually a recursive dependency so I made the function wait before calling to remove the dependency 
- Then I tried to animate new tokens being put onto the screen like chatGPT. I thought I could delay them being shown by placing an `await delay` within the computed function of the tokens variable inside of TextBranch. 
- This sent me down a rabbit hole of trying to get an asynchronous computed function to delay and return recursively until reaching the end of a list. Eventually I decided that this was not the best way to animate it and I discarded the changes.
- Instead I tried creating a list of booleans that get set to true with an increasing delay to emulate the chatGPT style revealing of tokens. However this didn't work for some reason and I will diagnose this tomorrow.