//pake Express JS
const express = require('express');
const app = express()
const port = 3000
const expressLayouts = require('express-ejs-layouts');
const { load, findC, addC , cekD, delC, upC} = require('./utils/contacts');
const {body, validationResult, check} = require ('express-validator')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// conseconnect-xpress-t morgan =
const cookie = require('cookie');const { detectLocale } = require('yargs');
 require('morgan');
//app level middleware
app.use((req, res, next) =>{
    console.log('Waktu :', Date.now());
    //jika tidak dipanggiil next akan hangging atau berhenti
    next()
})
//template engine EJS
app.set('view engine', 'ejs')

app.use(expressLayouts)
//third party middleware morgan untuk pencatatan logger
// app.use(morgan('dev'))
//express build in
app.use(express.static('public'))

app.use(express.urlencoded({extended : true}))

//konfigurasi
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())
// Melakukan Route method get
// '/' = root web file
// jalankan app dan ada method request ke root dan jika sama maka memunculkan testing
app.get('/', (req, res) => {
    // res.sendFile('./index.html', {root: __dirname})
    const mhs = [
        {
            nama : 'Isal',
            email : 'Isalsyah.man@gmail.com',
        }
    ]
    res.render('index', {layout: 'layouts/main-dash', nama: 'Isal',
     title: '::. SAP TS',
     mhs,})
})

app.get('/about', (req, res, next) => {
    // res.sendFile('./about.html', {root: __dirname})
    res.render('about', 
    {layout: 'layouts/main-dash', title : 'About'})
})

app.get('/contact', (req, res) => {
    const contacts = load()
    // res.sendFile('./contact.html', {root: __dirname})
    res.render('contact', {layout: 'layouts/main-dash', title : 'Contact', contacts, msg: req.flash('msg')})
   
})

//hal form tambah data
app.get('/contact/add', (req, res)=> {
    res.render('add-contact', {
        title: 'tambah form data',
        layout: 'layouts/main-dash',
    })
})

//routing data proses
app.post('/contact', [
    body('nama').custom((value) =>{
        const duplikasi = cekD(value)
        if(duplikasi){
            throw new Error('Nama Kontak Sudah Ada')
        }
        return true
    }),
    check('email', 'Tidak Valid Email').isEmail(),
    check('nohp', 'Tidak Valid Nohp').isMobilePhone('id-ID'), ],(req, res)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){
        // return res.status(400).json({e: e.array()})
        res.render('add-contact', {
            title : 'Form Data Tambah kontak',
            layout: 'layouts/main-dash',
            errs:errs.array()
        })
    }
    else{
    addC(req.body)
    // //redirect
    req.flash('msg', 'Sukses Ditambahkan')
    res.redirect('/contact')
}})
app.get('/contact/delete/:nama', (req, res)=>{
    const contact = findC(req.params.nama)
    if(!contact){
        res.status(404)
        res.render('nf', {layout: 'layouts/main-dash', title : '404'})
    }else{
        delC(req.params.nama)
        req.flash('msg', 'Berhasil dihapus')
        res.redirect('/contact')
    }
})

app.get('/contact/edit/:nama', (req, res)=> {
    const contact = findC(req.params.nama)
    res.render('edit-contact', {
        title: 'Ubah form data',
        layout: 'layouts/main-dash',
        contact,
    })
})

app.post('/contact/update', [
    body('nama').custom((value, {req}) =>{
        const duplikasi = cekD(value)
        if(value!== req.body.namaLama && duplikasi){
            throw new Error('Nama Kontak Sudah Ada')
        }
        return true
    }),
    check('email', 'Tidak Valid Email').isEmail(),
    check('nohp', 'Tidak Valid Nohp').isMobilePhone('id-ID'), ],(req, res)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){
        // return res.status(400).json({e: e.array()})
        res.render('edit-contact', {
            title : 'Form Ubah Data Tambah kontak',
            layout: 'layouts/main-dash',
            errs:errs.array(),
            contact : req.body,
        })
    }
    else{
        upC(req.body)
    // addC(req.body)
    // // //redirect
    req.flash('msg', 'Data Sukses Diubah')
    res.redirect('/contact')
}})


 //params :
app.get('/contact/:nama', (req, res) => {
    const contact = findC(req.params.nama)
    // res.sendFile('./contact.html', {root: __dirname})
    res.render('detail', {layout: 'layouts/main-dash', title : 'Detail', contact})
   
})

// app.get('/produk/:id', (req, res)=>{
//     //menampilkan request berupa object Object berupa id nya objectnya pada paramsnya
//     res.send(`produk id :   ${req.params.id}  <br> Kategori ID : ${req.query.kategori}`)}
// )
// use menjalankan middleware (path, callback) ini akan selalu jalan untuk request apapun baik route halaman kosong sebelumnya
app.use('/', (req, res)=> {
    // res.render('index', {layout: 'layouts/main-dash', title : 'Dash'})
    // res.sendFile('./index.html', {root: __dirname})
    res.status(404)
    res.render('nf', {layout: 'layouts/main-dash', title : '404'})
})
app.listen(port, ()=>{
    console.log(`connected to ${port}`);
})


//manual pake module bawaan node js
// const fs = require('fs');
// const http = require('http');
// const port = 3000

// const renderHtml = (path, res) => {
//     fs.readFile(path, (err, data)=> {
//         if(err){
//             res.writeHead(404);
//             res.write('Error Not Found')
//         }
//         else {
//             res.write(data)
//         }
//         res.end()
//     })    
//     }
// http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'})
//     const url = req.url
//     //perulangan sederhana
//     // if(url === '/about'){
//     //     renderHtml('./about.html', res)   
//     // }
//     // else if(url === '/contact'){
//     //     renderHtml('./contact.html', res)
//     // }
//     // else{
//     //     renderHtml('./index.html', res)
//     // }
// switch(url){
//     case '/about':
//         renderHtml('./about.html', res)
//         break;
//     case '/contact':
//         renderHtml('./contact.html', res)
//         break;
//     default:
//         renderHtml('./index.html', res)
//         break;
// }

// }).listen(port, () => {
//     console.log(`Connected on ${port}`);
// })

