# Investigating JS Frameworks
## Considerations

This is a fairly lightweight project, so considerations surrounding servers or features designed for massive projects/websites are unnecessary.

Ideally the framework should be fairly easy to use with minimal boilerplate necessary to get it up and running. Additionally, it would be ideal for this framework to be widely used (like the big three React/Vue/Angular), since more resources for the framework would be available online and it would mean that the number of people that could contribute to the project would remain fairly high. Also having experience with a common JS framework would be good for my CV.

A non-negotiable would be compatibility with typescript, since having developed the prototype in javascript, I would not want to use a dynamically and weakly typed language for developing a professional project. Fortunately, it seems that essentially all frameworks are designed with typescript compatibility in mind for this exact reason. 

## The Big Three: React/Angular/Vue

Taking these considerations into mind, I looked into which of the big three would be most suitable for the project. [Fireship](https://www.youtube.com/@Fireship) has made multiple videos on this subject with the best being one where he makes a [todo website in several frameworks](https://www.youtube.com/watch?v=cuHDQhDhvPE). From this video, and others made by other people, I determined that angular probably wasn't the best choice. Whilst it forced you to use typescript, which is great since it guarantees 100% support for it, it was far too opinionated for this project and was too catered towards large/enterprise-scale projects. This left React/VueJS as the options for the framework.
### React
Pros
- Extremely widely used
- Large community with a vast library of add-ons for any feature you could want
- In very high demand in industry
- Excellent mobile support
Cons
- More boiler-plate required than Vue
- Decision fatigue - since React outsources much of its featureset to the community, extra decisions about which state management system to use

### VueJS
Pros
- Caters itself to smaller projects and solo developers
- Still a large community with many official plugins
- Written entirely in typescript with excellent typescript support
- Easier learning curve
Cons
- Less in demand in industry, tied in second place with Angular
### Others (such as Svelte and Solid)
Whilst all of these have their advantages and features that would be quite useful, they aren't as relevant in industry at the moment. Since this is the first time I'm using a JS framework, it is probably smart to stick with one that has a larger community. 
### Conclusion
Whilst React is more widely used than VueJS, it seems that Vue is more suited to a project on this scale. Additionally, having never worked with a JS framework before, it makes sense to start with the easiest to learn. I could easily pickup React later down the line if it was necessary. 

The next decision to be made is which UI component library to use. 

