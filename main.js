const express = require('express')
const handlebars = require('express-handlebars')

const app = express()
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;


//configure handlebars
app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')
app.set('views', __dirname+ '/views');


/* 
//parse incoming uelencoded/json data 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
 */


app.get("/", (req, resp)=> {
    const cart = []//create empty cart for unique use later
    resp.status(200)
    resp.type('text/html')
    resp.render('index', {
        cartState: JSON.stringify(cart) //init hidden state
    }) 
    
})

//>>const cart1 = [] 

app.post("/", 
    express.urlencoded({extended:true}),
    (req, resp) => {
        const body = req.body
        // console.info("body: ", body)

        //>> cart1.push(body) // always create new var and dun modify original data
        const cart = JSON.parse(body.cartState)
        cart.push(
            {item: body.item, quantity:body.quantity, unitPrice: body.unitPrice}
        )
        resp.status(200)
        resp.type('text/html')
        resp.render('index', {
            cart: cart, 
            cartState: JSON.stringify(cart)
        }) 
        ///>> problem with this is that other ppl who are accessing the same server can see what your cart contents are
        //>> cos using same const []
        //>> to avoid this: create a username and bind to cart to make it unique
        
        
        //alternative: store cart on client side instead of server side so that it is unique
        // ***HIDDEN FIELD: STORES THE STATE OF OUR CART so that it is client stored instead of server stored***
        //>> add <input type="hidden" value = {{cartState}}> on index.hbs to store cart status
        //cons are arr may get too big/if u dun save it will disappear
        


})

//default.hbs loads with index.hbs at {{{body}}}, no index.hbs returned for "/" means nothing is returned

//load static files from dir ie mount dir into express
app.use(express.static(__dirname + '/static'))

app.listen(PORT, () => {
    console.info(`Application started on port ${PORT} at ${new Date()}`)
})