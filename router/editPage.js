const express = require('express')
const router = express.Router()
const { join } = require('path')
const Content = require(join(__dirname, '..', 'model', 'contentModel.js'))

router.get('/:id', async (req, res) => {
    try {

        if (!res.locals.user) {
            return res.redirect('/error')
        }

        const { id } = req.params
        const data = await Content.findById(id).exec()

        return res.render('site/edit', {
            data: data.toJSON()
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
})

router.post('/', async (req, res) => {
    try {

        if (!res.locals.user) {
            return res.redirect('/error')
        }


        const { title, content, name, id } = req.body
        const { file } = req.files

        if (!title || !content || !name || !id || !file) {
            return res.json({
                case: false,
                message: 'Veri Gönderilemedi!'
            })
        }

        const extension = file.mimetype.split('/')[1]
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`
        const pathName = join(__dirname, '..', 'public', 'img', 'content', uniqueName)
        file.mv(pathName, (error) => {
            if(error !== undefined){
                return res.json({
                    case: false,
                    message: 'Bir Hata Oluştu!'
                })
            }
            Content.findByIdAndUpdate(id, {
                $set: {
                    title,
                    content,
                    name,
                    file: `/img/content/${uniqueName}`
                }
            }).then(() => {
                return res.json({
                    case: true,
                    message: 'İşlem Devam Ediyor...!'
                })
            }).catch((error) => {
                console.log(error)
                return res.json({
                    case: false,
                    message: 'Beklenilmeyen bir hata oluştu!'
                })
            })
        })

    } catch (error) {
        console.log(error)
        return res.json({
            case: false,
            message: 'Beklenilmeyen bir hata oluştu!'
        })
    }
})

module.exports = router