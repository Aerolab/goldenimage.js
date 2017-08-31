const getOrientation = (file, callback) => {
  var reader = new FileReader();
  reader.onload = function(e) {

    var view = new DataView(e.target.result);
    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
    var length = view.byteLength, offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++)
          if (view.getUint16(offset + (i * 12), little) == 0x0112)
            return callback(view.getUint16(offset + (i * 12) + 8, little));
      }
      else if ((marker & 0xFF00) != 0xFF00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

const loadImage = (f, options = {}, callback) => {
  getOrientation(f, (srcOrientation) => {
    const reader = new FileReader();
    reader.addEventListener('load', (file) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }
        const preferedWidth = options.width || canvas.width;
        const outputCompression = options.compression || 0.7;
        let outputType = null
        if (options.compression) {
          outputType = 'image/jpeg';
        }

        switch (srcOrientation) {
          case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
          case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
          case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
          case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
          case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
          case 7: ctx.transform(0, -1, -1, 0, height, width); break;
          case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
          default: ctx.transform(1, 0, 0, 1, 0, 0);
        }

        ctx.drawImage(img, 0, 0);
        const src = canvas.toDataURL(outputType, outputCompression);

        // Resizing
        const img2 = new Image();
        img2.src = src;
        img2.onload = function() {
          const ratio = preferedWidth / canvas.width;
          canvas.width = preferedWidth;
          canvas.height = canvas.height * ratio;
          ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
          callback(canvas.toDataURL(outputType, outputCompression));
        }
      }
      img.src = file.target.result;
    }, false);
    reader.readAsDataURL(f);
  });
}

export default loadImage;
