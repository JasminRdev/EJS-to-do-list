const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const {
    default: mongoose
} = require("mongoose");
const _ = require("lodash");

const app = express();

// let items = ["Buy food", "Cook food"];
// let workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


mongoose.connect(`mongodb+srv://jemini:${process.env.PW}@cluster0.red21.mongodb.net/todolistDB`);

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your to do list."
});

const item2 = new Item({
    name: "Hit the + button to add new items."
});

const item3 = new Item({
    name: "<--- hit this to delete me."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: "Today",
                newListItem: foundItems
            });
        }
    });
});


app.post("/", function (req, res) {

    let itemName = req.body.newItem;
    let listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Removed item by id");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkedItemId
                }
            }
        }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
});



app.get("/:paramName", function (req, res) {
    const customListName = _.capitalize(req.params.paramName);

    List.findOne({
        name: customListName
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                //create list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();

                res.redirect("/" + customListName);
            } else {
                //show existing list
                res.render("list", {
                    listTitle: foundList.name,
                    newListItem: foundList.items
                })
            }
        }
    });




});

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
});




app.listen(process.env.PORT || 3000, function () {
    console.log("Server on port 3000");
});