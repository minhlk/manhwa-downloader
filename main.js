let isLoading = document.getElementById('isLoading')
let fileName = ''
document.getElementById('btn').addEventListener('click', () => {
    let url = document.getElementById('manhwa-url').value
    fetch('https://cors-anywhere.herokuapp.com/' + url, {
        headers: {
            'Origin': 'https://manhwahentai.com'
        },
    }).then(rs => rs.text())
        .then(rs => {
            isLoading.style.visibility = 'visible'
            let tmp = document.createElement('div')
            tmp.innerHTML = rs
            let items = tmp.getElementsByClassName('reading-content')[0].getElementsByTagName('img')
            fileName = tmp.getElementsByClassName('reading-chapter-title')[0].textContent.trim() + '.zip'
            let images = []
            for (let i of items) {
                images.push(i.getAttribute('src').trim())
            }
            saveImagesAsZip(images)
        }).catch(e => {
            alert('Url invalid')
        })

})
function saveImagesAsZip(images) {
    var zip = new JSZip();
    let i = 0
    Promise.all(images.map(image => {
        return new Promise((resolve, reject) => {
            JSZipUtils.getBinaryContent(image, function (err, data) {
                if (err) {
                    reject(err) // or handle the error
                }
                zip.file(i++ + ".png", data, { binary: true });
                resolve(data)


            });
        })
    })).then(_ => {
        zip.generateAsync({ type: "blob" })
            .then(function callback(blob) {
                saveAs(blob, fileName);
                isLoading.style.visibility = 'hidden'
            });
    })


}