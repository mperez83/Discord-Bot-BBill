const fs = require("fs");
const gm = require("gm");
const request = require("request");

/*
    GRAPHICSMAGICK OPTIONS THAT MATTER:

    antialias
        -Removes pixel aliasing, which has the benefits of increasing the amount of color in an image, and increasing its rendering speed
        -Only used when drawing objects (e.g. lines) or rendering vector formats (e.g. WMF and Postscript)
    
    average
        -Takes a set of images and generates a single image that is the average of the set
    
    blur (radius, sigma)
        -Blurs an image with the gaussian operator
        -Radius determines ??? (must be less than or equal to half the width or half the height of the image, whichever is smaller)
        -Sigma determines how blurry the image becomes
        -blur is kinda hard to understand, just gotta play around with the values
    
    charcoal (factor)
        -Allegedly it makes the image look like a charcoal drawing, but really it just makes it look crazy
        -Factor must be smaller than half the width or half the height of the image (whichever is smaller)
    
    chop
        -Removes pixels from the interior of an image
        -Takes a WIDTH and HEIGHT as an input, indicating the amount of columns and rows to remove
        -Takes an X and Y position as an input, indicating where to start chopping (x = leftmost column, y = topmost row)
    
    colors (value)
        -Reduces the number of colors in the image to the provided value
    
    contrast (value)
        -Enhances/reduces the intensity of the colors in the image by the provided value
    
    crop
        -Crops the image to the preferred size and location
        -Takes a WIDTH and HEIGHT as an input, indicating how large the image is after the crop
        -Takes an X and Y position as an input, indicating the topleft corner of the cropped image
    
    delay (x/100ths of a second)
        -Specifies how fast a sequence of images in a gif should play
    
    dissolve (percent)
        -Dissolve an image into another by the given percent
    
    emboss (radius)
        -Emboss an image by a given radius
        -Radius must be less than or equal to half the width or half the height of the image (whichever is smaller)
    
    flip
        -Mirror an image across the X axis
    
    flop
        -Mirror an image across the Y axis
    
    implode (intensity)
        -Inflates/deflates an image by the provided intensity
    
    magnify (factor)
        -Multiplies the size of an image by the provided factor
    
    median (radius)
        -Applies a median filter to the image
        -Best results come from really small radius values, like between 1 and 10
    
    modulate (brightness, saturation, hue)
        -Varies the brightness, saturation, and hue of an image by some percentage
        -Default inputs are 100%, which results in no change
        -Subsequent parameters can be omitted to leave them at a default value of 100
        -Hue rotates the colors around the color wheel by some percentage???
    
    monochrome
        -Makes an image black and white (utilitzing dithering to do so)
    
    motionBlur (radius, sigma, angle)
        -Similar to blur, but applies the blur at a given angle
    
    negative
        -Inverses the colors in an image
    
    noise (value)
        -Reduces the amount of noise in an image
        -Works by looking at neighboring pixels and blending them to be the same color if they're determined to be noise
        -Value represents the radius of neighbors to blend together
    
    noise (type)
        -Adds noise to an image
        -Various types, have to look it up
    
    paint
        -Makes the image simulate an oil painting
        -Best results come from really small radius values, like between 1 and 10
    
    quality (value)
        -For PNG images, value represents how well the image compresses
        -0 = fastest compression
        -100 = best, but slowest compression
    
    raise (width, height)
        -Raises the image by brightening/darkening the edges
        -Keep the width and height values the same, or it looks broken
    
    region (width, height, x, y)
        -Applies all proceeding operations to the specified portion of the image
        -Width, height, x, and y are treated as they are in crop
    
    roll (x, y)
        -Roll an image by X pixels horizontally and Y pixels vertically
        -Creates a looping effect
    
    scale (width, height)
        -Scales the image to the specified amount
        -Retains the proportions of the image
    
    shade (angle, elevation)
        -Turn the image into clay and apply a distant light source at the angle
        -They call the angle the azimuth in order to confuse new people

    shave (width, height, percentage)
        -Removes pixels from the edge of an image
        -Width and height represent what they'll remove from EACH SIDE
        -For example, shave(10, 10, true) will remove 10% of an image from the left, 10% from the right, 10% from the top, and 10% from the bottom
    
    size (callback)
        -Returns the dimensions of the image
    
    spread (amount)
        -Randomly displaces pixels in an image by some amount
        -Amount is how many adjacent pixels to choose to swap from
    
    swirl (degrees)
        -Swirls the image by the provided degrees about the center
    
    transparent (color)
        -Makes every pixel that has the provided color transparent
    
    wave (amplitude, waveLength)
        -Alters the image along a sin wave with the provided amplitude and wave length
    
    write (filename)
        -Writes the file to disk!
*/

const workshopLoc = "./graphics/magik_workshop";
module.exports.workshopLoc = workshopLoc;



function reduceImageFileSize(message, filename, chopNum, targetFileSize, callback) {
    gm(`${workshopLoc}/${filename}.png`)
        .minify()
        .write(`${workshopLoc}/${filename}.png`, function (err) {
            if (err) console.error(err);

            let stats = fs.statSync(`${workshopLoc}/${filename}.png`);
            let fileSize = (stats["size"] / 1000000.0).toFixed(2);

            if (fileSize > targetFileSize) {
                reduceImageFileSize(message, filename, chopNum+1, targetFileSize, callback);
            }
            else {
                //message.channel.send(`Image chopped **${chopNum}** time${(chopNum > 1) ? 's' : ''}`);
                callback();
            }
        });
}
module.exports.reduceImageFileSize = reduceImageFileSize;



function writeImageToDisk(foundURL, filename, callback) {
    gm(request(foundURL))
        .write(`${workshopLoc}/${filename}.png`, (err) => {
            if (err) console.error(err);
            callback();
        });
}
module.exports.writeImageToDisk = writeImageToDisk;



function writeAndShrinkImage(message, foundURL, filename, maxFileSize, callback) {
    writeImageToDisk(foundURL, filename, () => {

        let stats = fs.statSync(`${workshopLoc}/${filename}.png`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > maxFileSize) {
            reduceImageFileSize(message, filename, 1, maxFileSize, () => {
                callback();
            });
        }
        else {
            callback();
        }
        
    });
}
module.exports.writeAndShrinkImage = writeAndShrinkImage;



function generateGif(filename, gifFrameCount, gifFrameDelay, callback) {
    let gifImg = gm();

    gifImg
        .delay(gifFrameDelay)
        //.dispose(2);
        .in(`-dispose`, `2`);

    for (let i = 0; i < gifFrameCount; i++) {
        gifImg
            .in(`${workshopLoc}/${filename}-${i}.png`);
    }

    gifImg
        .write(`${workshopLoc}/${filename}.gif`, function(err){
            if (err) throw err;
            callback();
        });
}
module.exports.generateGif = generateGif;