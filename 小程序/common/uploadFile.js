module.exports = Behavior({
    methods: {
        onFileSelectChange(e) {
            const currentSelectedFiles = e.detail.currentSelectedFiles[0];
            const field = e.currentTarget.dataset.field;
            currentSelectedFiles.forEach(item => {
                item.status = 'loading';
                item.uploadPath = '';
            });
            let originFiles = e.detail.files;
            this.setData({
                [field]: originFiles.concat(currentSelectedFiles),
            });

            const that = this;
            this.data[field].forEach((file, index) => {
                if (file.status === 'loading') {
                    wx.uploadFile({
                        url: 'https://bm.jslyn.com/common/aliYunUpload',
                        filePath: file.url,
                        name: 'file',
                        header: {
                            Authorization: wx.getStorageSync('Authorization'),
                        },
                        success(res) {
                            const data = JSON.parse(res.data);
                             
                            that.setData({
                                [`${field}[${index}].status`]: 'done',
                                [`${field}[${index}].uploadPath`]: data.data,
                            });
                        },
                        fail() {
                            that.setData({
                                [`${field}[${index}].status`]: 'failed',
                            });
                        },
                    });
                }
            });
        },
        handleUploadFileRemove(e) {
            const field = e.currentTarget.dataset.field;
            const deleteIndex = e.detail.index;

            let files = this.data[field];
            files.splice(deleteIndex, 1);
            this.setData({
                [field]: files,
            });
        },
        handleVerifyUploadPass(field) {
            //上传失败验证
            return field.every(item => item.status === 'done' && item.uploadPath);
        },
    },
});
