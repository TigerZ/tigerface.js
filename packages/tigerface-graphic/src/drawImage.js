function drawImage(img, props = {}) {
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

    if (clip.x !== undefined && clip.x < 1) clip.x *= img.width;
    if (clip.y !== undefined && clip.y < 1) clip.y *= img.height;
    if (clip.width !== undefined && clip.width < 1) clip.width *= img.width;
    if (clip.height !== undefined && clip.height < 1) clip.height *= img.height;

    if (clip.x === undefined) clip.x = pos.x;
    if (clip.y === undefined) clip.y = pos.y;
    if (clip.width === undefined) clip.width = img.width - clip.x;
    if (clip.height === undefined) clip.height = img.height - clip.y;

    if (!size) {
        size = {
            width: clip.width,
            height: clip.height,
        };
    }

    this.context.drawImage(
        img,
        clip.x,
        clip.y,
        clip.width,
        clip.height,
        pos.x * (applyDevicePixelRatio ? this.devicePixelRatio : 1),
        pos.y * (applyDevicePixelRatio ? this.devicePixelRatio : 1),
        size.width * (applyDevicePixelRatio ? this.devicePixelRatio : 1),
        size.height * (applyDevicePixelRatio ? this.devicePixelRatio : 1),
    );
}

export default drawImage;
