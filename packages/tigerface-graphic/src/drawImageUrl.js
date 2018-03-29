function drawImageUrl(url, props = {}) {
    const img = new Image();
    const g = this;
    img.onload = function () {
        g.drawImage(img, props);
    }
    img.src = url;
}

export default drawImageUrl;
