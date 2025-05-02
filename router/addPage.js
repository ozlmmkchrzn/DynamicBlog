const express = require('express')
const router = express.Router()
const {join} = require('path')
const Content = require(join(__dirname, '..', 'model', 'contentModel.js'))

const nowTime = () => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const allName = `${day}.${month + 1}.${year}`
    return allName
}


router.get('/', (req, res) => {
    if(!res.locals.user){
        return res.redirect('/error')
    }
    res.render('site/add')
})

router.post('/', (req, res) => {
    try {
        if(!res.locals.user){
            return res.json({
                case: false,
                message: 'Yetkisisz Erişim!'
            })
        }
        if(!req.body || !req.files){
            return res.json({
                case: false,
                message: 'Veri iletilemedi! req.body req.files'
            })
        }

        const {title, content, name} = req.body
        const {file} =req.files // dosya cekmek icin

        if(!title || !content ||!file){
            return res.json({
                case: false,
                message: 'Veri iletilemedi! single data'
            })
        }

        if(file.size > 1024 * 1024 * 5){
            return res.json({
                case: false,
                message: 'Dosya boyutu istenilen aralıkta değil!'
            })
        }

        if(file.mimetype == 'image/png'|| file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
            const extension = file.mimetype.split('/')[1]
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`
            const pathName = join(__dirname, '..', 'public', 'img', 'content', uniqueName)
            file.mv(pathName, (error) => {
                if(error !== undefined){
                    return res.json({
                        case: false,
                        message: 'Dosya eklenemedi!'
                    })
                }
                else{
                    const contents = new Content({
                        title,
                        content,
                        name,
                        'file': `/img/content/${uniqueName}`,
                        date: nowTime()
                    })
                    
                    contents.save().then(() => {
                        return res.json({
                            case: true,
                            message: 'Veri Kaydedildi!'
                        })
                    }).catch(err => {
                        console.log(err)
                        return res.json({
                            case: false,
                            message: 'Bir hata oluştu!'
                        })
                    })
                }
            })
            
        }
        else{
            return res.json({
                case: false,
                message: 'Dosya istenilen türde değil!'
            })
        }

        
    } catch (error) {
            return res.json({
                case: false,
                message: 'Beklenilmeyen Hata!'
            })
    }
})

module.exports = router