const { createCanvas, Image } = require("canvas");

// IMAGE SIZE REDUCER
async function reduce_image_file_size(base64Str, MAX_WIDTH = 450, MAX_HEIGHT = 450) {
    let resized_base64 = await new Promise((resolve) => {

        let img = new Image()
        img.src = `data:${base64Str.type};charset=utf-8;base64,${base64Str.data.toString('base64')}`
        let width = img.width 
        let height = img.height 

        if(img.complete)
        {
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                }
            }

            let canvas = createCanvas(width, height)
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            resolve(canvas.toDataURL()) // this will return base64 image results after resize
        }
    });
    return resized_base64;
}

// If string.endsWith() isn't defined, Polyfill it.
function endsWith(str, targetStr) {
    return str.toString().indexOf(targetStr, str.length - targetStr.length) !== -1;
}

// CALCULATE IMAGE SIZE
function calc_image_size(image) {
    let y = 1;
    if (endsWith(image, "==")) {
        y = 2
    }
    const x_size = (image.length * (3 / 4)) - y
    return Math.round(x_size / 1024)
}

module.exports = { 
    reduce_image_file_size,
    calc_image_size
}

// credit to: https://gist.github.com/ORESoftware/ba5d03f3e1826dc15d5ad2bcec37f7bf 