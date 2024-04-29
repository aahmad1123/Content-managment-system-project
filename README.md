# Content-managment-system-project
building a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and PostgreSQL. I worked on this application with my tutor, Robert Kurle Jr. on March 19th, 2024. I first constructed some basic queries in PostgreSQL's management application, pgAdmin, and used them to construct my queries and schemas in the db folder. Then I worked on the index.js file's prompts one by one. The first prompt i worked on was the main menu of the application, which required a relatively simple if-else if-else structure to branch into specified functions. Then I worked on the view functions, which took in the queries I wrote in queries.sql. I had trouble getting them to display properly at first before finally settling into console.table(res.rows) to display the results in the format the video for the challenge showed. Then I worked on the add functions. Each one got progressively more difficult as they required more callbacks than the previous one. I found add employee especially challenging to program as it both required a lot of responses to be passed through to the final insert as well as made me find a way to translate picking a string answer and having that answer translate into an id # to properly populate the table. Finally I worked on the update employee function. This function also had similar challenges to the add employee function, but took less time to untangle as there were less callbacks involved. 
