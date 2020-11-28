
let express = require('express')
let bp = require('body-parser')
const { Client } = require('pg')

const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'sammy',
    password: '1234',
  })

client.connect().then(() => console.log('connected'))
.catch(err => console.error('connection error', err.stack))

client.query("SELECT * FROM bubble",(err,res)=> {
    if(err) {
        throw err
    }
    else {
        console.log(res.rows)
    }
})

var app = express()

app.set("view engine", "hbs");

function BubbleSort(array) {
    for(let i=array.length - 1;i>=1;i--) {
        let maxIndex = i 
        for(let j=0;j<i;j++) {  
            if(array[j]>array[maxIndex]) {
                maxIndex = j
            }
        }
        [array[maxIndex],array[i]] = [array[i],array[maxIndex]]
    }
    return array
}

app.use('/static',express.static(__dirname + '/public'))

let urlencodedParser = bp.urlencoded({exteded:false})

app.get('/', urlencodedParser,function (req, res) {
    res.render("main.hbs")
});

app.post('/',urlencodedParser,(req,res) => {
    client.query("INSERT INTO bubble VALUES($1)",[req.body.stringArray],(err,res)=> {
        if(err) console.log("ERR")
    })
    
    res.render("main.hbs", {
        stringArray: BubbleSort(req.body.stringArray.split(',').map(Number))
    })
})

app.listen(3000)

