const path = require('path');
const express = require('express');
// const morgan = require('morgan')
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

const route = require('./routes');
const sortMiddleware = require('./app/middlewares/SortMiddleware')
const db = require('./config/db');

const port = 3000;
const app = express();

// Connect to DB
db.connect();



//----- Built-in middlewares -----//

// Join path
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(
    // submit by Form default behavior
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json()); // submit by JS

// Override method
app.use(methodOverride('_method'));

// HTTP request logger
// app.use(morgan('combined'));


//----- Custom middlewares -----//

// Sort middleware
app.use(sortMiddleware)



// Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        partialsDir: path.join(__dirname, 'resources', 'views', 'partials'),
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';

                const icons = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                }

                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                }

                const icon = icons[sortType]
                const type = types[sortType]

                return `<a href="?_sort&column=${field}&type=${type}">
                    <span class="${icon}"></span>
                </a>`
            }
        },
    }),
);


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));



// Routes init
route(app);


// Run app
app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
