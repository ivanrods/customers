class FilesController {
    async create(req, res){
        res.json({message: 'OK'})
    }
}
export default new FilesController()