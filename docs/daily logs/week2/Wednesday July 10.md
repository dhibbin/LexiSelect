# Wednesday July 10

Setting up settings panel with Vuetify
- Took roughly over 1.5 hours
- Vuetify instantiates wrappers for when the HTML template is rendered to the screen, meaning that if you want to have control over padding for the wrappers you have to set them in a separate .CSS file. For some reason doing it within the `style` tag of a `.vue` SFC doesn't work.
- Will need to consider what UI design I want to go for and reconsider using Vuetify

Researching other VueJS UI frameworks and reconsidering the design of the app
- Took roughly 3 hours
- Looked into PrimeVue, Quasar and NaiveUI to see exactly how creating the same UI that I was trying to create in Vuetify would work. NaiveUI seemed to be the best so I forked the repository and tried out creating a side panel with settings and a main content area using NaiveUI. 
- NaiveUI doesn't have the class modifiers that Bootstrap/Vuetify have, such as `d-flex, flex-column etc.`, so its much more frustrating to create elements that expand to fill out the page
- After spending a long time trying out NaiveUI I decided to admit defeat and return to Vuetify

Researching how to customise Vuetify to bring it away from material design
- Took roughly 1 hour
- Looked into changing the font which seemed much harder than it should be according to resources online. Turns out it actually required only a few lines in `.scss` 
- Followed [this article](https://blog.logrocket.com/building-dynamic-vuetify-themes/) on creating dynamic themes in Vuetify
- Setup input field for IP addresses in the settings menu
- Ready to actually make some progress tomorrow