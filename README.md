# EJS-to-do-list
https://floating-badlands-18217.herokuapp.com/ 
Apart being a simple to do list, with EJS templating will every customized to do list with their own subject and their own related tasks to it dynamically rendered. With the loop everything that we add into the input gets rendered with a square to cross off the task to the current list we see. Once we check that task it gets deleted from the database mongoDB. Because every data that we get from the input is attached to the checkbox which hold a attribute of value called the id from the database that creates automatically one own unique id for every object. So we can check with the find method of mongoose in the database to lastly find and remove it from the list.  Params and lodash is use like in the blog project explained

