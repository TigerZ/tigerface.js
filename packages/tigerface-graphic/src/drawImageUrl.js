function drawImageUrl(url, props = {}) {
    const img = new Image();
    const g = this;
    img.onload = function () {
        const {
            pos = { x: 0, y: 0 },
            applyDevicePixelRatio = false,
        } = props;

        const {
            clip = {
                x: pos.x,
                y: pos.y,
            },
        } = props;

        let {
            size,
        } = props;

        if (clip.x !== undefined && clip.x < 1) clip.x *= this.width;
        if (clip.y !== undefined && clip.y < 1) clip.y *= this.height;
        if (clip.width !== undefined && clip.width < 1) clip.width *= this.width;
        if (clip.height !== undefined && clip.height < 1) clip.height *= this.height;

        if (clip.x === undefined) clip.x = pos.x;
        if (clip.y === undefined) clip.y = pos.y;
        if (clip.width === undefined) clip.width = this.width - clip.x;
        if (clip.height === undefined) clip.height = this.height - clip.y;

        if (!size) {
            size = {
                width: clip.width,
                height: clip.height,
            };
        }

        console.log('**********', {
            clip,
            pos,
            size,
        });

        g.drawImage(
            img,
            clip.x,
            clip.y,
            clip.width,
            clip.height,
            pos.x * (applyDevicePixelRatio ? g.devicePixelRatio : 1),
            pos.y * (applyDevicePixelRatio ? g.devicePixelRatio : 1),
            size.width * (applyDevicePixelRatio ? g.devicePixelRatio : 1),
            size.height * (applyDevicePixelRatio ? g.devicePixelRatio : 1),
        );
    };
    img.src = url;
}

export default drawImageUrl;
